/* ==========================================================================
   OMNAMHAPROPERTIES — site content
   --------------------------------------------------------------------------
   Edit this file to update the website. Reviews, testimonials and blog
   posts below are SAMPLE / PLACEHOLDER content — replace them with the
   real details before going live.

   Property photos and videos live in images/properties/<id>/ and videos/,
   listed per property in js/media.js. Blog posts still use empty image
   placeholders — add `image: 'images/your-photo.jpg'` to show one.
   ========================================================================== */

window.SITE = {
  name: 'OMNAMHAPROPERTIES',
  tagline: 'Real Estate & Property Consultants',

  // Phone numbers. `tel` is used for click-to-call.
  office:   { display: '+91 88260 88750', tel: '+918826088750' },
  // Optional second number — set to { display: '...', tel: '...' } to show it
  // everywhere; leave as null to hide the second-number slots.
  mobile:   null,
  // WhatsApp number: country code + number, digits only.
  whatsapp: { display: '+91 88260 88750', number: '918826088750' },
  email: 'info@omnamhaproperties.in', // PLACEHOLDER — replace with the real email

  // PLACEHOLDER — Google Business Profile summary and "Write a review" link.
  google: { rating: 4.9, count: 48, reviewUrl: '' },

  // Social profile URLs. While a link is empty (''), clicking it shows a "coming soon" note.
  social: { facebook: '', instagram: '', youtube: '' }
};

/* --------------------------------------------------------------------------
   Listings
   status   — 'sale' | 'rent' | null (shown as "Available" until confirmed)
   price    — full amount in rupees (rent = per month); null = "Price on request"
   area     — plot size in sq yd
   parking  — number of car parks (or a short text like '2–4')
   featured — true shows the property in the big featured slider
   Photos and videos for each id are listed in js/media.js
   -------------------------------------------------------------------------- */
window.PROPERTIES = [
  {
    id: 'gk1-s-block-500yd',
    title: '500 Sq Yd Builder Floor for Rent in S Block, Greater Kailash 1',
    status: 'rent', tags: [], featured: true,
    type: 'Builder Floor', floor: null,
    locality: 'Greater Kailash 1',
    address: 'S Block, Greater Kailash 1, New Delhi – 110048',
    price: 325000, beds: null, baths: null, area: 500, parking: null,
    added: '2026-10-11',
    excerpt: 'A spacious floor on a 500 sq yd plot in S Block — one of the most sought-after pockets of Greater Kailash 1.',
    features: ['500 sq yd plot', 'Prime S Block location']
  },
  {
    id: 'gk-enclave-2-corner',
    title: '400 Sq Yd Corner Floor with Lawn for Sale in GK Enclave 2',
    status: 'sale', tags: ['Corner'], featured: true,
    type: 'Builder Floor', floor: '1st Floor',
    locality: 'GK Enclave 2',
    address: 'Greater Kailash Enclave 2, New Delhi – 110048',
    price: 130000000, beds: 4, baths: 5, area: 400, parking: 2,
    added: '2026-10-11',
    excerpt: 'A beautiful corner first floor with four bedrooms, five toilets and separate drawing and dining areas, opening onto a big lawn at the back that faces a park. Peaceful surroundings, a servant room with toilet and a large room in the stilt.',
    features: ['Corner property', 'Big lawn at the back', 'Park at the rear', 'Drawing & dining area', 'Servant room + toilet', 'Large room in stilt', '2 parallel car parks', 'Peaceful area']
  },
  {
    id: 'nfc-terrace-floor',
    title: '500 Sq Yd Third Floor with Terrace for Sale in New Friends Colony',
    status: 'sale', tags: ['Terrace'], featured: true,
    type: 'Builder Floor', floor: '3rd Floor + Terrace',
    locality: 'New Friends Colony',
    address: 'D Block, New Friends Colony, New Delhi – 110025',
    price: 80000000, beds: null, baths: null, area: 500, parking: '2–4',
    added: '2026-10-11',
    excerpt: 'A 500 sq yd third floor on a wide road opposite Mata Mandir, with a private terrace reached through its own entrance from the floor and a room on the terrace. Plenty of space to park for residents and guests.',
    features: ['Terrace with 1 room', 'Separate terrace entrance', 'Wide road', 'Opposite Mata Mandir', '1–2 cars in driveway', '1–2 cars outside', 'Ample guest parking']
  },
  {
    id: 'gk2-s-block-furnished',
    title: 'Fully Furnished Brand-New 4 BHK for Rent in S Block, Greater Kailash 2',
    status: 'rent', tags: ['Fully Furnished', 'Brand New'], featured: true,
    type: 'Builder Floor', floor: '2nd Floor',
    locality: 'Greater Kailash 2',
    address: 'S Block, Greater Kailash 2, New Delhi – 110048',
    price: 250000, beds: 4, baths: null, area: 300, parking: 2,
    added: '2026-10-11',
    excerpt: 'Brand-new, new-height construction with new furniture throughout — four spacious bedrooms with attached bathrooms and a fully loaded kitchen, plus lift, stilt and two car parks.',
    features: ['Fully furnished', 'Brand new · new height', 'Attached bathrooms', 'Fully loaded kitchen', 'Lift & stilt', '2 car parking']
  },
  {
    id: 'gk1-m-block-terrace',
    title: '4 BHK Third Floor with Terrace for Rent in M Block, Greater Kailash 1',
    status: 'rent', tags: ['Terrace'], featured: true,
    type: 'Builder Floor', floor: '3rd Floor + Terrace',
    locality: 'Greater Kailash 1',
    address: 'M Block, Greater Kailash 1, New Delhi – 110048',
    price: 350000, beds: 4, baths: 5, area: 400, parking: 2,
    added: '2026-10-11',
    excerpt: 'A beautiful, well-maintained 4 BHK on the third floor with its own terrace, five washrooms, lift and stilt, and a two-car driveway.',
    features: ['Private terrace', '5 washrooms', 'Lift & stilt', '2-car driveway', 'Well maintained']
  },
  {
    id: 'gk1-4bhk-brand-new',
    title: 'Brand-New 4 BHK Builder Floor for Rent in Greater Kailash 1',
    status: 'rent', tags: ['Brand New'], featured: false,
    type: 'Builder Floor', floor: '2nd Floor',
    locality: 'Greater Kailash 1',
    address: 'Greater Kailash 1, New Delhi – 110048',
    price: 350000, beds: 4, baths: null, area: 500, parking: 3,
    added: '2026-10-11',
    excerpt: 'A never-lived-in 4 BHK on the second floor of a 500 sq yd building, with its own separate gate and parking for three cars.',
    features: ['Brand new, unused', 'Separate gate', '3 car parking', '500 sq yd plot']
  },
  {
    id: 'gk2-s-block-300yd',
    title: 'Brand-New 300 Sq Yd First Floor for Rent in S Block, Greater Kailash 2',
    status: 'rent', tags: ['Brand New'], featured: false,
    type: 'Builder Floor', floor: '1st Floor',
    locality: 'Greater Kailash 2',
    address: 'S Block, Greater Kailash 2, New Delhi – 110048',
    price: 250000, priceNote: '+ maintenance', beds: null, baths: null, area: 300, parking: 2,
    added: '2026-10-11',
    excerpt: 'A brand-new first floor on a 300 sq yd plot in S Block, Greater Kailash 2, with two car parks.',
    features: ['Brand new', '300 sq yd plot', '2 car parking']
  }
];

/* --------------------------------------------------------------------------
   Google reviews (PLACEHOLDER) — paste real reviews from your Google
   Business Profile here. Never publish made-up reviews.
   -------------------------------------------------------------------------- */
window.REVIEWS = [
  { name: 'Client Name', date: '1 week ago', rating: 5, text: 'Found a well-maintained 3 BHK in Greater Kailash within a week. Every property they showed matched our brief and budget, and the paperwork was handled without any confusion.' },
  { name: 'Client Name', date: '2 weeks ago', rating: 5, text: 'Very transparent about pricing and the condition of each property. They negotiated a fair deal for us and stayed in touch until the keys were handed over.' },
  { name: 'Client Name', date: '3 weeks ago', rating: 5, text: 'As tenants new to Delhi we had a lot of questions. The team patiently explained the rental agreement, police verification and society rules. We moved in completely stress-free.' },
  { name: 'Client Name', date: '1 month ago', rating: 5, text: 'Sold our builder floor in East of Kailash at the price we were hoping for. Only genuine buyers, no time-wasting visits.' },
  { name: 'Client Name', date: '1 month ago', rating: 5, text: 'Quick replies on WhatsApp, punctual for every site visit and honest advice — even when it meant not closing a deal that day.' },
  { name: 'Client Name', date: '2 months ago', rating: 5, text: 'Great knowledge of South Delhi localities: which blocks are quieter, where parking is easier and what the resale outlook looks like. That local insight really helped us decide.' }
];

/* Testimonials (PLACEHOLDER) — replace with real client feedback. */
window.TESTIMONIALS = [
  { name: 'Client Name', role: 'Property Buyer', text: 'From the first call to the registry, everything was clear and well organised. They understood exactly what we needed and only shortlisted homes that genuinely fit.' },
  { name: 'Client Name', role: 'Property Seller', text: 'They priced our floor realistically, marketed it well and brought serious buyers. The sale closed faster than we expected, with no surprises along the way.' },
  { name: 'Client Name', role: 'Rental Client', text: 'Finding a good rental in South Delhi can be exhausting. Here it was simple — a handful of well-chosen options within budget, and we signed within days.' },
  { name: 'Client Name', role: 'Investor', text: 'Practical, data-backed advice on which localities hold value. I appreciated the honesty about pros and cons rather than a hard sell.' }
];

/* Blog teasers (SAMPLE) */
window.BLOGS = [
  { title: 'Builder Floor or Apartment? Choosing the Right Home in South Delhi', category: 'Buying Guide', date: '2026-09-26', excerpt: 'Privacy, maintenance, resale and parking — how the two most popular home formats compare for South Delhi families.' },
  { title: 'Documents to Verify Before Buying Property in Delhi', category: 'Legal', date: '2026-09-10', excerpt: 'Title chain, conversion status, sanctioned plans and more — a practical checklist to protect your purchase.' },
  { title: 'Renting in Greater Kailash: A Practical Guide for Tenants', category: 'Renting', date: '2026-08-28', excerpt: 'Typical rents, security deposits, police verification and the questions to ask before signing a lease.' }
];
