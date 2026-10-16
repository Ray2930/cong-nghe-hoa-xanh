(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const UI = {
  vi: { nav_home: 'Trang chủ', nav_about: 'Giới thiệu', nav_products: 'Sản phẩm', nav_blog: 'Cẩm nang sống xanh', nav_contact: 'Liên hệ',
    'cat_rua-tay': 'Nước rửa tay', 'cat_lau-san': 'Nước lau sàn', 'cat_giat': 'Nước giặt', 'cat_rua-chen': 'Nước rửa chén',
    search_ph: 'Tìm sản phẩm…', f_links: 'Liên kết', rights: 'Bảo lưu mọi quyền.',
    view_products: 'Khám phá sản phẩm', learn_more: 'Tìm hiểu thêm', main_product: 'Sản phẩm chủ lực', featured_title: 'Sản phẩm nổi bật',
    featured_sub: 'Giải pháp sạch khuẩn, an lành cho mọi góc nhà.', view_detail: 'Xem chi tiết', about_title: 'Về Công Nghệ Hóa Xanh',
    blog_title: 'Cẩm nang sống xanh', blog_sub: 'Mẹo nhỏ mỗi ngày để nhà sạch hơn, hành tinh xanh hơn.', read_more: 'Đọc tiếp', all_products: 'Tất cả sản phẩm',
    all: 'Tất cả', no_result: 'Không tìm thấy sản phẩm phù hợp.', description: 'Mô tả sản phẩm', benefits: 'Công dụng', usage: 'Hướng dẫn sử dụng', storage: 'Bảo quản',
    ingredients: 'Thành phần', specs: 'Thông số', variants: 'Phân loại sản phẩm', variants_sub: 'Chọn hương để xem chi tiết', back: '← Sản phẩm', phone: 'Điện thoại', support: 'Tư vấn, hỗ trợ mua sắm',
    address: 'Địa chỉ trụ sở', contact_title: 'Thông tin liên hệ', contact_sub: 'Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn.', field: 'Lĩnh vực hoạt động chính',
    not_found: 'Không tìm thấy trang này.', home: 'Về trang chủ', back_blog: '← Cẩm nang', scented: 'hương', seifa_note: 'Thương hiệu Seifa – sản xuất bởi Công Nghệ Hóa Xanh',
    pillars: ['Thân thiện môi trường', 'An toàn cho làn da', 'Sản xuất tại Việt Nam'] },
  en: { nav_home: 'Home', nav_about: 'About', nav_products: 'Products', nav_blog: 'Green Living Guide', nav_contact: 'Contact',
    'cat_rua-tay': 'Hand soap', 'cat_lau-san': 'Floor cleaner', 'cat_giat': 'Laundry liquid', 'cat_rua-chen': 'Dishwashing liquid',
    search_ph: 'Search products…', f_links: 'Links', rights: 'All rights reserved.',
    view_products: 'Explore products', learn_more: 'Learn more', main_product: 'Flagship product', featured_title: 'Featured products',
    featured_sub: 'Clean, gentle solutions for every corner of your home.', view_detail: 'View details', about_title: 'About Green Chemical Technology',
    blog_title: 'Green Living Guide', blog_sub: 'Small daily tips for a cleaner home and a greener planet.', read_more: 'Read more', all_products: 'All products',
    all: 'All', no_result: 'No matching products found.', description: 'Description', benefits: 'Benefits', usage: 'How to use', storage: 'Storage',
    ingredients: 'Ingredients', specs: 'Specifications', variants: 'Product variants', variants_sub: 'Pick a scent to see details', back: '← Products', phone: 'Phone', support: 'Product advice & support',
    address: 'Head office', contact_title: 'Contact information', contact_sub: 'We are always happy to listen and help.', field: 'Main field of operation',
    not_found: 'Page not found.', home: 'Back to home', back_blog: '← Guide', scented: 'scent', seifa_note: 'Seifa brand – made by Green Chemical Technology',
    pillars: ['Eco-friendly', 'Gentle on skin', 'Made in Vietnam'] }
};
const ABOUT = {
  vi: [
    'Công ty TNHH Công Nghệ Hóa Xanh ra đời từ một niềm tin giản dị: một ngôi nhà sạch sẽ không nên phải đánh đổi bằng sức khỏe của gia đình và sự bình yên của môi trường.',
    'Chúng tôi tập trung nghiên cứu và sản xuất các sản phẩm gắn liền với lối sống xanh — từ nước rửa tay, nước rửa chén, nước giặt đến nước lau sàn — với công thức dịu nhẹ, hương thơm tự nhiên và quy trình sản xuất hướng đến sự an toàn ở mọi công đoạn.',
    'Mỗi sản phẩm mang thương hiệu Seifa là sự kết hợp giữa công nghệ hiện đại và tinh thần trân trọng thiên nhiên: làm sạch hiệu quả, bảo vệ làn da, tiết kiệm nhờ dung tích lớn và giảm gánh nặng cho hệ sinh thái quanh ta.',
    'Công Nghệ An Lành – Sống Xanh Mỗi Ngày không chỉ là khẩu hiệu, mà là cam kết chúng tôi theo đuổi cùng từng gia đình Việt.'],
  en: [
    'Green Chemical Technology Co., Ltd. was founded on a simple belief: a clean home should never cost your family\'s health or the peace of our environment.',
    'We focus on researching and manufacturing products for a greener lifestyle — hand soap, dishwashing liquid, laundry liquid and floor cleaner — with gentle formulas, natural fragrances and a production process that puts safety first.',
    'Every Seifa product blends modern technology with respect for nature: effective cleaning, skin protection, savings from large-volume packs and a lighter load on the ecosystem around us.',
    'Gentle Technology – Green Living Every Day is more than a slogan; it is a promise we keep alongside every Vietnamese family.']
};

let lang = localStorage.getItem('cnhx_lang') || 'vi';
let SITE = null, PRODUCTS = [], POSTS = [];
const t = k => (UI[lang][k] != null ? UI[lang][k] : k);
const L = o => (o && (o[lang] || o.vi || o.en)) || '';
const img0 = p => (p.images && p.images[0]) || '';
const catName = c => t('cat_' + c);
const isMain = p => !p.parent;

function applyTheme() {
  const c = SITE.settings.colors;
  const r = document.documentElement.style;
  r.setProperty('--forest', c.forest); r.setProperty('--leaf', c.leaf); r.setProperty('--mint', c.mint); r.setProperty('--cream', c.cream);
}
function applyStatic() {
  document.documentElement.lang = lang;
  $$('[data-i18n]').forEach(e => { e.textContent = t(e.dataset.i18n); });
  $$('[data-i18n-ph]').forEach(e => { e.placeholder = t(e.dataset.i18nPh); });
  $$('.lang button').forEach(b => b.classList.toggle('on', b.dataset.lang === lang));
  const c = SITE.company;
  $('#f-name').textContent = c.name;
  $('#f-field').textContent = t('field') + ': ' + L(c.field);
  $('#f-phone').innerHTML = `${esc(t('phone'))}: <a href="tel:${esc(c.phone.replace(/\s/g, ''))}">${esc(c.phone)}</a>`;
  $('#f-support').innerHTML = `${esc(t('support'))}: <a href="tel:${esc(c.support.replace(/\s/g, ''))}">${esc(c.support)}</a>`;
  $('#f-address').textContent = c.address;
  $('#yr').textContent = new Date().getFullYear();
}
function paras(text) { return String(text || '').split(/\n\n+/).map(p => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join(''); }
function tags(arr) { return arr && arr.length ? `<div class="tags">${arr.map(h => `<span class="tag">#${esc(h)}</span>`).join('')}</div>` : ''; }
function productCard(p) {
  return `<a class="card" href="/san-pham/${esc(p.slug)}" data-link>
    <div class="ph"><img src="${esc(img0(p))}" alt="${esc(L(p.name))}" loading="lazy"></div>
    <div class="tx"><span class="badge">${esc(catName(p.category))}</span><h3>${esc(L(p.name))}</h3><p>${esc(L(p.tagline))}</p></div></a>`;
}
function postCard(p) {
  return `<a class="card post-card" href="/cam-nang/${esc(p.slug)}" data-link>
    <div class="ph"><img src="${esc(p.image)}" alt="${esc(L(p.title))}" loading="lazy"></div>
    <div class="tx"><span class="badge">${esc(p.date)}</span><h3>${esc(L(p.title))}</h3><p>${esc(L(p.excerpt))}</p>${tags(p.hashtags.slice(0, 3))}</div></a>`;
}
function head(title, crumbs) { return `<div class="page-head"><div class="wrap">${crumbs ? `<div class="crumbs">${crumbs}</div>` : ''}<h1>${esc(title)}</h1></div></div>`; }

// ---------- views ----------
function viewHome() {
  const s = SITE.settings, main = PRODUCTS.find(p => p.slug === 'nuoc-rua-tay') || PRODUCTS.find(isMain);
  const others = PRODUCTS.filter(p => isMain(p) && p !== main);
  const cats = ['rua-tay', 'lau-san', 'giat', 'rua-chen'];
  return `
  <section class="hero"><img class="hero-img" src="${esc(s.heroImage)}" alt=""><div class="wrap"><div class="hero-card">
    <span class="eyebrow">CÔNG NGHỆ HÓA XANH</span>
    <h1>${esc(L(s.heroTitle))}</h1><p>${esc(L(s.heroDesc))}</p>
    <a class="btn" href="/san-pham" data-link>${esc(t('view_products'))}</a><a class="btn ghost" href="/gioi-thieu" data-link>${esc(t('learn_more'))}</a>
  </div></div></section>
  <section class="block"><div class="wrap">
    <div class="sec-head"><h2>${esc(t('featured_title'))}</h2><p>${esc(t('featured_sub'))}</p></div>
    ${main ? `<a class="main-product" href="/san-pham/${esc(main.slug)}" data-link style="color:inherit">
      <div class="ph"><img src="${esc(img0(main))}" alt="${esc(L(main.name))}"></div>
      <div class="tx"><span class="badge">${esc(t('main_product'))}</span><h2>${esc(L(main.name))}</h2><p class="muted">${esc(L(main.description))}</p>
      <span class="btn">${esc(t('view_detail'))}</span></div></a>` : ''}
    <div class="cat-row">${cats.map(c => `<a class="cat" href="/san-pham?loai=${c}" data-link>${esc(catName(c))}</a>`).join('')}</div>
    ${others.length ? `<div class="grid cards" style="margin-top:32px">${others.map(productCard).join('')}</div>` : ''}
  </div></section>
  <section class="block alt"><div class="wrap split">
    <div><h2>${esc(t('about_title'))}</h2>${paras(ABOUT[lang].slice(0, 2).join('\n\n'))}<a class="btn" href="/gioi-thieu" data-link>${esc(t('learn_more'))}</a></div>
    <img src="${esc(s.aboutImage)}" alt="" loading="lazy">
  </div></section>
  <section class="block"><div class="wrap">
    <div class="sec-head"><h2>${esc(t('blog_title'))}</h2><p>${esc(t('blog_sub'))}</p></div>
    <div class="grid cards" style="grid-template-columns:repeat(auto-fill,minmax(320px,1fr))">${POSTS.slice(0, 3).map(postCard).join('')}</div>
  </div></section>`;
}
function viewAbout() {
  const c = SITE.company, s = SITE.settings;
  return head(t('nav_about'), `<a href="/" data-link>${esc(t('nav_home'))}</a> / ${esc(t('nav_about'))}`) + `
  <section class="block"><div class="wrap split">
    <div><h2>${esc(c.name)}</h2>${paras(ABOUT[lang].join('\n\n'))}
      <div class="info-box"><h4>${esc(t('field'))}</h4><p style="margin:0">${esc(L(c.field))}</p></div>
      <div class="facts">${UI[lang].pillars.map(x => `<div class="fact">${esc(x)}</div>`).join('')}</div></div>
    <img src="${esc(s.aboutImage)}" alt="" loading="lazy">
  </div></section>`;
}
function viewProducts(q) {
  const cat = q.get('loai');
  const cats = ['rua-tay', 'lau-san', 'giat', 'rua-chen'];
  let list = PRODUCTS.filter(isMain);
  if (cat) list = list.filter(p => p.category === cat);
  return head(cat ? catName(cat) : t('all_products'), `<a href="/" data-link>${esc(t('nav_home'))}</a> / ${esc(t('nav_products'))}`) + `
  <section class="block"><div class="wrap">
    <div class="cat-row" style="margin:0 0 30px"><a class="cat" href="/san-pham" data-link>${esc(t('all'))}</a>${cats.map(c => `<a class="cat" href="/san-pham?loai=${c}" data-link>${esc(catName(c))}</a>`).join('')}</div>
    ${list.length ? `<div class="grid cards">${list.map(productCard).join('')}</div>` : `<div class="empty">${esc(t('no_result'))}</div>`}
  </div></section>`;
}
function viewProduct(slug) {
  const p = PRODUCTS.find(x => x.slug === slug);
  if (!p) return viewNotFound();
  const parent = p.parent && PRODUCTS.find(x => x.slug === p.parent);
  const root = parent || p;
  const variants = PRODUCTS.filter(x => x.parent === root.slug);
  document.title = `${L(p.name)} — CÔNG NGHỆ HÓA XANH`;
  const imgs = p.images.length ? p.images : [''];
  const spec = p.specs && p.specs.length ? `<div class="info-box"><h4>${esc(t('specs'))}</h4><table class="specs">${p.specs.map(s => `<tr><td>${esc(L(s.label))}</td><td><b>${esc(L(s.value))}</b></td></tr>`).join('')}</table></div>` : '';
  const ben = (p.benefits[lang] && p.benefits[lang].length ? p.benefits[lang] : p.benefits.vi) || [];
  const box = (title, text) => text ? `<div class="info-box"><h4>${esc(title)}</h4><p style="margin:0">${esc(text)}</p></div>` : '';
  return head(L(p.name), `<a href="/" data-link>${esc(t('nav_home'))}</a> / <a href="/san-pham" data-link>${esc(t('nav_products'))}</a> / <a href="/san-pham?loai=${esc(p.category)}" data-link>${esc(catName(p.category))}</a>${parent ? ` / <a href="/san-pham/${esc(parent.slug)}" data-link>${esc(L(parent.name))}</a>` : ''}`) + `
  <section class="block"><div class="wrap">
    <div class="detail">
      <div class="gallery"><div class="main"><img id="gmain" src="${esc(imgs[0])}" alt="${esc(L(p.name))}"></div>
        ${imgs.length > 1 ? `<div class="thumbs">${imgs.map((u, i) => `<button class="${i ? '' : 'on'}" data-img="${esc(u)}" aria-label="Image ${i + 1}"><img src="${esc(u)}" alt=""></button>`).join('')}</div>` : ''}</div>
      <div>
        <span class="badge">${esc(catName(p.category))}</span>
        <h2>${esc(L(p.name))}</h2>
        <p class="muted" style="font-size:1.1rem">${esc(L(p.tagline))}</p>
        <div class="info-box" style="margin-top:0"><h4>${esc(t('description'))}</h4><p style="margin:0">${esc(L(p.description))}</p></div>
        ${ben.length ? `<div class="info-box"><h4>${esc(t('benefits'))}</h4><ul class="ticks">${ben.map(b => `<li>${esc(b)}</li>`).join('')}</ul></div>` : ''}
        ${box(t('usage'), L(p.usage))}${box(t('ingredients'), L(p.ingredients))}${box(t('storage'), L(p.storage))}${spec}
        ${tags(p.hashtags)}
      </div>
    </div>
    ${variants.length ? `<div style="margin-top:56px"><div class="sec-head" style="margin-bottom:24px"><h2>${esc(t('variants'))}</h2><p>${esc(t('variants_sub'))}</p></div>
      <div class="variants">${[root, ...variants].map(v => `<a class="variant ${v.slug === p.slug ? 'on' : ''}" href="/san-pham/${esc(v.slug)}" data-link><img src="${esc(img0(v))}" alt="" loading="lazy">${v.swatch ? `<span class="dot" style="background:${esc(v.swatch)}"></span>` : ''}${esc(v === root ? t('all') : L(v.name).replace(/^(Nước Rửa Tay Seifa |Seifa Hand Soap – )/, ''))}</a>`).join('')}</div></div>` : ''}
    <p class="muted small" style="margin-top:36px;text-align:center">${esc(t('seifa_note'))}</p>
  </div></section>`;
}
function viewBlog() {
  return head(t('blog_title'), `<a href="/" data-link>${esc(t('nav_home'))}</a> / ${esc(t('nav_blog'))}`) + `
  <section class="block"><div class="wrap"><div class="grid cards" style="grid-template-columns:repeat(auto-fill,minmax(320px,1fr))">${POSTS.map(postCard).join('')}</div>${POSTS.length ? '' : `<div class="empty">—</div>`}</div></section>`;
}
function viewPost(slug) {
  const p = POSTS.find(x => x.slug === slug);
  if (!p) return viewNotFound();
  document.title = `${L(p.title)} — CÔNG NGHỆ HÓA XANH`;
  return head(L(p.title), `<a href="/cam-nang" data-link>${esc(t('back_blog'))}</a> · ${esc(p.date)}`) + `
  <section class="block"><div class="wrap"><div class="post-body"><img class="post-hero" src="${esc(p.image)}" alt="">${paras(L(p.body))}${tags(p.hashtags)}</div></div></section>`;
}
function viewContact() {
  const c = SITE.company;
  const ph = x => x.replace(/\s/g, '');
  return head(t('contact_title'), `<a href="/" data-link>${esc(t('nav_home'))}</a> / ${esc(t('nav_contact'))}`) + `
  <section class="block"><div class="wrap">
    <div class="sec-head"><h2>${esc(c.name)}</h2><p>${esc(t('contact_sub'))}</p></div>
    <div class="grid contact-cards">
      <div class="contact-card"><div class="ic">📞</div><h4>${esc(t('phone'))}</h4><a class="big" href="tel:${esc(ph(c.phone))}">${esc(c.phone)}</a></div>
      <div class="contact-card"><div class="ic">💬</div><h4>${esc(t('support'))}</h4><a class="big" href="tel:${esc(ph(c.support))}">${esc(c.support)}</a></div>
      <div class="contact-card"><div class="ic">📍</div><h4>${esc(t('address'))}</h4><p style="margin:0">${esc(c.address)}</p></div>
    </div>
    <iframe class="map" loading="lazy" title="Map" src="https://www.google.com/maps?q=${encodeURIComponent(c.address)}&output=embed"></iframe>
  </div></section>`;
}
function viewNotFound() {
  return `<section class="block"><div class="wrap empty"><h2>404</h2><p>${esc(t('not_found'))}</p><a class="btn" href="/" data-link>${esc(t('home'))}</a></div></section>`;
}

// ---------- router ----------
async function route() {
  const path = location.pathname.replace(/\/+$/, '') || '/';
  const q = new URLSearchParams(location.search);
  document.title = 'CÔNG NGHỆ HÓA XANH';
  let html, m;
  if (path === '/') html = viewHome();
  else if (path === '/gioi-thieu') html = viewAbout();
  else if (path === '/san-pham') html = viewProducts(q);
  else if ((m = path.match(/^\/san-pham\/([a-z0-9-]+)$/))) html = viewProduct(m[1]);
  else if (path === '/cam-nang') html = viewBlog();
  else if ((m = path.match(/^\/cam-nang\/([a-z0-9-]+)$/))) html = viewPost(m[1]);
  else if (path === '/lien-he') html = viewContact();
  else html = viewNotFound();
  $('#app').innerHTML = html;
  $$('.nav a').forEach(a => a.classList.toggle('active', a.pathname === path && !a.search));
  $('#nav').classList.remove('open'); $('#burger').setAttribute('aria-expanded', 'false');
  closeResults();
}
function go(url) { history.pushState({}, '', url); route(); window.scrollTo({ top: 0 }); }
document.addEventListener('click', e => {
  const a = e.target.closest('a[data-link]');
  if (a && !e.metaKey && !e.ctrlKey && !e.shiftKey && a.target !== '_blank') { e.preventDefault(); go(a.getAttribute('href')); return; }
  const th = e.target.closest('.thumbs button');
  if (th) { $('#gmain').src = th.dataset.img; $$('.thumbs button').forEach(b => b.classList.toggle('on', b === th)); }
  if (!e.target.closest('.search')) closeResults();
});
window.addEventListener('popstate', route);

// ---------- search ----------
function closeResults() { const r = $('#results'); if (r) r.hidden = true; }
$('#q').addEventListener('input', e => {
  const v = e.target.value.trim().toLowerCase();
  const box = $('#results');
  if (!v) return closeResults();
  const hits = PRODUCTS.filter(p => [p.name.vi, p.name.en, p.tagline.vi, p.tagline.en, ...(p.hashtags || [])].join(' ').toLowerCase().includes(v)).slice(0, 8);
  box.innerHTML = hits.length ? hits.map(p => `<a href="/san-pham/${esc(p.slug)}" data-link><img src="${esc(img0(p))}" alt=""><span><b>${esc(L(p.name))}</b><br><small class="muted">${esc(catName(p.category))}</small></span></a>`).join('') : `<div class="none">${esc(t('no_result'))}</div>`;
  box.hidden = false;
});
$('#q').addEventListener('keydown', e => { if (e.key === 'Escape') { closeResults(); e.target.blur(); } });

// ---------- language & menu ----------
$$('.lang button').forEach(b => b.addEventListener('click', () => {
  lang = b.dataset.lang; localStorage.setItem('cnhx_lang', lang); applyStatic(); route();
}));
$('#burger').addEventListener('click', () => {
  const o = $('#nav').classList.toggle('open'); $('#burger').setAttribute('aria-expanded', o);
});

// ---------- boot ----------
(async function init() {
  $('#app').innerHTML = `<div class="loading">…</div>`;
  try {
    const [site, prods, posts] = await Promise.all([fetch('/api/site').then(r => r.json()), fetch('/api/products').then(r => r.json()), fetch('/api/posts').then(r => r.json())]);
    SITE = site; PRODUCTS = prods; POSTS = posts;
  } catch (e) { $('#app').innerHTML = `<div class="loading">Không tải được dữ liệu. Vui lòng thử lại.</div>`; return; }
  applyTheme(); applyStatic(); route();
})();
})();
