// Tạo data/db.json (chạy 1 lần: node seed.js). Không ghi đè nếu db.json đã tồn tại (dùng --force để ghi đè).
const fs = require('fs');
const out = __dirname + '/data/db.json';
if (fs.existsSync(out) && !process.argv.includes('--force')) { console.log('db.json đã có — bỏ qua'); process.exit(0); }

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3IHL6l9KK5anTTS2gfoljd5M5GU/';
const IMG = {
  hero: CDN + 'hf_20261016_034506_e4c97e23-c86e-487b-96ef-b6332b08a403.png',
  about: CDN + 'hf_20261016_034506_312949c2-3b41-479c-bb46-17a46b22b10b.png',
  post1: CDN + 'hf_20261016_034505_bea755f7-ff69-496e-afbd-375a8b8ff84a.png',
  post2: CDN + 'hf_20261016_034506_487953bd-a2e8-475f-be7c-086b4ad9285c.png'
};
const t = (vi, en) => ({ vi, en });

const handCommon = {
  category: 'rua-tay',
  description: t(
    'Nước rửa tay diệt khuẩn dưỡng da Seifa với Triclosan giúp bảo vệ da tay, diệt khuẩn hữu hiệu. Vitamin E giúp da tay được giữ ẩm và chống lão hóa. Hương thơm chiết xuất tự nhiên, dễ chịu, khử mùi hiệu quả, cho đôi tay thơm mát.',
    'Seifa antibacterial hand soap with Triclosan protects the skin of your hands while effectively killing germs. Vitamin E keeps hands moisturized. Naturally derived fragrance leaves hands fresh and pleasantly scented.'),
  usage: t('Cho một lượng vừa đủ nước rửa tay vào lòng bàn tay, nhẹ nhàng rửa kỹ bàn tay, cổ tay, giữa các ngón tay và kẽ móng tay trong khoảng 20 giây. Rửa lại bằng nước sạch.',
    'Dispense a suitable amount into your palm and gently wash palms, wrists, between fingers and under nails for about 20 seconds. Rinse with clean water.'),
  storage: t('Để nơi khô ráo, thoáng mát; tránh ánh nắng trực tiếp và nơi có nhiệt độ cao.', 'Store in a cool, dry place away from direct sunlight and high temperatures.'),
  ingredients: t('Aqua, Sodium lauryl ether sulphate, Cocamidopropyl Betaine, Palm kernel oil, Sodium chloride, Tetrasodium EDTA, Acid citric, Glycol distearate, Polyquaternium 7, Castoryl maleat, Methylchloroisothiazolinone.',
    'Aqua, Sodium lauryl ether sulphate, Cocamidopropyl Betaine, Palm kernel oil, Sodium chloride, Tetrasodium EDTA, Citric acid, Glycol distearate, Polyquaternium 7, Castoryl maleat, Methylchloroisothiazolinone.'),
  benefits: {
    vi: ['Làm sạch đến 99,9% vi khuẩn gây bệnh truyền nhiễm', 'Bảo vệ sức khỏe của bạn và gia đình', 'Bình 5 lít tiết kiệm', 'Hương tự nhiên dễ chịu, không làm khô da tay, phù hợp với da tay trẻ em'],
    en: ['Removes up to 99.9% of disease-causing germs', 'Protects the health of you and your family', 'Economical 5-litre can', 'Pleasant natural scent, does not dry out hands, suitable for children\'s skin']
  },
  specs: [
    { label: t('Dung tích', 'Volume'), value: t('5 lít', '5 L') },
    { label: t('Xuất xứ', 'Origin'), value: t('Việt Nam', 'Vietnam') },
    { label: t('Thương hiệu', 'Brand'), value: t('Seifa', 'Seifa') }
  ],
  hashtags: ['ruatay', 'nuocruatay', 'nuocruataydietkhuan', 'xaphongruatay', 'dietkhuan', 'satkhuan']
};
const scents = [
  ['huong-dau', 'Hương Dâu', 'Strawberry', 'hs-dau.png', '#e8708f'],
  ['huong-lavender', 'Hương Lavender', 'Lavender', 'hs-lavender.png', '#a98fd1'],
  ['huong-tra-xanh', 'Hương Trà Xanh', 'Green Tea', 'hs-tra-xanh.png', '#7fa83b'],
  ['huong-co', 'Hương Cỏ', 'Fresh Grass', 'hs-co.png', '#8dc63f'],
  ['huong-tao', 'Hương Táo', 'Apple', 'hs-tao.png', '#b5c93a'],
  ['huong-phan', 'Hương Phấn', 'Powder', 'hs-phan.png', '#f0a1b8'],
  ['tinh-dau-chanh-sa', 'Tinh Dầu Chanh Sả', 'Lemongrass & Lemon Oil', 'hs-chanh-sa.png', '#6e9a2e'],
  ['khong-mui', 'Không Mùi', 'Fragrance-free', 'hs-khong-mui.png', '#cfd8cf']
];
const products = [
  {
    slug: 'nuoc-rua-tay', featured: true, order: 1, parent: '', swatch: '#4caf6d', ...handCommon,
    name: t('Nước Rửa Tay Diệt Khuẩn Seifa', 'Seifa Antibacterial Hand Soap'),
    tagline: t('Diệt khuẩn 99,9% – dưỡng ẩm mềm mịn – 8 hương tự nhiên', 'Kills 99.9% of germs – moisturizing – 8 natural scents'),
    images: ['/uploads/hs-bo-suu-tap.png', '/uploads/hs-bo-suu-tap-2.webp']
  },
  ...scents.map(([slug, vi, en, img, sw], i) => ({
    slug: 'nuoc-rua-tay-' + slug, featured: false, order: 10 + i, parent: 'nuoc-rua-tay', swatch: sw, ...handCommon,
    name: t('Nước Rửa Tay Seifa ' + vi, 'Seifa Hand Soap – ' + en),
    tagline: t('Diệt khuẩn & dưỡng da tay – ' + vi, 'Antibacterial & moisturizing – ' + en),
    images: ['/uploads/' + img]
  })),
  {
    slug: 'nuoc-rua-chen', category: 'rua-chen', featured: false, order: 2, parent: '', swatch: '#8dc63f',
    name: t('Nước Rửa Chén Seifa Hương Chanh', 'Seifa Dishwashing Liquid – Lemon'),
    tagline: t('Công thức kép đánh tan dầu mỡ – chén đĩa sạch bong', 'Dual formula cuts grease – sparkling clean dishes'),
    description: t('Nước rửa chén Seifa hương chanh với công thức kép đánh tan dầu mỡ, giúp chén đĩa sạch bong đến không ngờ và bảo vệ da tay bạn không bị khô so với các loại nước rửa chén thông thường khác.',
      'Seifa lemon dishwashing liquid with a dual formula that cuts through grease for sparkling dishes, while being gentler on your hands than ordinary dishwashing liquids.'),
    usage: t('Sử dụng trực tiếp hoặc pha loãng sản phẩm vào nước, rửa sạch các vết dầu mỡ sau đó rửa lại bằng nước sạch.', 'Use directly or dilute in water, wash away grease, then rinse with clean water.'),
    storage: t('Để nơi khô ráo, thoáng mát; tránh ánh nắng trực tiếp.', 'Store in a cool, dry place away from direct sunlight.'),
    ingredients: t('Water, Linear Alkyl Sulfonic Acid, Magnesium Sulfate, Tinh chất chanh tươi, Vitamin E,…', 'Water, Linear Alkyl Sulfonic Acid, Magnesium Sulfate, fresh lemon essence, Vitamin E,…'),
    benefits: { vi: ['Công thức kép đánh tan dầu mỡ', 'Chén đĩa sạch bong', 'Dịu nhẹ, bảo vệ da tay', 'Hương chanh tươi mát'], en: ['Dual grease-cutting formula', 'Sparkling clean dishes', 'Gentle, protects hands', 'Fresh lemon scent'] },
    specs: [{ label: t('Dung tích', 'Volume'), value: t('5 lít', '5 L') }, { label: t('Hương', 'Scent'), value: t('Chanh', 'Lemon') }, { label: t('Thương hiệu', 'Brand'), value: t('Seifa', 'Seifa') }],
    hashtags: ['nuocruachen', 'huongchanh', 'sachdaumo', 'songxanh'], images: ['/uploads/rua-chen.png']
  },
  {
    slug: 'nuoc-giat', category: 'giat', featured: false, order: 3, parent: '', swatch: '#4d9fd1',
    name: t('Nước Giặt Seifa X4 Đậm Đặc', 'Seifa X4 Concentrated Laundry Liquid'),
    tagline: t('Giặt sạch vượt trội – giữ bền màu quần áo – hương thơm tươi mát', 'Outstanding cleaning – keeps colors vibrant – fresh scent'),
    description: t('Nước giặt Seifa X4 đậm đặc mang lại hiệu quả giặt sạch vượt trội, giúp đánh bật các vết bẩn cứng đầu mà vẫn giữ bền màu quần áo với hương thơm tươi mát. Phù hợp trên các chất liệu vải khác nhau.',
      'Seifa X4 concentrated laundry liquid delivers outstanding cleaning power against stubborn stains while keeping clothes\' colors vibrant, with a fresh scent. Suitable for different fabrics.'),
    usage: t('Hòa tan với lượng nước vừa đủ, vò và xả quần áo 2–3 lần với nước sạch. Điều chỉnh lượng nước giặt tương ứng với lượng quần áo và độ bẩn.', 'Dissolve in a suitable amount of water, wash and rinse clothes 2–3 times with clean water. Adjust the dose to the load and soil level.'),
    storage: t('Để nơi khô ráo, thoáng mát; tránh ánh nắng trực tiếp.', 'Store in a cool, dry place away from direct sunlight.'),
    ingredients: t('Sodium Linear Alkylbenzene Sulfonate, Sodium Laureth Sulfate, Lauric Acid, Palmitic Acid, Triethanolamine, Enzyme, Nước, Hương thơm tự nhiên,…', 'Sodium Linear Alkylbenzene Sulfonate, Sodium Laureth Sulfate, Lauric Acid, Palmitic Acid, Triethanolamine, Enzyme, Water, natural fragrance,…'),
    benefits: { vi: ['Công thức đậm đặc X4', 'Đánh bật vết bẩn cứng đầu', 'Giữ bền màu quần áo', 'Phù hợp nhiều chất liệu vải'], en: ['X4 concentrated formula', 'Removes stubborn stains', 'Keeps colors vibrant', 'Suitable for many fabrics'] },
    specs: [{ label: t('Dung tích', 'Volume'), value: t('5 lít', '5 L') }, { label: t('Dòng', 'Type'), value: t('Đậm đặc X4', 'Concentrated X4') }, { label: t('Thương hiệu', 'Brand'), value: t('Seifa', 'Seifa') }],
    hashtags: ['nuocgiat', 'giatsach', 'giatdamdac', 'songxanh'], images: ['/uploads/giat.png']
  },
  {
    slug: 'nuoc-lau-san', category: 'lau-san', featured: false, order: 4, parent: '', swatch: '#6fb58f',
    name: t('Nước Lau Sàn Seifa Hương Hoa Lily', 'Seifa Floor Cleaner – Lily'),
    tagline: t('Sàn nhà sạch bóng – sáng bóng – ngát hương hoa tự nhiên', 'Spotless, shiny floors with a natural floral scent'),
    description: t('Nước lau sàn Seifa hương hoa Lily với công nghệ tiên tiến đánh bật mọi vi khuẩn, vết bẩn và bụi bám ở mọi ngóc ngách trong nhà, cho sàn nhà sạch bóng, sáng bóng và ngát hương thơm tự nhiên.',
      'Seifa Lily floor cleaner uses advanced technology to remove germs, stains and dust from every corner, leaving floors spotless, shiny and naturally fragrant.'),
    usage: t('Hoà tan sản phẩm vào nước, thấm ướt khăn hoặc cây lau nhà và lau sạch các vết bẩn.', 'Dilute in water, wet a cloth or mop and wipe the floor clean.'),
    storage: t('Để nơi khô ráo, thoáng mát; tránh ánh nắng trực tiếp.', 'Store in a cool, dry place away from direct sunlight.'),
    ingredients: t('Water, Fatty Alcohol Ethoxylate, Acid Citric, Triethanolamine, Polyacrylic Acid, Benzoisothiazolinone, Hương hoa tự nhiên, Bạc hà,…', 'Water, Fatty Alcohol Ethoxylate, Citric Acid, Triethanolamine, Polyacrylic Acid, Benzoisothiazolinone, natural floral fragrance, mint,…'),
    benefits: { vi: ['Đánh bật vi khuẩn, vết bẩn, bụi bám', 'Sàn sạch bóng, sáng bóng', 'Hương hoa Lily tự nhiên ngát thơm'], en: ['Removes germs, stains and dust', 'Spotless, shiny floors', 'Natural Lily fragrance'] },
    specs: [{ label: t('Dung tích', 'Volume'), value: t('5 lít', '5 L') }, { label: t('Hương', 'Scent'), value: t('Hoa Lily', 'Lily') }, { label: t('Thương hiệu', 'Brand'), value: t('Seifa', 'Seifa') }],
    hashtags: ['nuoclausan', 'sanbong', 'hoalily', 'songxanh'], images: ['/uploads/lau-san.png']
  }
];

const posts = [
  {
    slug: '5-thoi-quen-song-xanh-trong-can-bep', date: '2026-10-10', image: IMG.post1,
    title: t('5 thói quen sống xanh ngay trong căn bếp nhà bạn', '5 green habits you can start in your kitchen'),
    excerpt: t('Sống xanh không cần làm điều gì quá lớn lao — hãy bắt đầu từ chính căn bếp.', 'Living green does not need grand gestures — start in your kitchen.'),
    body: t(
      'Căn bếp là nơi chúng ta dùng nước, chất tẩy rửa và bao bì nhiều nhất mỗi ngày. Chỉ cần thay đổi vài thói quen nhỏ, bạn đã góp phần giảm rác thải và bảo vệ nguồn nước.\n\n1. Mua bình lớn, dùng lâu dài. Chọn chất tẩy rửa đóng bình 5 lít để chiết ra chai nhỏ dùng dần, giảm số lượng vỏ chai nhựa dùng một lần.\n\n2. Dùng đúng liều lượng. Pha loãng nước rửa chén theo hướng dẫn, đừng đổ quá nhiều. Ít bọt hơn nhưng vẫn sạch — vừa tiết kiệm vừa đỡ gánh nặng cho nguồn nước thải.\n\n3. Ưu tiên khăn vải, bọt biển có thể giặt lại thay cho giấy lau dùng một lần.\n\n4. Rửa chén bằng nước vừa đủ. Tắt vòi khi đang chà xà phòng, chỉ mở lại để tráng.\n\n5. Trồng một chậu rau thơm cạnh cửa sổ bếp: sả, húng quế, bạc hà. Không chỉ đẹp mắt mà còn là mùi hương tự nhiên cho cả nhà.\n\nSống xanh là hành trình bền bỉ, mỗi ngày một chút. Cùng Công Nghệ Hóa Xanh làm cho căn nhà của bạn sạch hơn, an lành hơn.',
      'The kitchen is where we use the most water, cleaning products and packaging every day. A few small habits can reduce waste and protect our water.\n\n1. Buy big, use long. Choose 5-litre cleaners and refill small bottles, cutting down on single-use plastic.\n\n2. Use the right dose. Dilute dishwashing liquid as directed. Less foam, same clean — better for you and for wastewater.\n\n3. Prefer washable cloths and sponges over disposable paper.\n\n4. Use just enough water. Turn the tap off while scrubbing and on again only to rinse.\n\n5. Grow a small herb pot on the kitchen windowsill: lemongrass, basil, mint. It looks lovely and gives your home a natural scent.\n\nGreen living is a steady journey, a little every day. Let Green Chemical Technology help make your home cleaner and calmer.'),
    hashtags: ['songxanh', 'canbepxanh', 'giamracthainhua', 'tietkiemnuoc', 'congnghehoaxanh']
  },
  {
    slug: 'rua-tay-dung-cach-bao-ve-gia-dinh', date: '2026-10-14', image: IMG.post2,
    title: t('Rửa tay đúng cách — lá chắn đơn giản bảo vệ cả gia đình', 'Washing hands properly — a simple shield for the whole family'),
    excerpt: t('Chỉ 20 giây mỗi lần, bạn có thể giảm đáng kể nguy cơ lây nhiễm trong gia đình.', 'Just 20 seconds can greatly reduce infection risk at home.'),
    body: t(
      'Rửa tay là thói quen vệ sinh đơn giản nhưng hiệu quả bậc nhất để phòng bệnh truyền nhiễm. Dưới đây là cách rửa tay đúng:\n\nBước 1: Làm ướt tay bằng nước sạch.\nBước 2: Lấy một lượng vừa đủ nước rửa tay vào lòng bàn tay.\nBước 3: Chà kỹ lòng bàn tay, mu bàn tay, giữa các ngón tay, đầu ngón tay và kẽ móng tay trong khoảng 20 giây.\nBước 4: Chà cổ tay.\nBước 5: Rửa lại bằng nước sạch và lau khô bằng khăn sạch.\n\nHãy rửa tay trước khi ăn, sau khi đi vệ sinh, sau khi về nhà và trước khi chuẩn bị thức ăn. Với trẻ nhỏ, hãy biến việc rửa tay thành một trò chơi vui — hát một bài hát đủ 20 giây.\n\nChọn nước rửa tay có thêm thành phần dưỡng ẩm như Vitamin E để đôi tay vừa sạch khuẩn vừa mềm mại.',
      'Handwashing is a simple yet very effective habit for preventing infectious diseases. Here is how to do it properly:\n\nStep 1: Wet your hands with clean water.\nStep 2: Dispense a suitable amount of hand soap into your palm.\nStep 3: Scrub palms, backs of hands, between fingers, fingertips and under nails for about 20 seconds.\nStep 4: Scrub your wrists.\nStep 5: Rinse with clean water and dry with a clean towel.\n\nWash before eating, after using the toilet, after coming home and before preparing food. For kids, make it a game — sing a song that lasts 20 seconds.\n\nChoose a hand soap with moisturizing ingredients such as Vitamin E so your hands stay clean and soft.'),
    hashtags: ['ruatay', 'suckhoegiadinh', 'dietkhuan', 'songkhoe', 'songxanh']
  }
];

const db = {
  company: {
    name: 'CÔNG TY TNHH CÔNG NGHỆ HÓA XANH',
    phone: '0983929012', support: '0797 39 18 08',
    address: 'Số 122 Đường số 19, Phường Thông Tây Hội (Phường 8 cũ), Quận Gò Vấp, Thành phố Hồ Chí Minh, Việt Nam.',
    field: t('Sản xuất xà phòng, chất tẩy rửa, làm bóng và chế phẩm vệ sinh.', 'Manufacture of soap, detergents, polishes and sanitary preparations.')
  },
  settings: {
    heroImage: IMG.hero, aboutImage: IMG.about,
    heroTitle: t('Công Nghệ An Lành – Sống Xanh Mỗi Ngày', 'Gentle Technology – Green Living Every Day'),
    heroDesc: t('Giải pháp chất tẩy rửa sinh học an toàn tuyệt đối cho làn da và thân thiện với hệ sinh thái gia đình bạn.',
      'Bio-based cleaning solutions that are gentle on your skin and friendly to your family\'s ecosystem.'),
    colors: { forest: '#1f4d36', leaf: '#4caf6d', mint: '#dff3e6', cream: '#fbf8ef' }
  },
  products, posts
};
fs.mkdirSync(__dirname + '/data', { recursive: true });
fs.writeFileSync(out, JSON.stringify(db, null, 2));
console.log('Đã tạo db.json:', products.length, 'sản phẩm,', posts.length, 'bài viết');
