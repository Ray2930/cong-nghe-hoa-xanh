// CÔNG NGHỆ HÓA XANH — showcase server (no external deps except "qrcode")
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const QRCode = require('qrcode');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const PUBLIC = path.join(ROOT, 'public');
const DATA_FILE = path.join(ROOT, 'data', 'db.json');
const AUTH_FILE = path.join(ROOT, 'data', 'admin.json');
const UPLOADS = path.join(PUBLIC, 'uploads');

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.gif': 'image/gif'
};

// ---------- storage ----------
function loadDB() { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
function saveDB(db) {
  const tmp = DATA_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DATA_FILE);
}

// ---------- admin auth ----------
function hashPw(pw, salt) {
  salt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(pw, salt, 64).toString('hex');
  return { salt, hash };
}
function initAuth() {
  if (fs.existsSync(AUTH_FILE)) return;
  const user = process.env.ADMIN_USER || 'admin';
  const pw = process.env.ADMIN_PASSWORD || 'ChangeMe@2026';
  fs.writeFileSync(AUTH_FILE, JSON.stringify({ user, ...hashPw(pw) }, null, 2));
  console.log(`[admin] Tạo tài khoản quản trị: "${user}" / "${pw}"  → HÃY ĐỔI MẬT KHẨU trong trang /admin`);
}
function checkLogin(user, pw) {
  const a = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
  if (user !== a.user) return false;
  const h = crypto.scryptSync(String(pw), a.salt, 64);
  return crypto.timingSafeEqual(h, Buffer.from(a.hash, 'hex'));
}
const sessions = new Map(); // token -> expiry
function newSession() {
  const t = crypto.randomBytes(32).toString('hex');
  sessions.set(t, Date.now() + 8 * 3600 * 1000);
  return t;
}
function getCookie(req, name) {
  const c = req.headers.cookie || '';
  const m = c.split(';').map(s => s.trim()).find(s => s.startsWith(name + '='));
  return m ? decodeURIComponent(m.slice(name.length + 1)) : null;
}
function isAdmin(req) {
  const t = getCookie(req, 'cnhx_session');
  if (!t) return false;
  const exp = sessions.get(t);
  if (!exp || exp < Date.now()) { sessions.delete(t); return false; }
  return true;
}
const attempts = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const a = (attempts.get(ip) || []).filter(t => now - t < 15 * 60 * 1000);
  attempts.set(ip, a);
  return a.length >= 8;
}

// ---------- helpers ----------
function send(res, code, body, headers = {}) {
  res.writeHead(code, headers);
  res.end(body);
}
function json(res, code, obj, extra = {}) {
  send(res, code, JSON.stringify(obj), { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra });
}
function readBody(req, limit = 12 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => { size += c.length; if (size > limit) { reject(new Error('too large')); req.destroy(); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}
function slugify(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}
function baseUrl(req) {
  if (process.env.PUBLIC_URL) return process.env.PUBLIC_URL.replace(/\/$/, '');
  const proto = req.headers['x-forwarded-proto'] || 'http';
  return `${proto}://${req.headers.host}`;
}
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- static ----------
function serveFile(req, res, file) {
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) return send(res, 404, 'Not found');
    const ext = path.extname(file).toLowerCase();
    const cache = file.includes(path.sep + 'uploads' + path.sep) ? 'public, max-age=86400' : 'no-cache';
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': cache });
    fs.createReadStream(file).pipe(res);
  });
}
// Index page with per-product meta tags injected (so shared/scanned links show the right title/image)
function servePage(req, res, file, meta) {
  let html = fs.readFileSync(path.join(PUBLIC, file), 'utf8');
  if (meta) {
    const tags = `<title>${esc(meta.title)}</title>
<meta property="og:title" content="${esc(meta.title)}">
<meta property="og:description" content="${esc(meta.desc || '')}">
${meta.image ? `<meta property="og:image" content="${esc(meta.image.startsWith('http') ? meta.image : baseUrl(req) + meta.image)}">` : ''}
<meta property="og:url" content="${esc(baseUrl(req) + req.url.split('?')[0])}">`;
    html = html.replace(/<title>.*?<\/title>/, tags);
  }
  send(res, 200, html, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
}

// ---------- validation ----------
function cleanI18n(o) { return { vi: String((o && o.vi) || ''), en: String((o && o.en) || '') }; }
function cleanProduct(p, existing) {
  const out = {
    slug: slugify(p.slug || (p.name && (p.name.vi || p.name.en))),
    category: ['rua-tay', 'rua-chen', 'giat', 'lau-san'].includes(p.category) ? p.category : 'rua-tay',
    parent: p.parent ? slugify(p.parent) : '',
    featured: !!p.featured,
    order: Number.isFinite(+p.order) ? +p.order : 100,
    name: cleanI18n(p.name), tagline: cleanI18n(p.tagline), description: cleanI18n(p.description),
    usage: cleanI18n(p.usage), storage: cleanI18n(p.storage), ingredients: cleanI18n(p.ingredients),
    benefits: { vi: Array.isArray(p.benefits && p.benefits.vi) ? p.benefits.vi.map(String).filter(Boolean) : [], en: Array.isArray(p.benefits && p.benefits.en) ? p.benefits.en.map(String).filter(Boolean) : [] },
    specs: Array.isArray(p.specs) ? p.specs.map(s => ({ label: cleanI18n(s.label), value: cleanI18n(s.value) })).filter(s => s.label.vi || s.label.en) : [],
    hashtags: Array.isArray(p.hashtags) ? p.hashtags.map(h => String(h).replace(/^#/, '').trim()).filter(Boolean) : [],
    images: Array.isArray(p.images) ? p.images.map(String).filter(Boolean) : [],
    swatch: /^#[0-9a-fA-F]{6}$/.test(p.swatch || '') ? p.swatch : ''
  };
  if (!out.slug) throw new Error('Thiếu tên/slug');
  if (!out.name.vi && !out.name.en) throw new Error('Thiếu tên sản phẩm');
  return out;
}
function cleanPost(p) {
  const out = {
    slug: slugify(p.slug || (p.title && (p.title.vi || p.title.en))),
    title: cleanI18n(p.title), excerpt: cleanI18n(p.excerpt), body: cleanI18n(p.body),
    image: String(p.image || ''), date: /^\d{4}-\d{2}-\d{2}$/.test(p.date || '') ? p.date : new Date().toISOString().slice(0, 10),
    hashtags: Array.isArray(p.hashtags) ? p.hashtags.map(h => String(h).replace(/^#/, '').trim()).filter(Boolean) : []
  };
  if (!out.slug) throw new Error('Thiếu tiêu đề/slug');
  if (!out.title.vi && !out.title.en) throw new Error('Thiếu tiêu đề');
  return out;
}
function cleanSettings(s, cur) {
  const col = (v, d) => (/^#[0-9a-fA-F]{6}$/.test(v || '') ? v : d);
  const c = (s && s.colors) || {};
  return {
    ...cur,
    heroImage: String((s && s.heroImage) || cur.heroImage),
    aboutImage: String((s && s.aboutImage) || cur.aboutImage),
    heroTitle: cleanI18n(s && s.heroTitle), heroDesc: cleanI18n(s && s.heroDesc),
    colors: {
      forest: col(c.forest, cur.colors.forest), leaf: col(c.leaf, cur.colors.leaf),
      mint: col(c.mint, cur.colors.mint), cream: col(c.cream, cur.colors.cream)
    }
  };
}

// ---------- API ----------
async function api(req, res, url) {
  const p = url.pathname;
  const m = req.method;

  // public
  if (m === 'GET' && p === '/api/site') {
    const db = loadDB();
    return json(res, 200, { settings: db.settings, company: db.company });
  }
  if (m === 'GET' && p === '/api/products') {
    const db = loadDB();
    return json(res, 200, db.products.slice().sort((a, b) => a.order - b.order));
  }
  let mm;
  if (m === 'GET' && (mm = p.match(/^\/api\/products\/([a-z0-9-]+)$/))) {
    const db = loadDB();
    const prod = db.products.find(x => x.slug === mm[1]);
    if (!prod) return json(res, 404, { error: 'not found' });
    return json(res, 200, prod);
  }
  if (m === 'GET' && p === '/api/posts') {
    const db = loadDB();
    return json(res, 200, db.posts.slice().sort((a, b) => b.date.localeCompare(a.date)));
  }
  if (m === 'GET' && (mm = p.match(/^\/api\/posts\/([a-z0-9-]+)$/))) {
    const db = loadDB();
    const post = db.posts.find(x => x.slug === mm[1]);
    if (!post) return json(res, 404, { error: 'not found' });
    return json(res, 200, post);
  }
  // QR for a product page (public so the admin preview and printing work); image/svg or png
  if (m === 'GET' && (mm = p.match(/^\/api\/qr\/([a-z0-9-]+)\.(svg|png)$/))) {
    const db = loadDB();
    const prod = db.products.find(x => x.slug === mm[1]);
    if (!prod) return send(res, 404, 'not found');
    const link = `${baseUrl(req)}/san-pham/${prod.slug}`;
    const opts = { errorCorrectionLevel: 'M', margin: 2, width: +url.searchParams.get('size') || 512, color: { dark: '#1f4d36', light: '#ffffff' } };
    if (mm[2] === 'svg') {
      const svg = await QRCode.toString(link, { type: 'svg', errorCorrectionLevel: 'M', margin: 2, color: { dark: '#1f4d36', light: '#ffffff' } });
      return send(res, 200, svg, { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store' });
    }
    const buf = await QRCode.toBuffer(link, opts);
    const headers = { 'Content-Type': 'image/png', 'Cache-Control': 'no-store' };
    if (url.searchParams.get('download')) headers['Content-Disposition'] = `attachment; filename="qr-${prod.slug}.png"`;
    return send(res, 200, buf, headers);
  }

  // admin auth
  if (m === 'POST' && p === '/api/admin/login') {
    const ip = req.socket.remoteAddress || 'x';
    if (rateLimited(ip)) return json(res, 429, { error: 'Thử quá nhiều lần. Vui lòng đợi 15 phút.' });
    let body; try { body = JSON.parse(await readBody(req, 10000)); } catch { return json(res, 400, { error: 'bad request' }); }
    if (!checkLogin(body.user, body.password)) {
      attempts.get(ip).push(Date.now());
      return json(res, 401, { error: 'Sai tên đăng nhập hoặc mật khẩu' });
    }
    const t = newSession();
    return json(res, 200, { ok: true }, { 'Set-Cookie': `cnhx_session=${t}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800` });
  }
  if (m === 'POST' && p === '/api/admin/logout') {
    const t = getCookie(req, 'cnhx_session'); if (t) sessions.delete(t);
    return json(res, 200, { ok: true }, { 'Set-Cookie': 'cnhx_session=; HttpOnly; Path=/; Max-Age=0' });
  }
  if (p.startsWith('/api/admin/')) {
    if (!isAdmin(req)) return json(res, 401, { error: 'Chưa đăng nhập' });
    let body = null;
    if (m !== 'GET' && m !== 'DELETE') {
      try { body = JSON.parse(await readBody(req)); } catch { return json(res, 400, { error: 'Dữ liệu không hợp lệ' }); }
    }
    try {
      if (m === 'GET' && p === '/api/admin/me') return json(res, 200, { ok: true });

      if (m === 'POST' && p === '/api/admin/password') {
        const a = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
        if (!checkLogin(a.user, body.current)) return json(res, 400, { error: 'Mật khẩu hiện tại không đúng' });
        if (String(body.next || '').length < 8) return json(res, 400, { error: 'Mật khẩu mới tối thiểu 8 ký tự' });
        fs.writeFileSync(AUTH_FILE, JSON.stringify({ user: a.user, ...hashPw(String(body.next)) }, null, 2));
        return json(res, 200, { ok: true });
      }

      if (m === 'POST' && p === '/api/admin/upload') {
        const match = /^data:(image\/(png|jpeg|webp|gif));base64,(.+)$/.exec(body.dataUrl || '');
        if (!match) return json(res, 400, { error: 'Chỉ nhận ảnh PNG/JPG/WEBP/GIF' });
        const ext = match[2] === 'jpeg' ? 'jpg' : match[2];
        const buf = Buffer.from(match[3], 'base64');
        if (buf.length > 8 * 1024 * 1024) return json(res, 400, { error: 'Ảnh tối đa 8MB' });
        const name = `${Date.now()}-${crypto.randomBytes(3).toString('hex')}.${ext}`;
        fs.writeFileSync(path.join(UPLOADS, name), buf);
        return json(res, 200, { url: `/uploads/${name}` });
      }

      if (m === 'PUT' && p === '/api/admin/settings') {
        const db = loadDB(); db.settings = cleanSettings(body, db.settings); saveDB(db);
        return json(res, 200, db.settings);
      }

      // products
      if (m === 'POST' && p === '/api/admin/products') {
        const db = loadDB(); const prod = cleanProduct(body);
        if (db.products.some(x => x.slug === prod.slug)) return json(res, 400, { error: `Đường link "${prod.slug}" đã tồn tại — mỗi sản phẩm phải có link riêng` });
        db.products.push(prod); saveDB(db); return json(res, 200, prod);
      }
      if (m === 'PUT' && (mm = p.match(/^\/api\/admin\/products\/([a-z0-9-]+)$/))) {
        const db = loadDB(); const i = db.products.findIndex(x => x.slug === mm[1]);
        if (i < 0) return json(res, 404, { error: 'not found' });
        const prod = cleanProduct(body);
        if (prod.slug !== mm[1] && db.products.some(x => x.slug === prod.slug)) return json(res, 400, { error: `Đường link "${prod.slug}" đã tồn tại — mỗi sản phẩm phải có link riêng` });
        db.products[i] = prod;
        if (prod.slug !== mm[1]) db.products.forEach(x => { if (x.parent === mm[1]) x.parent = prod.slug; });
        saveDB(db); return json(res, 200, prod);
      }
      if (m === 'DELETE' && (mm = p.match(/^\/api\/admin\/products\/([a-z0-9-]+)$/))) {
        const db = loadDB(); const before = db.products.length;
        db.products = db.products.filter(x => x.slug !== mm[1]);
        db.products.forEach(x => { if (x.parent === mm[1]) x.parent = ''; });
        if (db.products.length === before) return json(res, 404, { error: 'not found' });
        saveDB(db); return json(res, 200, { ok: true });
      }

      // posts
      if (m === 'POST' && p === '/api/admin/posts') {
        const db = loadDB(); const post = cleanPost(body);
        if (db.posts.some(x => x.slug === post.slug)) return json(res, 400, { error: `Đường link "${post.slug}" đã tồn tại` });
        db.posts.push(post); saveDB(db); return json(res, 200, post);
      }
      if (m === 'PUT' && (mm = p.match(/^\/api\/admin\/posts\/([a-z0-9-]+)$/))) {
        const db = loadDB(); const i = db.posts.findIndex(x => x.slug === mm[1]);
        if (i < 0) return json(res, 404, { error: 'not found' });
        const post = cleanPost(body);
        if (post.slug !== mm[1] && db.posts.some(x => x.slug === post.slug)) return json(res, 400, { error: `Đường link "${post.slug}" đã tồn tại` });
        db.posts[i] = post; saveDB(db); return json(res, 200, post);
      }
      if (m === 'DELETE' && (mm = p.match(/^\/api\/admin\/posts\/([a-z0-9-]+)$/))) {
        const db = loadDB(); const before = db.posts.length;
        db.posts = db.posts.filter(x => x.slug !== mm[1]);
        if (db.posts.length === before) return json(res, 404, { error: 'not found' });
        saveDB(db); return json(res, 200, { ok: true });
      }
    } catch (e) {
      return json(res, 400, { error: e.message || 'Lỗi' });
    }
    return json(res, 404, { error: 'not found' });
  }
  return json(res, 404, { error: 'not found' });
}

// ---------- router ----------
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    let p = decodeURIComponent(url.pathname);

    if (p.startsWith('/api/')) return await api(req, res, url);

    // admin pages
    if (p === '/admin' || p === '/admin/') return servePage(req, res, 'admin.html', { title: 'Quản trị — CÔNG NGHỆ HÓA XANH' });

    // product page: meta injection
    let mm = p.match(/^\/san-pham\/([a-z0-9-]+)\/?$/);
    if (mm) {
      const prod = loadDB().products.find(x => x.slug === mm[1]);
      if (prod) return servePage(req, res, 'index.html', { title: `${prod.name.vi} — CÔNG NGHỆ HÓA XANH`, desc: prod.tagline.vi, image: prod.images[0] });
    }

    // static files
    const safe = path.normalize(path.join(PUBLIC, p));
    if (safe.startsWith(PUBLIC) && p !== '/' && !p.endsWith('/') && fs.existsSync(safe) && fs.statSync(safe).isFile()) {
      if (/^\/(admin\.html|index\.html)$/.test(p)) return send(res, 404, 'Not found');
      return serveFile(req, res, safe);
    }
    // everything else is the SPA (client router handles /gioi-thieu, /san-pham, /cam-nang/..., /lien-he)
    return servePage(req, res, 'index.html');
  } catch (e) {
    console.error(e);
    send(res, 500, 'Server error');
  }
});

initAuth();
server.listen(PORT, () => console.log(`CÔNG NGHỆ HÓA XANH đang chạy: http://localhost:${PORT}  (admin: /admin)`));
