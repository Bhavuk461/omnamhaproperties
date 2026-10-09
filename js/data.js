/* ==========================================================================
   OMNAMHAPROPERTIES — site content
   --------------------------------------------------------------------------
   Edit this file to update the website. Contact details, reviews and
   listings below are SAMPLE / PLACEHOLDER content — replace them with the
   real details before going live.

   Images: every listing, blog post and the about section render an empty
   placeholder. Add an `image: 'images/your-photo.jpg'` field to any item
   to show a photo instead.
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
   Listings (SAMPLE)
   price  — full amount in rupees (rent = monthly rent)
   status — 'sale' | 'rent'
   tags   — any of: 'Featured', 'Hot Deal', 'Premium', 'Brand New',
            'New Booking', 'Pre-Leased'
   featured: true — shows the property in the big featured slider
   -------------------------------------------------------------------------- */
window.PROPERTIES = [
  {
    id: 'gk1-4bhk-furnished',
    title: '4 BHK Luxuriously Furnished Builder Floor for Sale in Greater Kailash 1',
    status: 'sale', tags: ['Featured', 'Hot Deal'], featured: true,
    type: 'Builder Floor', floor: '1st Floor',
    locality: 'Greater Kailash 1',
    address: 'M Block, Greater Kailash 1, New Delhi – 110048',
    price: 90000000, beds: 4, baths: 4, area: 2700, photos: 14,
    added: '2026-10-06',
    excerpt: 'Fully furnished first-floor residence with four en-suite bedrooms, marble flooring, a modular kitchen and lift access — a short walk from M Block Market.',
    features: ['Fully furnished', 'Lift', 'Stilt parking', 'Park facing']
  },
  {
    id: 'crpark-3bhk-rent',
    title: '3 BHK Fully Furnished Flat for Rent in CR Park',
    status: 'rent', tags: ['Featured'], featured: true,
    type: 'Builder Floor', floor: '2nd Floor',
    locality: 'Chittaranjan Park',
    address: 'Chittaranjan Park, New Delhi – 110019',
    price: 125000, beds: 3, baths: 3, area: 1460, photos: 9,
    added: '2026-10-04',
    excerpt: 'Bright second-floor home with three bedrooms and bathrooms, fully furnished, lift-equipped and with one dedicated car parking slot.',
    features: ['Fully furnished', 'Lift', '1 car parking', 'Power backup']
  },
  {
    id: 'panchsheel-luxury-floors',
    title: 'Ultra-Luxury Multi-Level Builder Floors in Panchsheel Park',
    status: 'sale', tags: ['Featured', 'Hot Deal'], featured: true,
    type: 'Builder Floor', floor: 'Multi-Level',
    locality: 'Panchsheel Park',
    address: 'Panchsheel Park, New Delhi – 110017',
    price: 280000000, beds: 6, baths: 7, area: 6200, photos: 25,
    added: '2026-09-30',
    excerpt: 'A rare multi-level residence in one of South Delhi’s most prestigious colonies, with double-height living, a private terrace and premium imported fittings.',
    features: ['Private terrace', 'Home automation', 'Private lift', '4 car parking']
  },
  {
    id: 'eok-4bhk-rent',
    title: '4 Bedroom Semi-Furnished Flat for Rent in East of Kailash',
    status: 'rent', tags: ['Featured'], featured: true,
    type: 'Builder Floor', floor: '1st Floor',
    locality: 'East of Kailash',
    address: 'East of Kailash, New Delhi – 110065',
    price: 180000, beds: 4, baths: 4, area: 3200, photos: 6,
    added: '2026-09-27',
    excerpt: 'Spacious semi-furnished first floor with four bedrooms and attached bathrooms, lift access and two stilt car parking spaces.',
    features: ['Semi-furnished', 'Lift', '2 stilt parking', 'Servant room']
  },
  {
    id: 'gk1-preleased-showroom',
    title: 'Pre-Leased Ready-to-Move Showroom for Sale in Greater Kailash 1',
    status: 'sale', tags: ['Featured', 'Pre-Leased'], featured: true,
    type: 'Commercial', floor: 'Ground + 2 Floors',
    locality: 'Greater Kailash 1',
    address: 'M Block Market, Greater Kailash 1, New Delhi – 110048',
    price: 320000000, beds: 0, baths: 3, area: 4800, photos: 8,
    added: '2026-09-22',
    excerpt: 'High-street showroom with a running lease and assured rental income, in one of South Delhi’s busiest retail markets.',
    features: ['Running lease', 'High footfall', 'Ready to move', 'Main road frontage']
  },
  {
    id: 'hauzkhas-2bhk-rent',
    title: '2 BHK Builder Floor for Rent in Hauz Khas',
    status: 'rent', tags: [],
    type: 'Builder Floor', floor: '2nd Floor',
    locality: 'Hauz Khas',
    address: 'Hauz Khas, New Delhi – 110016',
    price: 75000, beds: 2, baths: 2, area: 1100, photos: 7,
    added: '2026-10-05',
    excerpt: 'Well-kept two-bedroom floor close to Hauz Khas Village and the Deer Park, ideal for working professionals.',
    features: ['Semi-furnished', 'Park nearby', 'Covered parking']
  },
  {
    id: 'gk2-3bhk-sale',
    title: '3 BHK Builder Floor for Sale in Greater Kailash 2, E Block',
    status: 'sale', tags: [],
    type: 'Builder Floor', floor: '3rd Floor',
    locality: 'Greater Kailash 2',
    address: 'E Block, Greater Kailash 2, New Delhi – 110048',
    price: 56000000, beds: 3, baths: 3, area: 1800, photos: 9,
    added: '2026-10-03',
    excerpt: 'Modern three-bedroom floor with a large living area, lift and stilt parking in a quiet, tree-lined block.',
    features: ['Lift', 'Stilt parking', 'Modular kitchen']
  },
  {
    id: 'hemkunt-3bhk-rent',
    title: '3 BHK Builder Floor for Rent in Hemkunt Colony',
    status: 'rent', tags: [],
    type: 'Builder Floor', floor: 'Ground Floor',
    locality: 'Hemkunt Colony',
    address: 'Hemkunt Colony, Greater Kailash 1, New Delhi – 110048',
    price: 150000, beds: 3, baths: 3, area: 2500, photos: 13,
    added: '2026-10-02',
    excerpt: 'Ground floor with a private lawn, three large bedrooms and easy access to Nehru Place and Greater Kailash markets.',
    features: ['Private lawn', 'Fully furnished', '2 car parking']
  },
  {
    id: 'lajpat2-2bhk-sale',
    title: '2 BHK Builder Floor for Sale in Lajpat Nagar 2',
    status: 'sale', tags: [],
    type: 'Builder Floor', floor: '1st Floor',
    locality: 'Lajpat Nagar 2',
    address: 'Lajpat Nagar 2, New Delhi – 110024',
    price: 21000000, beds: 2, baths: 2, area: 1000, photos: 8,
    added: '2026-09-29',
    excerpt: 'Compact, well-planned two-bedroom floor minutes from Lajpat Nagar Central Market and the metro station.',
    features: ['Near metro', 'Lift', 'Ready to move']
  },
  {
    id: 'eok-1bhk-rent',
    title: '1 BHK Builder Floor for Rent in East of Kailash',
    status: 'rent', tags: [],
    type: 'Builder Floor', floor: '2nd Floor',
    locality: 'East of Kailash',
    address: 'East of Kailash, New Delhi – 110065',
    price: 30000, beds: 1, baths: 1, area: 650, photos: 10,
    added: '2026-09-28',
    excerpt: 'Neat one-bedroom home with a separate kitchen and balcony, suited to singles or young couples.',
    features: ['Balcony', 'Semi-furnished', 'Water backup']
  },
  {
    id: 'lajpat3-3bhk-rent',
    title: '3 BHK Builder Floor for Rent in Lajpat Nagar 3',
    status: 'rent', tags: [],
    type: 'Builder Floor', floor: '1st Floor',
    locality: 'Lajpat Nagar 3',
    address: 'Lajpat Nagar 3, New Delhi – 110024',
    price: 160000, beds: 3, baths: 3, area: 1800, photos: 4,
    added: '2026-09-25',
    excerpt: 'Freshly renovated three-bedroom floor with lift and parking, close to schools and the Ring Road.',
    features: ['Renovated', 'Lift', 'Stilt parking']
  },
  {
    id: 'gk2-4bhk-premium',
    title: '4 BHK Premium Builder Floor for Sale in Greater Kailash 2',
    status: 'sale', tags: ['Premium'],
    type: 'Builder Floor', floor: '2nd Floor',
    locality: 'Greater Kailash 2',
    address: 'Greater Kailash 2, New Delhi – 110048',
    price: 160000000, beds: 4, baths: 5, area: 4450, photos: 9,
    added: '2026-09-24',
    excerpt: 'Premium 500-yard construction with four bedroom suites, a family lounge and high-end specifications throughout.',
    features: ['500 sq yd plot', 'Private lift', 'VRV air-conditioning', 'Stilt parking']
  },
  {
    id: 'defcol-2bhk-rent',
    title: '2 BHK Builder Floor for Rent in Defence Colony',
    status: 'rent', tags: [],
    type: 'Builder Floor', floor: '1st Floor',
    locality: 'Defence Colony',
    address: 'Defence Colony, New Delhi – 110024',
    price: 160000, beds: 2, baths: 2, area: 1300, photos: 5,
    added: '2026-09-20',
    excerpt: 'Elegant two-bedroom floor in a secure, central colony with quick access to Khan Market and Lodhi Road.',
    features: ['Fully furnished', 'Park facing', 'Covered parking']
  },
  {
    id: 'eok-3bhk-new-booking',
    title: '3 BHK Brand New Builder Floor in East of Kailash (New Booking)',
    status: 'sale', tags: ['Brand New', 'New Booking'],
    type: 'Builder Floor', floor: 'Choice of Floors',
    locality: 'East of Kailash',
    address: 'East of Kailash, New Delhi – 110065',
    price: 65000000, beds: 3, baths: 3, area: 1800, photos: 6,
    added: '2026-09-18',
    excerpt: 'New construction on a 200-yard plot, now open for booking — choose your floor and customise the interiors.',
    features: ['Under construction', 'Lift', 'Stilt parking', 'Customisable interiors']
  },
  {
    id: 'kalkaji-3bhk-flat',
    title: '3 Bedroom Brand New Flat for Sale in Kalkaji (New Booking)',
    status: 'sale', tags: ['Brand New'],
    type: 'Apartment', floor: '4th Floor',
    locality: 'Kalkaji',
    address: 'Kalkaji, New Delhi – 110019',
    price: 37000000, beds: 3, baths: 3, area: 1125, photos: 5,
    added: '2026-09-15',
    excerpt: 'Efficient three-bedroom apartment in a newly built block, close to the Kalkaji metro interchange.',
    features: ['Near metro', 'Lift', 'Power backup']
  },
  {
    id: 'saket-3bhk-sale',
    title: '3 BHK Builder Floor for Sale in Saket',
    status: 'sale', tags: [],
    type: 'Builder Floor', floor: '1st Floor',
    locality: 'Saket',
    address: 'Saket, New Delhi – 110017',
    price: 42500000, beds: 3, baths: 3, area: 1500, photos: 7,
    added: '2026-09-12',
    excerpt: 'Park-facing three-bedroom floor near Select Citywalk, with lift, stilt parking and good natural light.',
    features: ['Park facing', 'Lift', 'Stilt parking']
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
