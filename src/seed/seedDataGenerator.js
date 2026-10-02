/**
 * Smart E-Commerce Management System using MongoDB
 * Realistic Indian E-Commerce Seed Data Generator
 * 
 * Generates >= 50 high-quality, schema-compliant documents
 * for all 60 collections across 6 databases (Total: 3,000 documents).
 * 
 * Uses realistic Indian names, cities, PIN codes, GSTINs, brands, INR amounts,
 * BSON native types (ObjectId, Date, Number, Boolean, Array, Object),
 * and maintains 100% referential integrity across databases.
 */

const { ObjectId } = require('mongodb');

// Realistic Reference Datasets
const FIRST_NAMES = [
  'Aarav', 'Priya', 'Rohit', 'Ananya', 'Vikram', 'Sneha', 'Arjun', 'Meera', 'Aditya', 'Pooja',
  'Siddharth', 'Divya', 'Karan', 'Rhea', 'Varun', 'Neha', 'Nikhil', 'Tanvi', 'Abhishek', 'Shreya',
  'Rohan', 'Isha', 'Gaurav', 'Kavya', 'Manish', 'Deepika', 'Rahul', 'Nisha', 'Alok', 'Swati',
  'Pranav', 'Simran', 'Akash', 'Shruti', 'Suresh', 'Payal', 'Harish', 'Anjali', 'Vivek', 'Ritu',
  'Amit', 'Sunita', 'Rajesh', 'Preeti', 'Manoj', 'Kiran', 'Sanjay', 'Geeta', 'Dinesh', 'Radhika'
];

const LAST_NAMES = [
  'Sharma', 'Patel', 'Verma', 'Iyer', 'Malhotra', 'Reddy', 'Nair', 'Joshi', 'Rao', 'Gupta',
  'Mehta', 'Chatterjee', 'Singhania', 'Menon', 'Bose', 'Deshmukh', 'Pillai', 'Chopra', 'Saxena', 'Kapoor',
  'Aggarwal', 'Bhat', 'Kulkarni', 'Mukherjee', 'Dubey', 'Choudhury', 'Shetty', 'Mishra', 'Pandey', 'Nambiar',
  'Gowda', 'Tripathi', 'Goswami', 'Acharya', 'Trivedi', 'Hegde', 'Mahajan', 'Sengupta', 'Venkatesh', 'Kashyap',
  'Banerjee', 'Shukla', 'Patil', 'Bhattacharya', 'Chauhan', 'Nagarajan', 'Naidu', 'Srivastava', 'Bhardwaj', 'Somani'
];

const CITIES = [
  { city: 'Bengaluru', state: 'Karnataka', pin: '560034', lat: 12.9716, lng: 77.5946 },
  { city: 'Mumbai', state: 'Maharashtra', pin: '400001', lat: 19.0760, lng: 72.8777 },
  { city: 'New Delhi', state: 'Delhi', pin: '110001', lat: 28.6139, lng: 77.2090 },
  { city: 'Hyderabad', state: 'Telangana', pin: '500001', lat: 17.3850, lng: 78.4867 },
  { city: 'Chennai', state: 'Tamil Nadu', pin: '600001', lat: 13.0827, lng: 80.2707 },
  { city: 'Pune', state: 'Maharashtra', pin: '411001', lat: 18.5204, lng: 73.8567 },
  { city: 'Kolkata', state: 'West Bengal', pin: '700001', lat: 22.5726, lng: 88.3639 },
  { city: 'Ahmedabad', state: 'Gujarat', pin: '380001', lat: 23.0225, lng: 72.5714 },
  { city: 'Jaipur', state: 'Rajasthan', pin: '302001', lat: 26.9124, lng: 75.7873 },
  { city: 'Kochi', state: 'Kerala', pin: '682001', lat: 9.9312, lng: 76.2673 },
  { city: 'Coimbatore', state: 'Tamil Nadu', pin: '641001', lat: 11.0168, lng: 76.9558 },
  { city: 'Lucknow', state: 'Uttar Pradesh', pin: '226001', lat: 26.8467, lng: 80.9462 },
  { city: 'Chandigarh', state: 'Punjab', pin: '160001', lat: 30.7333, lng: 76.7794 },
  { city: 'Indore', state: 'Madhya Pradesh', pin: '452001', lat: 22.7196, lng: 75.8577 },
  { city: 'Nagpur', state: 'Maharashtra', pin: '440001', lat: 21.1458, lng: 79.0882 }
];

const BRANDS_DATA = [
  { name: 'Samsung India', code: 'SAMS', origin: 'South Korea', hq: 'Noida, UP', email: 'support@samsung.co.in', tier: 'TIER_1', est: 1969 },
  { name: 'OnePlus India', code: 'ONEP', origin: 'China', hq: 'Bengaluru, KA', email: 'support@oneplus.in', tier: 'TIER_1', est: 2013 },
  { name: 'Apple India', code: 'APPL', origin: 'USA', hq: 'Bengaluru, KA', email: 'contact@apple.com/in', tier: 'TIER_1', est: 1976 },
  { name: 'boAt Lifestyle', code: 'BOAT', origin: 'India', hq: 'Mumbai, MH', email: 'info@boat-lifestyle.com', tier: 'TIER_2', est: 2016 },
  { name: 'Noise Electronics', code: 'NOIS', origin: 'India', hq: 'Gurugram, HR', email: 'support@gonoise.com', tier: 'TIER_2', est: 2014 },
  { name: 'Tata CliQ Tech', code: 'TATA', origin: 'India', hq: 'Mumbai, MH', email: 'care@tatacliq.com', tier: 'TIER_1', est: 1868 },
  { name: 'Titan Watches', code: 'TITN', origin: 'India', hq: 'Hosur, TN', email: 'customercare@titan.co.in', tier: 'TIER_1', est: 1984 },
  { name: 'Xiaomi India', code: 'MIIN', origin: 'China', hq: 'Bengaluru, KA', email: 'service.in@xiaomi.com', tier: 'TIER_1', est: 2010 },
  { name: 'Sony India', code: 'SONY', origin: 'Japan', hq: 'New Delhi, DL', email: 'sonyindia.care@sony.com', tier: 'TIER_1', est: 1946 },
  { name: 'LG Electronics India', code: 'LGIN', origin: 'South Korea', hq: 'Greater Noida, UP', email: 'serviceindia@lge.com', tier: 'TIER_1', est: 1958 },
  { name: 'Havells India', code: 'HAVL', origin: 'India', hq: 'Noida, UP', email: 'marketing@havells.com', tier: 'TIER_1', est: 1958 },
  { name: 'Philips India', code: 'PHIL', origin: 'Netherlands', hq: 'Kolkata, WB', email: 'support.india@philips.com', tier: 'TIER_1', est: 1891 },
  { name: 'Fastrack', code: 'FSTR', origin: 'India', hq: 'Hosur, TN', email: 'customercare@fastrack.in', tier: 'TIER_2', est: 1998 },
  { name: 'Voltas Limited', code: 'VOLT', origin: 'India', hq: 'Mumbai, MH', email: 'care@voltas.com', tier: 'TIER_1', est: 1954 },
  { name: 'Godrej Appliances', code: 'GDRJ', origin: 'India', hq: 'Mumbai, MH', email: 'smartcare@godrej.com', tier: 'TIER_1', est: 1897 },
  { name: 'Bajaj Electricals', code: 'BAJA', origin: 'India', hq: 'Mumbai, MH', email: 'consumercare@bajajelectricals.com', tier: 'TIER_2', est: 1938 },
  { name: 'FabIndia Overseas', code: 'FABI', origin: 'India', hq: 'New Delhi, DL', email: 'support@fabindia.net', tier: 'TIER_2', est: 1960 },
  { name: 'Wildcraft India', code: 'WILD', origin: 'India', hq: 'Bengaluru, KA', email: 'care@wildcraft.com', tier: 'TIER_2', est: 1998 },
  { name: 'Puma Sports India', code: 'PUMA', origin: 'Germany', hq: 'Bengaluru, KA', email: 'customercareindia@puma.com', tier: 'TIER_1', est: 1948 },
  { name: 'Prestige Smart Kitchen', code: 'PRES', origin: 'India', hq: 'Bengaluru, KA', email: 'customercare@ttkprestige.com', tier: 'TIER_1', est: 1955 }
];

const CATEGORIES_DATA = [
  { name: 'Smartphones & Mobiles', code: 'MOBI', desc: '5G Android & iOS smartphones, feature phones', gst: 18 },
  { name: 'Laptops & Computers', code: 'LAPT', desc: 'High performance gaming, ultrabooks, and workstations', gst: 18 },
  { name: 'Audio & Wearables', code: 'AUDI', desc: 'TWS earbuds, ANC headphones, smartwatches, fitness bands', gst: 18 },
  { name: 'Television & Home Audio', code: 'TELV', desc: '4K OLED/QLED smart TVs, soundbars, home theaters', gst: 18 },
  { name: 'Large Home Appliances', code: 'HAPP', desc: 'Inverter air conditioners, double door refrigerators, washing machines', gst: 28 },
  { name: 'Kitchen & Cooking Appliances', code: 'KAPP', desc: 'Mixer grinders, induction cooktops, microwave ovens, air fryers', gst: 18 },
  { name: 'Men Fashion & Apparel', code: 'MFAS', desc: 'Casual shirts, raw denim, formal trousers, ethnic wear', gst: 12 },
  { name: 'Women Ethnic & Western Wear', code: 'WFAS', desc: 'Sarees, kurtis, designer lehengas, western dresses', gst: 12 },
  { name: 'Footwear & Athleisure', code: 'FOOT', desc: 'Running shoes, leather boots, sandals, loafers', gst: 18 },
  { name: 'Luggage, Bags & Backpacks', code: 'LUGG', desc: 'Trolley suitcases, laptop backpacks, duffle bags', gst: 18 },
  { name: 'Personal Care & Grooming', code: 'GROO', desc: 'Trimmers, hair dryers, electric shavers, oral care', gst: 18 },
  { name: 'Home Living & Furniture', code: 'FURN', desc: 'Ergonomic study chairs, solid wood tables, bed sets', gst: 18 },
  { name: 'Cameras & Photography', code: 'CAMR', desc: 'Mirrorless cameras, prime lenses, gimbals, drones', gst: 18 },
  { name: 'Gaming Consoles & Accessories', code: 'GAME', desc: 'PlayStation, Xbox, mechanical keyboards, gaming mice', gst: 18 },
  { name: 'Smart Home & Security', code: 'SMAR', desc: 'Smart bulbs, Wi-Fi CCTV cameras, video doorbells, smart locks', gst: 18 }
];

const PRODUCT_TEMPLATES = [
  { name: 'OnePlus 12 5G (Flowy Emerald, 256GB)', basePrice: 64999, sellingPrice: 59999, sku: 'SKU-OP12-EM-256', tags: ['5G', 'Flagship', 'Snapdragon', 'AMOLED'] },
  { name: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 512GB)', basePrice: 139999, sellingPrice: 129999, sku: 'SKU-S24U-TI-512', tags: ['5G', 'AI_Phone', 'Stylus', 'OLED'] },
  { name: 'Apple iPhone 15 Pro (Natural Titanium, 128GB)', basePrice: 134900, sellingPrice: 127900, sku: 'SKU-IP15P-NT-128', tags: ['A17_Pro', 'Titanium', 'iOS', 'Flagship'] },
  { name: 'boAt Airdopes 141 ANC TWS Earbuds', basePrice: 4490, sellingPrice: 1699, sku: 'SKU-BOAT-141-BLK', tags: ['TWS', 'ANC', 'FastCharging', 'Bestseller'] },
  { name: 'Noise ColorFit Ultra 3 Smartwatch with AMOLED Display', basePrice: 7999, sellingPrice: 2999, sku: 'SKU-NOISE-U3-SLV', tags: ['Smartwatch', 'AMOLED', 'Fitness', 'BTCalling'] },
  { name: 'Sony WH-1000XM5 Wireless Industry Leading Noise Canceling', basePrice: 34990, sellingPrice: 28990, sku: 'SKU-SONY-XM5-SLV', tags: ['ANC', 'HiResAudio', 'Premium', 'OverEar'] },
  { name: 'LG 55-inch 4K Ultra HD Smart OLED TV (OLED55C3)', basePrice: 169990, sellingPrice: 119990, sku: 'SKU-LG-OLED55-C3', tags: ['OLED', '4K', 'SmartTV', '120Hz'] },
  { name: 'Voltas 1.5 Ton 5 Star Inverter Split AC (Copper, Anti-Dust)', basePrice: 67990, sellingPrice: 37990, sku: 'SKU-VOLT-15AC-5S', tags: ['InverterAC', '5Star', 'CopperCondenser'] },
  { name: 'Havells Meditate Air Purifier with SpaceTech Technology', basePrice: 65990, sellingPrice: 44990, sku: 'SKU-HAVL-AP-MED', tags: ['AirPurifier', 'HEPA', 'SpaceTech', 'IoT'] },
  { name: 'Philips Multi Grooming Kit 13-in-1 Waterproof Trimmer', basePrice: 4895, sellingPrice: 3495, sku: 'SKU-PHIL-MG7715', tags: ['Grooming', 'Trimmer', 'Waterproof', 'SelfSharpening'] },
  { name: 'Prestige Iris Plus 750W Mixer Grinder with 4 Jars', basePrice: 6195, sellingPrice: 3299, sku: 'SKU-PRES-IRIS-750', tags: ['Kitchen', 'MixerGrinder', '750W', 'StainlessSteel'] },
  { name: 'Titan Edge Ceramic Slimmest Quartz Analog Watch', basePrice: 29995, sellingPrice: 24995, sku: 'SKU-TITN-EDGE-SLM', tags: ['Luxury', 'Ceramic', 'UltraSlim', 'WaterResistant'] },
  { name: 'Puma Nitro Elite Running Shoes for Marathoners', basePrice: 19999, sellingPrice: 14999, sku: 'SKU-PUMA-NITRO-42', tags: ['Running', 'CarbonPlate', 'Marathon', 'Lightweight'] },
  { name: 'Wildcraft 45L Trailblazer Ergonomic Hiking Rucksack', basePrice: 4999, sellingPrice: 3299, sku: 'SKU-WILD-TRL-45L', tags: ['Hiking', 'Backpack', 'RainCover', 'Ergonomic'] },
  { name: 'Apple MacBook Air 15-inch M3 Chip (16GB RAM, 512GB SSD)', basePrice: 154900, sellingPrice: 144900, sku: 'SKU-MBA-M3-15-512', tags: ['AppleSilicon', 'Retina', 'Lightweight', 'M3'] }
];

function generateSeedData() {
  const dbs = {};

  // Deterministic Base IDs generator
  const getCustId = (i) => `CUST-${10000 + i}`;
  const getProdId = (i) => `PROD-${10000 + i}`;
  const getCatId = (i) => `CAT-${10000 + i}`;
  const getSubcatId = (i) => `SUBCAT-${10000 + i}`;
  const getBrandId = (i) => `BRD-${10000 + i}`;
  const getVarId = (i) => `VAR-${10000 + i}`;
  const getOrderId = (i) => `ORD-${10000 + i}`;
  const getPayId = (i) => `PAY-${10000 + i}`;
  const getWhId = (i) => `WH-${10000 + i}`;
  const getSupId = (i) => `SUP-${10000 + i}`;

  // Helper date generator
  const baseDate = new Date('2023-01-01T00:00:00Z');
  const addDays = (d, days) => new Date(d.getTime() + days * 86400000);

  // =========================================================================
  // 1. customer_db (Member 1)
  // =========================================================================
  dbs.customer_db = {};

  // 1.1 customers (50)
  dbs.customer_db.customers = [];
  for (let i = 1; i <= 50; i++) {
    const fn = FIRST_NAMES[(i - 1) % FIRST_NAMES.length];
    const ln = LAST_NAMES[(i - 1) % LAST_NAMES.length];
    const registeredDate = addDays(baseDate, i * 7);
    dbs.customer_db.customers.push({
      _id: new ObjectId(),
      customerId: getCustId(i),
      firstName: fn,
      lastName: ln,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@example.in`,
      phone: `+91-${9800000000 + i * 137}`,
      gender: i % 2 === 0 ? 'Female' : 'Male',
      dateOfBirth: `199${(i % 10)}-0${(i % 8) + 1}-1${(i % 9)}`,
      status: i === 45 ? 'SUSPENDED' : (i === 50 ? 'INACTIVE' : 'ACTIVE'),
      kycVerified: i % 4 !== 0,
      tags: i % 3 === 0 ? ['VIP', 'FREQUENT_BUYER'] : (i % 2 === 0 ? ['EARLY_ADOPTER'] : ['STANDARD_RETAIL']),
      registeredAt: registeredDate,
      updatedAt: addDays(registeredDate, 30)
    });
  }

  // 1.2 customer_profiles (50)
  dbs.customer_db.customer_profiles = [];
  const OCCUPATIONS = ['Software Engineer', 'Product Manager', 'Data Analyst', 'Architect', 'Chartered Accountant', 'Physician', 'Consultant', 'Professor'];
  for (let i = 1; i <= 50; i++) {
    dbs.customer_db.customer_profiles.push({
      _id: new ObjectId(),
      profileId: `PROF-${10000 + i}`,
      customerId: getCustId(i),
      avatarUrl: `https://cdn.smartecom.in/avatars/cust-${10000 + i}.jpg`,
      bio: `Enthusiastic buyer of electronics and home lifestyle gadgets based in ${CITIES[(i - 1) % CITIES.length].city}.`,
      occupation: OCCUPATIONS[(i - 1) % OCCUPATIONS.length],
      annualIncomeRange: i % 2 === 0 ? '₹15,00,000 - ₹25,00,000' : '₹8,00,000 - ₹15,00,000',
      preferredLanguage: i % 5 === 0 ? 'Hindi' : (i % 7 === 0 ? 'Kannada' : 'English'),
      maritalStatus: i % 2 === 0 ? 'Married' : 'Single',
      interests: ['Consumer Tech', 'Audio & Music', 'Smart Home Gadgets', 'Fitness'],
      profileCompleteness: 80 + (i % 20),
      updatedAt: addDays(baseDate, i * 8)
    });
  }

  // 1.3 addresses (50)
  dbs.customer_db.addresses = [];
  for (let i = 1; i <= 50; i++) {
    const loc = CITIES[(i - 1) % CITIES.length];
    dbs.customer_db.addresses.push({
      _id: new ObjectId(),
      addressId: `ADDR-${10000 + i}`,
      customerId: getCustId(i),
      addressType: i % 3 === 0 ? 'WORK' : 'HOME',
      isDefault: true,
      recipientName: `${FIRST_NAMES[(i - 1) % FIRST_NAMES.length]} ${LAST_NAMES[(i - 1) % LAST_NAMES.length]}`,
      recipientPhone: `+91-${9800000000 + i * 137}`,
      streetAddress: `Tower ${((i % 4) + 1)}, Flat ${100 + i}, Prestige Sunrise Enclave, Main Road`,
      landmark: `Near City Metro Station Pillar ${i * 4}`,
      city: loc.city,
      state: loc.state,
      postalCode: loc.pin,
      country: 'India'
    });
  }

  // 1.4 contacts (50)
  dbs.customer_db.contacts = [];
  for (let i = 1; i <= 50; i++) {
    dbs.customer_db.contacts.push({
      _id: new ObjectId(),
      contactId: `CONT-${10000 + i}`,
      customerId: getCustId(i),
      contactType: 'PRIMARY_MOBILE',
      contactValue: `+91-${9800000000 + i * 137}`,
      isVerified: true,
      verifiedAt: addDays(baseDate, i * 7),
      verificationMethod: 'OTP_SMS',
      priority: 1,
      isPrimary: true,
      createdAt: addDays(baseDate, i * 7),
      updatedAt: addDays(baseDate, i * 7)
    });
  }

  // 1.5 preferences (50)
  dbs.customer_db.preferences = [];
  for (let i = 1; i <= 50; i++) {
    dbs.customer_db.preferences.push({
      _id: new ObjectId(),
      preferenceId: `PREF-${10000 + i}`,
      customerId: getCustId(i),
      emailNotifications: true,
      smsNotifications: i % 2 === 0,
      whatsappAlerts: true,
      currency: 'INR',
      theme: i % 2 === 0 ? 'DARK' : 'LIGHT',
      twoFactorAuthEnabled: i % 3 === 0,
      personalizedRecommendations: true,
      preferredPaymentMethod: i % 3 === 0 ? 'UPI' : (i % 3 === 1 ? 'CREDIT_CARD' : 'NET_BANKING'),
      lastUpdated: addDays(baseDate, i * 10)
    });
  }

  // 1.6 login_history (50)
  dbs.customer_db.login_history = [];
  for (let i = 1; i <= 50; i++) {
    const loc = CITIES[(i - 1) % CITIES.length];
    dbs.customer_db.login_history.push({
      _id: new ObjectId(),
      loginId: `LOG-${10000 + i}`,
      customerId: getCustId(i),
      ipAddress: `103.24.${(i % 100) + 10}.${(i * 3) % 250}`,
      deviceType: i % 2 === 0 ? 'MOBILE' : 'DESKTOP',
      browser: i % 2 === 0 ? 'Chrome Mobile 122.0.0' : 'Safari Desktop 17.2',
      operatingSystem: i % 2 === 0 ? 'Android 14' : 'macOS Sonoma',
      loginLocation: `${loc.city}, ${loc.state}, India`,
      loginStatus: 'SUCCESS',
      failureReason: 'None',
      sessionDurationSeconds: 300 + (i * 45),
      loginTimestamp: addDays(baseDate, 100 + i)
    });
  }

  // 1.7 wishlists (50)
  dbs.customer_db.wishlists = [];
  for (let i = 1; i <= 50; i++) {
    const prodRefId = getProdId(((i * 3) % 50) + 1);
    dbs.customer_db.wishlists.push({
      _id: new ObjectId(),
      wishlistId: `WISH-${10000 + i}`,
      customerId: getCustId(i),
      productId: prodRefId,
      addedPrice: 15000 + (i * 800),
      notifyOnPriceDrop: true,
      targetPrice: 14000 + (i * 750),
      priorityLevel: i % 3 === 0 ? 'HIGH' : (i % 3 === 1 ? 'MEDIUM' : 'LOW'),
      notes: 'Plan to purchase during seasonal festival sale',
      isPublic: false,
      status: 'ACTIVE',
      createdAt: addDays(baseDate, 50 + i)
    });
  }

  // 1.8 loyalty_accounts (50)
  dbs.customer_db.loyalty_accounts = [];
  for (let i = 1; i <= 50; i++) {
    const tier = i % 4 === 0 ? 'PLATINUM' : (i % 3 === 0 ? 'GOLD' : (i % 2 === 0 ? 'SILVER' : 'BRONZE'));
    dbs.customer_db.loyalty_accounts.push({
      _id: new ObjectId(),
      loyaltyId: `LOYAL-${10000 + i}`,
      customerId: getCustId(i),
      tierLevel: tier,
      pointsBalance: 500 + (i * 120),
      lifetimePointsEarned: 1500 + (i * 350),
      lifetimePointsRedeemed: 1000 + (i * 230),
      tierUpgradeDate: addDays(baseDate, 120 + i),
      tierExpiryDate: addDays(baseDate, 480 + i),
      annualSpendINR: 25000 + (i * 3500),
      status: 'ACTIVE',
      lastPointsActivityAt: addDays(baseDate, 140 + i)
    });
  }

  // 1.9 customer_support (50)
  dbs.customer_db.customer_support = [];
  for (let i = 1; i <= 50; i++) {
    dbs.customer_db.customer_support.push({
      _id: new ObjectId(),
      ticketId: `TICK-${10000 + i}`,
      customerId: getCustId(i),
      orderId: getOrderId(i),
      category: i % 3 === 0 ? 'ORDER_TRACKING' : (i % 3 === 1 ? 'INVOICE_REQUEST' : 'PRODUCT_WARRANTY'),
      subject: `Inquiry regarding delivery schedule for Order ${getOrderId(i)}`,
      description: 'Requesting updated logistics AWB courier milestone updates.',
      priority: i % 4 === 0 ? 'HIGH' : 'MEDIUM',
      status: 'RESOLVED',
      assignedAgent: `Support_Agent_${(i % 5) + 1}`,
      resolutionNotes: 'Updated customer with live courier tracking milestone link.',
      createdAt: addDays(baseDate, 180 + i),
      resolvedAt: addDays(baseDate, 181 + i)
    });
  }

  // 1.10 customer_activity (50)
  dbs.customer_db.customer_activity = [];
  for (let i = 1; i <= 50; i++) {
    dbs.customer_db.customer_activity.push({
      _id: new ObjectId(),
      activityId: `ACT-${10000 + i}`,
      customerId: getCustId(i),
      activityType: i % 2 === 0 ? 'PRODUCT_VIEW' : 'CART_ADD',
      targetEntityId: getProdId(((i * 2) % 50) + 1),
      targetEntityType: 'PRODUCT',
      platform: i % 2 === 0 ? 'ANDROID_APP' : 'WEB_BROWSER',
      sessionId: `SESS-${10000 + i}`,
      ipAddress: `103.24.${(i % 100) + 10}.${(i * 3) % 250}`,
      durationSeconds: 45 + (i * 5),
      activityMetadata: { source: 'category_browse', referrer: 'recommendation_widget' },
      timestamp: addDays(baseDate, 190 + i)
    });
  }

  // =========================================================================
  // 2. product_db (Member 2)
  // =========================================================================
  dbs.product_db = {};

  // 2.2 categories (50) - create first so products can link
  dbs.product_db.categories = [];
  for (let i = 1; i <= 50; i++) {
    const tmpl = CATEGORIES_DATA[(i - 1) % CATEGORIES_DATA.length];
    dbs.product_db.categories.push({
      _id: new ObjectId(),
      categoryId: getCatId(i),
      name: `${tmpl.name}${i > CATEGORIES_DATA.length ? ` (Tier ${Math.floor(i / 15) + 1})` : ''}`,
      code: `${tmpl.code}_${i}`,
      description: tmpl.desc,
      displayOrder: i,
      iconUrl: `https://cdn.smartecom.in/icons/cat-${tmpl.code.toLowerCase()}.png`,
      bannerImageUrl: `https://cdn.smartecom.in/banners/cat-${tmpl.code.toLowerCase()}.jpg`,
      isActive: true,
      gstRatePercentage: tmpl.gst,
      totalProductsCount: 30 + (i * 2),
      createdAt: addDays(baseDate, i)
    });
  }

  // 2.4 brands (50) - create so products can link
  dbs.product_db.brands = [];
  for (let i = 1; i <= 50; i++) {
    const tmpl = BRANDS_DATA[(i - 1) % BRANDS_DATA.length];
    dbs.product_db.brands.push({
      _id: new ObjectId(),
      brandId: getBrandId(i),
      name: `${tmpl.name}${i > BRANDS_DATA.length ? ` Sub-Division ${i}` : ''}`,
      code: `${tmpl.code}${i}`,
      countryOfOrigin: tmpl.origin,
      headquarters: tmpl.hq,
      website: `https://www.${tmpl.code.toLowerCase()}-india.com`,
      supportEmail: tmpl.email,
      isAuthorizedSeller: true,
      status: 'ACTIVE',
      brandTier: tmpl.tier,
      establishedYear: tmpl.est,
      createdAt: addDays(baseDate, i * 2)
    });
  }

  // 2.3 subcategories (50)
  dbs.product_db.subcategories = [];
  for (let i = 1; i <= 50; i++) {
    dbs.product_db.subcategories.push({
      _id: new ObjectId(),
      subcategoryId: getSubcatId(i),
      categoryId: getCatId(((i - 1) % 50) + 1),
      name: `Sub-Department ${i} Classification`,
      slug: `sub-department-${i}-classification`,
      description: `Targeted sub-department grouping with specific warranty and commission guidelines.`,
      displayOrder: i,
      commissionPercentage: 4.5 + ((i % 5) * 0.5),
      isActive: true,
      requiresSerialNumber: i % 2 === 0,
      totalItems: 45 + (i * 3),
      createdAt: addDays(baseDate, i * 3)
    });
  }

  // 2.1 products (50)
  dbs.product_db.products = [];
  for (let i = 1; i <= 50; i++) {
    const tmpl = PRODUCT_TEMPLATES[(i - 1) % PRODUCT_TEMPLATES.length];
    const catRef = getCatId(((i - 1) % 50) + 1);
    const subcatRef = getSubcatId(((i - 1) % 50) + 1);
    const brandRef = getBrandId(((i - 1) % 50) + 1);
    dbs.product_db.products.push({
      _id: new ObjectId(),
      productId: getProdId(i),
      name: `${tmpl.name}${i > PRODUCT_TEMPLATES.length ? ` Edition ${i}` : ''}`,
      slug: `product-${10000 + i}-${tmpl.sku.toLowerCase()}`,
      brandId: brandRef,
      categoryId: catRef,
      subcategoryId: subcatRef,
      basePriceINR: tmpl.basePrice + (i * 200),
      sellingPriceINR: tmpl.sellingPrice + (i * 150),
      currency: 'INR',
      sku: `${tmpl.sku}-${100 + i}`,
      status: 'ACTIVE',
      ratingAverage: +(4.1 + ((i % 8) * 0.1)).toFixed(1),
      tags: tmpl.tags,
      createdAt: addDays(baseDate, 10 + i)
    });
  }

  // 2.5 product_variants (50)
  dbs.product_db.product_variants = [];
  const COLORS = ['Titanium Black', 'Glacier Blue', 'Emerald Green', 'Space Gray', 'Pearl White', 'Starlight Gold'];
  const SIZES = ['128GB Storage', '256GB Storage', '512GB Storage', 'Standard Fit', 'XL Edition'];
  for (let i = 1; i <= 50; i++) {
    dbs.product_db.product_variants.push({
      _id: new ObjectId(),
      variantId: getVarId(i),
      productId: getProdId(i),
      variantName: `${COLORS[(i - 1) % COLORS.length]} / ${SIZES[(i - 1) % SIZES.length]}`,
      color: COLORS[(i - 1) % COLORS.length],
      sizeOrCapacity: SIZES[(i - 1) % SIZES.length],
      sku: `VAR-SKU-${10000 + i}`,
      priceAdjustmentINR: (i % 3) * 2000,
      finalPriceINR: 25000 + (i * 500),
      stockQuantity: 20 + (i * 5),
      isDefault: i % 2 === 0,
      status: 'AVAILABLE',
      createdAt: addDays(baseDate, 15 + i)
    });
  }

  // 2.6 product_images (50)
  dbs.product_db.product_images = [];
  for (let i = 1; i <= 50; i++) {
    dbs.product_db.product_images.push({
      _id: new ObjectId(),
      imageId: `IMG-${10000 + i}`,
      productId: getProdId(i),
      imageUrl: `https://cdn.smartecom.in/products/prod-${10000 + i}/main.webp`,
      thumbnailUrl: `https://cdn.smartecom.in/products/prod-${10000 + i}/thumb.webp`,
      altText: `High resolution front angle render for Product ${getProdId(i)}`,
      displayOrder: 1,
      isPrimary: true,
      resolution: '1920x1080',
      format: 'WEBP',
      fileSizeKB: 245 + (i * 3),
      uploadedAt: addDays(baseDate, 15 + i)
    });
  }

  // 2.7 product_specs (50)
  dbs.product_db.product_specs = [];
  const SPEC_GROUPS = ['Processor & Performance', 'Display & Optics', 'Battery & Power', 'Connectivity & Ports'];
  for (let i = 1; i <= 50; i++) {
    dbs.product_db.product_specs.push({
      _id: new ObjectId(),
      specId: `SPEC-${10000 + i}`,
      productId: getProdId(i),
      specGroup: SPEC_GROUPS[(i - 1) % SPEC_GROUPS.length],
      specKey: i % 2 === 0 ? 'Processor Chipset' : 'Display Panel Type',
      specValue: i % 2 === 0 ? 'Snapdragon 8 Gen 3 (Octa Core, 3.3 GHz)' : '120Hz LTPO AMOLED 2K HDR10+',
      unit: i % 2 === 0 ? 'GHz' : 'Hz',
      isFilterable: true,
      displayPriority: 1,
      isHighlight: true,
      verified: true,
      updatedAt: addDays(baseDate, 20 + i)
    });
  }

  // 2.8 product_discounts (50)
  dbs.product_db.product_discounts = [];
  for (let i = 1; i <= 50; i++) {
    dbs.product_db.product_discounts.push({
      _id: new ObjectId(),
      discountId: `DISC-${10000 + i}`,
      productId: getProdId(i),
      discountType: 'PERCENTAGE',
      discountValue: 10 + (i % 15),
      minPurchaseAmountINR: 10000,
      maxDiscountAmountINR: 5000,
      applicableBank: i % 2 === 0 ? 'HDFC Bank' : 'ICICI Bank',
      startDate: addDays(baseDate, 30),
      endDate: addDays(baseDate, 365),
      status: 'ACTIVE',
      usageLimit: 1000
    });
  }

  // 2.9 product_tags (50)
  dbs.product_db.product_tags = [];
  for (let i = 1; i <= 50; i++) {
    dbs.product_db.product_tags.push({
      _id: new ObjectId(),
      tagId: `TAG-${10000 + i}`,
      productId: getProdId(i),
      tagName: i % 3 === 0 ? 'Bestseller' : (i % 2 === 0 ? '5G Ready' : 'Festival Deal'),
      tagSlug: i % 3 === 0 ? 'bestseller' : (i % 2 === 0 ? '5g-ready' : 'festival-deal'),
      tagType: 'BADGE',
      colorCodeHex: i % 2 === 0 ? '#10B981' : '#F59E0B',
      clickCount: 150 + (i * 22),
      isActive: true,
      displayOnCard: true,
      expiryDate: addDays(baseDate, 400),
      createdAt: addDays(baseDate, 25 + i)
    });
  }

  // 2.10 product_warranty (50)
  dbs.product_db.product_warranty = [];
  for (let i = 1; i <= 50; i++) {
    dbs.product_db.product_warranty.push({
      _id: new ObjectId(),
      warrantyId: `WAR-${10000 + i}`,
      productId: getProdId(i),
      warrantyPeriodMonths: i % 2 === 0 ? 12 : 24,
      warrantyType: 'MANUFACTURER_COMPREHENSIVE',
      coverageDetails: 'Covers internal manufacturing hardware defects, panel malfunctions, and motherboard repair.',
      exclusions: 'Physical accidental impact, liquid ingress damage, and unauthorized third-party tampering.',
      claimProcess: 'Carry-in service to any authorized brand service center across India with tax invoice.',
      supportContactPhone: '1800-425-9898',
      supportWebsite: 'https://support.smartecom.in/warranty',
      isTransferable: false,
      hasFreeExtendedOption: i % 3 === 0,
      updatedAt: addDays(baseDate, 30 + i)
    });
  }

  // =========================================================================
  // 3. order_db (Member 3)
  // =========================================================================
  dbs.order_db = {};

  // 3.1 orders (50)
  dbs.order_db.orders = [];
  for (let i = 1; i <= 50; i++) {
    const subtotal = 35000 + (i * 1200);
    const discount = 2000;
    const tax = Math.round(subtotal * 0.18);
    const shipping = subtotal > 50000 ? 0 : 150;
    const total = subtotal - discount + tax + shipping;

    dbs.order_db.orders.push({
      _id: new ObjectId(),
      orderId: getOrderId(i),
      customerId: getCustId(i),
      orderDate: addDays(baseDate, 100 + i),
      totalItemCount: 1 + (i % 3),
      subtotalAmountINR: subtotal,
      discountAmountINR: discount,
      taxAmountINR: tax,
      shippingFeeINR: shipping,
      totalAmountINR: total,
      orderStatus: i % 6 === 0 ? 'DELIVERED' : (i % 5 === 0 ? 'SHIPPED' : (i % 4 === 0 ? 'PROCESSING' : 'DELIVERED')),
      paymentStatus: 'PAID',
      paymentId: getPayId(i),
      shippingAddressId: `DELV-${10000 + i}`,
      orderTags: i % 2 === 0 ? ['EXPRESS_DELIVERY', 'GIFT_PACKED'] : ['STANDARD_SHIPPING']
    });
  }

  // 3.2 order_items (50)
  dbs.order_db.order_items = [];
  for (let i = 1; i <= 50; i++) {
    const unitPrice = 28000 + (i * 900);
    const disc = 1500;
    const itemTotal = unitPrice - disc + Math.round((unitPrice - disc) * 0.18);
    dbs.order_db.order_items.push({
      _id: new ObjectId(),
      orderItemId: `ITEM-${10000 + i}`,
      orderId: getOrderId(i),
      productId: getProdId(i),
      variantId: getVarId(i),
      quantity: 1,
      unitPriceINR: unitPrice,
      discountAppliedINR: disc,
      taxRatePercentage: 18,
      totalItemPriceINR: itemTotal,
      fulfillmentStatus: 'DELIVERED',
      warehouseId: getWhId(((i - 1) % 50) + 1)
    });
  }

  // 3.3 order_status (50)
  dbs.order_db.order_status = [];
  for (let i = 1; i <= 50; i++) {
    dbs.order_db.order_status.push({
      _id: new ObjectId(),
      statusHistoryId: `STAT-${10000 + i}`,
      orderId: getOrderId(i),
      previousStatus: 'PROCESSING',
      newStatus: 'DELIVERED',
      changedBy: 'LOGISTICS_DISPATCH_AUTOMATION',
      remarks: 'Consignment successfully delivered to customer with OTP delivery confirmation.',
      isCustomerNotified: true,
      notificationChannel: 'SMS_AND_WHATSAPP',
      estimatedDeliveryDate: addDays(baseDate, 105 + i),
      timestamp: addDays(baseDate, 105 + i)
    });
  }

  // 3.4 shipments (50)
  dbs.order_db.shipments = [];
  const CARRIERS = ['BlueDart Express', 'Delhivery Surface', 'DTDC Premium', 'Shadowfax E-Com', 'Ekart Logistics'];
  for (let i = 1; i <= 50; i++) {
    dbs.order_db.shipments.push({
      _id: new ObjectId(),
      shipmentId: `SHIP-${10000 + i}`,
      orderId: getOrderId(i),
      carrierName: CARRIERS[(i - 1) % CARRIERS.length],
      trackingNumber: `AWB-IND-${980000000 + i * 43}`,
      dispatchDate: addDays(baseDate, 101 + i),
      deliveredDate: addDays(baseDate, 104 + i),
      shippingStatus: 'DELIVERED',
      warehouseId: getWhId(((i - 1) % 50) + 1),
      weightKg: +(0.8 + ((i % 10) * 0.3)).toFixed(1),
      shippingCostINR: 120 + ((i % 5) * 40),
      signatureProofRequired: true
    });
  }

  // 3.5 delivery_addresses (50)
  dbs.order_db.delivery_addresses = [];
  for (let i = 1; i <= 50; i++) {
    const loc = CITIES[(i - 1) % CITIES.length];
    dbs.order_db.delivery_addresses.push({
      _id: new ObjectId(),
      deliveryAddressId: `DELV-${10000 + i}`,
      orderId: getOrderId(i),
      customerId: getCustId(i),
      recipientName: `${FIRST_NAMES[(i - 1) % FIRST_NAMES.length]} ${LAST_NAMES[(i - 1) % LAST_NAMES.length]}`,
      contactNumber: `+91-${9800000000 + i * 137}`,
      alternateNumber: `+91-${9700000000 + i * 137}`,
      addressLine1: `Flat ${200 + i}, Tower B, Palm Meadows`,
      addressLine2: `100 Feet Intermediate Ring Road`,
      landmark: 'Opposite Forum Technology Park',
      city: loc.city,
      state: loc.state,
      pinCode: loc.pin,
      deliveryType: 'RESIDENTIAL'
    });
  }

  // 3.6 returns (50)
  dbs.order_db.returns = [];
  for (let i = 1; i <= 50; i++) {
    dbs.order_db.returns.push({
      _id: new ObjectId(),
      returnId: `RET-${10000 + i}`,
      orderId: getOrderId(i),
      orderItemId: `ITEM-${10000 + i}`,
      customerId: getCustId(i),
      returnReason: i % 2 === 0 ? 'SIZE_OR_FIT_MISMATCH' : 'INCORRECT_COLOR_SHIPPED',
      returnStatus: 'RETURN_INSPECTED_AND_ACCEPTED',
      itemCondition: 'SEAL_INTACT_ORIGINAL_BOX',
      pickupCarrier: 'BlueDart Reverse Courier',
      pickupTrackingNumber: `AWB-REV-${88000000 + i}`,
      inspectionRemarks: 'Original serial and accessories present in packaging. Return approved.',
      requestDate: addDays(baseDate, 110 + i),
      resolvedDate: addDays(baseDate, 113 + i)
    });
  }

  // 3.7 refunds (50)
  dbs.order_db.refunds = [];
  for (let i = 1; i <= 50; i++) {
    dbs.order_db.refunds.push({
      _id: new ObjectId(),
      refundId: `REF-${10000 + i}`,
      orderId: getOrderId(i),
      returnId: `RET-${10000 + i}`,
      paymentId: getPayId(i),
      customerId: getCustId(i),
      refundAmountINR: 5000 + (i * 250),
      refundMethod: 'ORIGINAL_PAYMENT_SOURCE',
      refundStatus: 'SETTLED',
      gatewayReferenceNumber: `GATEWAY-REF-${7700000 + i}`,
      processedBy: 'FINANCE_AUTOMATION_SYSTEM',
      initiatedAt: addDays(baseDate, 114 + i),
      completedAt: addDays(baseDate, 115 + i)
    });
  }

  // 3.8 coupons (50)
  dbs.order_db.coupons = [];
  for (let i = 1; i <= 50; i++) {
    dbs.order_db.coupons.push({
      _id: new ObjectId(),
      couponId: `COUP-${10000 + i}`,
      couponCode: `DIWALI${100 + i}`,
      discountType: 'PERCENTAGE',
      discountAmount: 15,
      minOrderValueINR: 3000,
      maxDiscountLimitINR: 1500,
      validFrom: addDays(baseDate, 50),
      validUntil: addDays(baseDate, 400),
      usageLimitTotal: 5000,
      usageLimitPerUser: 1,
      currentUsageCount: 420 + i,
      isActive: true
    });
  }

  // 3.9 order_tracking (50)
  dbs.order_db.order_tracking = [];
  for (let i = 1; i <= 50; i++) {
    const loc = CITIES[(i - 1) % CITIES.length];
    dbs.order_db.order_tracking.push({
      _id: new ObjectId(),
      trackingId: `TRK-${10000 + i}`,
      orderId: getOrderId(i),
      shipmentId: `SHIP-${10000 + i}`,
      checkpointLocation: `${loc.city} Hub Facility`,
      checkpointStatus: 'OUT_FOR_DELIVERY',
      checkpointTimestamp: addDays(baseDate, 104 + i),
      carrierRemarks: 'Consignment out with executive for doorstep handoff.',
      latitude: loc.lat,
      longitude: loc.lng,
      deliveryPartnerPhone: `+91-98888${10000 + i}`,
      isException: false
    });
  }

  // 3.10 cancellations (50)
  dbs.order_db.cancellations = [];
  for (let i = 1; i <= 50; i++) {
    dbs.order_db.cancellations.push({
      _id: new ObjectId(),
      cancellationId: `CNCL-${10000 + i}`,
      orderId: getOrderId(i),
      customerId: getCustId(i),
      cancelledAt: addDays(baseDate, 101 + i),
      reasonCategory: 'ORDERED_BY_MISTAKE',
      detailedReason: 'Purchased alternate model with higher storage capacity.',
      cancellationStage: 'PRE_DISPATCH',
      isRefundRequired: true,
      cancellationFeeINR: 0,
      approvalStatus: 'APPROVED_AUTO',
      handledBy: 'SYSTEM_RULES_ENGINE'
    });
  }

  // =========================================================================
  // 4. inventory_db (Member 4)
  // =========================================================================
  dbs.inventory_db = {};

  // 4.2 warehouses (50) - create first so inventory can reference
  dbs.inventory_db.warehouses = [];
  for (let i = 1; i <= 50; i++) {
    const loc = CITIES[(i - 1) % CITIES.length];
    dbs.inventory_db.warehouses.push({
      _id: new ObjectId(),
      warehouseId: getWhId(i),
      warehouseName: `${loc.city} Regional Mega Fulfillment Center ${i}`,
      warehouseCode: `WH-${loc.city.substring(0, 3).toUpperCase()}-${i.toString().padStart(2, '0')}`,
      city: loc.city,
      state: loc.state,
      postalCode: loc.pin,
      totalCapacitySqFt: 100000 + (i * 5000),
      occupiedCapacitySqFt: 75000 + (i * 3500),
      managerName: `${FIRST_NAMES[(i - 1) % FIRST_NAMES.length]} ${LAST_NAMES[(i - 1) % LAST_NAMES.length]}`,
      managerContact: `+91-${9811100000 + i * 29}`,
      operatingStatus: 'OPERATIONAL',
      isColdStorageCapable: i % 4 === 0,
      geoCoordinates: { latitude: loc.lat, longitude: loc.lng }
    });
  }

  // 4.3 suppliers (50)
  dbs.inventory_db.suppliers = [];
  for (let i = 1; i <= 50; i++) {
    const loc = CITIES[(i - 1) % CITIES.length];
    dbs.inventory_db.suppliers.push({
      _id: new ObjectId(),
      supplierId: getSupId(i),
      companyName: `Apex Logistics & Electronics Distribution ${i} Pvt Ltd`,
      gstin: `29AAACT${1000 + i}K1Z${(i % 9) + 1}`,
      contactPerson: `${FIRST_NAMES[(i - 1) % FIRST_NAMES.length]} ${LAST_NAMES[(i - 1) % LAST_NAMES.length]}`,
      email: `procurement@apexdistribution${i}.co.in`,
      phone: `+91-${9822200000 + i * 19}`,
      city: loc.city,
      state: loc.state,
      ratingScore: +(4.2 + ((i % 7) * 0.1)).toFixed(1),
      paymentTermsDays: 30,
      status: 'ACTIVE',
      supplierCategory: i % 2 === 0 ? 'PRIMARY_OEM' : 'AUTHORIZED_DISTRIBUTOR'
    });
  }

  // 4.1 inventory (50)
  dbs.inventory_db.inventory = [];
  for (let i = 1; i <= 50; i++) {
    dbs.inventory_db.inventory.push({
      _id: new ObjectId(),
      inventoryId: `INVNT-${10000 + i}`,
      productId: getProdId(i),
      variantId: getVarId(i),
      warehouseId: getWhId(((i - 1) % 50) + 1),
      quantityAvailable: 150 + (i * 10),
      quantityReserved: 15 + (i % 5),
      reorderThreshold: 30,
      reorderQuantity: 100,
      aisleLocation: `Aisle-${String.fromCharCode(65 + (i % 6))}-Rack-${(i % 12) + 1}`,
      unitCostINR: 18000 + (i * 600),
      stockStatus: 'IN_STOCK',
      lastAuditDate: addDays(baseDate, 130 + i)
    });
  }

  // 4.4 stock_movements (50)
  dbs.inventory_db.stock_movements = [];
  for (let i = 1; i <= 50; i++) {
    const srcWh = getWhId(((i - 1) % 50) + 1);
    const destWh = getWhId(((i % 50) + 1));
    dbs.inventory_db.stock_movements.push({
      _id: new ObjectId(),
      movementId: `MOV-${10000 + i}`,
      inventoryId: `INVNT-${10000 + i}`,
      productId: getProdId(i),
      sourceWarehouseId: srcWh,
      destinationWarehouseId: destWh,
      movementType: 'INTER_WAREHOUSE_TRANSFER',
      quantity: 50 + (i * 5),
      reason: 'Regional demand balancing ahead of festival rush sale',
      authorizedBy: `Logistics_Mgr_${(i % 5) + 1}`,
      movementDate: addDays(baseDate, 135 + i),
      status: 'COMPLETED'
    });
  }

  // 4.5 purchase_orders (50)
  dbs.inventory_db.purchase_orders = [];
  for (let i = 1; i <= 50; i++) {
    const totalPo = 500000 + (i * 25000);
    dbs.inventory_db.purchase_orders.push({
      _id: new ObjectId(),
      purchaseOrderId: `PO-${10000 + i}`,
      supplierId: getSupId(i),
      warehouseId: getWhId(i),
      orderDate: addDays(baseDate, 110 + i),
      expectedDeliveryDate: addDays(baseDate, 125 + i),
      actualDeliveryDate: addDays(baseDate, 124 + i),
      totalAmountINR: totalPo,
      paymentTerms: 'NET_30_DAYS',
      poStatus: 'RECEIVED_AND_VERIFIED',
      taxAmountINR: Math.round(totalPo * 0.18),
      approvedBy: `VP_Procurement_${(i % 3) + 1}`,
      notes: 'Standard procurement lot adhering to BIS compliance guidelines.'
    });
  }

  // 4.6 purchase_items (50)
  dbs.inventory_db.purchase_items = [];
  for (let i = 1; i <= 50; i++) {
    const cost = 22000 + (i * 500);
    const qty = 50 + (i * 2);
    dbs.inventory_db.purchase_items.push({
      _id: new ObjectId(),
      purchaseItemId: `PITEM-${10000 + i}`,
      purchaseOrderId: `PO-${10000 + i}`,
      productId: getProdId(i),
      variantId: getVarId(i),
      quantityOrdered: qty,
      quantityReceived: qty,
      unitCostINR: cost,
      taxPercentage: 18,
      lineTotalINR: Math.round(cost * qty * 1.18),
      qualityCheckStatus: 'PASSED',
      batchNumber: `BATCH-IND-${202400 + i}`
    });
  }

  // 4.7 restock_requests (50)
  dbs.inventory_db.restock_requests = [];
  for (let i = 1; i <= 50; i++) {
    dbs.inventory_db.restock_requests.push({
      _id: new ObjectId(),
      requestId: `RREQ-${10000 + i}`,
      productId: getProdId(i),
      warehouseId: getWhId(i),
      currentStockLevel: 12 + (i % 8),
      requestedQuantity: 100,
      urgencyLevel: i % 3 === 0 ? 'CRITICAL' : 'STANDARD',
      requestReason: 'Inventory breached safety reorder threshold buffer',
      requestedBy: 'AUTOMATED_INVENTORY_SYSTEM',
      status: 'APPROVED',
      targetDate: addDays(baseDate, 140 + i),
      createdAt: addDays(baseDate, 138 + i)
    });
  }

  // 4.8 damaged_stock (50)
  dbs.inventory_db.damaged_stock = [];
  for (let i = 1; i <= 50; i++) {
    dbs.inventory_db.damaged_stock.push({
      _id: new ObjectId(),
      damageId: `DMG-${10000 + i}`,
      inventoryId: `INVNT-${10000 + i}`,
      productId: getProdId(i),
      warehouseId: getWhId(i),
      quantityDamaged: 1 + (i % 3),
      damageType: 'TRANSIT_BOX_CRUSH',
      estimatedLossINR: 15000 + (i * 400),
      insuranceClaimed: true,
      insuranceClaimId: `ICLAIM-${50000 + i}`,
      dispositionAction: 'SCRAP_AND_WRITE_OFF',
      reportedBy: `WH_Audit_Inspector_${(i % 4) + 1}`,
      reportedDate: addDays(baseDate, 142 + i)
    });
  }

  // 4.9 warehouse_staff (50)
  dbs.inventory_db.warehouse_staff = [];
  const ROLES = ['Warehouse Operations Manager', 'Inventory Auditor', 'Forklift Lead', 'Inbound Receiving Supervisor', 'Outbound QA Lead'];
  for (let i = 1; i <= 50; i++) {
    const fn = FIRST_NAMES[(i - 1) % FIRST_NAMES.length];
    const ln = LAST_NAMES[(i - 1) % LAST_NAMES.length];
    dbs.inventory_db.warehouse_staff.push({
      _id: new ObjectId(),
      staffId: `STF-${10000 + i}`,
      warehouseId: getWhId(i),
      fullName: `${fn} ${ln}`,
      role: ROLES[(i - 1) % ROLES.length],
      shiftType: i % 2 === 0 ? 'MORNING_SHIFT' : 'EVENING_SHIFT',
      phone: `+91-${9833300000 + i * 37}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@smartecom-logistics.in`,
      salaryINR: 35000 + (i * 800),
      dateOfJoining: addDays(baseDate, i * 4),
      isActive: true,
      emergencyContact: `+91-99000${10000 + i}`
    });
  }

  // 4.10 inventory_alerts (50)
  dbs.inventory_db.inventory_alerts = [];
  for (let i = 1; i <= 50; i++) {
    dbs.inventory_db.inventory_alerts.push({
      _id: new ObjectId(),
      alertId: `ALT-${10000 + i}`,
      warehouseId: getWhId(i),
      productId: getProdId(i),
      alertType: 'LOW_STOCK_WARNING',
      severity: i % 3 === 0 ? 'HIGH' : 'MEDIUM',
      message: `Warehouse SKU stock below critical minimum threshold (${15 + (i % 5)} units remaining)`,
      isAcknowledged: true,
      acknowledgedBy: `Ops_Admin_${(i % 5) + 1}`,
      acknowledgedAt: addDays(baseDate, 145 + i),
      autoRestockTriggered: true,
      createdAt: addDays(baseDate, 145 + i)
    });
  }

  // =========================================================================
  // 5. payment_db (Member 5)
  // =========================================================================
  dbs.payment_db = {};

  // 5.1 payments (50)
  dbs.payment_db.payments = [];
  const GATEWAYS = ['Razorpay Payments', 'Cashfree PG', 'PayU India', 'BillDesk', 'PhonePe PG'];
  const PM_TYPES = ['UPI_FAST_PAY', 'CREDIT_CARD', 'NET_BANKING', 'DEBIT_CARD'];
  for (let i = 1; i <= 50; i++) {
    const payAmt = 35000 + (i * 1200);
    dbs.payment_db.payments.push({
      _id: new ObjectId(),
      paymentId: getPayId(i),
      orderId: getOrderId(i),
      customerId: getCustId(i),
      amountINR: payAmt,
      currency: 'INR',
      paymentGateway: GATEWAYS[(i - 1) % GATEWAYS.length],
      paymentMethodType: PM_TYPES[(i - 1) % PM_TYPES.length],
      paymentStatus: 'CAPTURED',
      gatewayTransactionId: `PG-TXN-${9000000 + i}`,
      gatewayFeeINR: +(payAmt * 0.015).toFixed(2),
      taxDeductedINR: +(payAmt * 0.015 * 0.18).toFixed(2),
      createdAt: addDays(baseDate, 100 + i)
    });
  }

  // 5.2 transactions (50)
  dbs.payment_db.transactions = [];
  const BANKS = ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra Bank'];
  for (let i = 1; i <= 50; i++) {
    dbs.payment_db.transactions.push({
      _id: new ObjectId(),
      transactionId: `TXN-${10000 + i}`,
      paymentId: getPayId(i),
      orderId: getOrderId(i),
      transactionType: 'DEBIT_CAPTURE',
      amountINR: 35000 + (i * 1200),
      status: 'SETTLED',
      bankReferenceNumber: `UTR-${60000000 + i * 17}`,
      issuingBank: BANKS[(i - 1) % BANKS.length],
      settlementBatchId: `BATCH-SETTLE-${202400 + (i % 20)}`,
      responseCode: '200_SUCCESS',
      transactedAt: addDays(baseDate, 100 + i)
    });
  }

  // 5.3 invoices (50)
  dbs.payment_db.invoices = [];
  for (let i = 1; i <= 50; i++) {
    const taxable = 30000 + (i * 1000);
    const cgst = Math.round(taxable * 0.09);
    const sgst = Math.round(taxable * 0.09);
    const totalInv = taxable + cgst + sgst;
    dbs.payment_db.invoices.push({
      _id: new ObjectId(),
      invoiceId: `INV-${10000 + i}`,
      invoiceNumber: `INV-2024-KA-${10000 + i}`,
      orderId: getOrderId(i),
      customerId: getCustId(i),
      paymentId: getPayId(i),
      sellerGSTIN: '29AAACT1982K1Z5',
      buyerGSTIN: i % 5 === 0 ? `29AABCT${2000 + i}M1Z8` : 'UNREGISTERED_CONSUMER',
      taxableAmountINR: taxable,
      cgstAmountINR: cgst,
      sgstAmountINR: sgst,
      igstAmountINR: 0,
      totalInvoiceAmountINR: totalInv,
      invoiceDate: addDays(baseDate, 101 + i),
      invoicePdfUrl: `https://invoices.smartecom.in/pdf/inv-${10000 + i}.pdf`
    });
  }

  // 5.4 payment_methods (50)
  dbs.payment_db.payment_methods = [];
  for (let i = 1; i <= 50; i++) {
    dbs.payment_db.payment_methods.push({
      _id: new ObjectId(),
      methodId: `PM-${10000 + i}`,
      customerId: getCustId(i),
      methodType: i % 2 === 0 ? 'UPI' : 'CREDIT_CARD',
      providerName: i % 2 === 0 ? 'GooglePay / NPCI' : 'HDFC Bank Visa Regalia',
      maskedAccountNumber: i % 2 === 0 ? `user${i}@okhdfcbank` : `4524-XXXX-XXXX-${1000 + i}`,
      cardExpiry: i % 2 === 0 ? 'N/A' : '08/28',
      cardHolderName: `${FIRST_NAMES[(i - 1) % FIRST_NAMES.length]} ${LAST_NAMES[(i - 1) % LAST_NAMES.length]}`,
      isDefault: true,
      tokenizedId: `TOKEN-RBI-${700000 + i}`,
      status: 'ACTIVE',
      createdAt: addDays(baseDate, 20 + i)
    });
  }

  // 5.5 refund_transactions (50)
  dbs.payment_db.refund_transactions = [];
  for (let i = 1; i <= 50; i++) {
    dbs.payment_db.refund_transactions.push({
      _id: new ObjectId(),
      refundTxnId: `RTXN-${10000 + i}`,
      refundId: `REF-${10000 + i}`,
      paymentId: getPayId(i),
      orderId: getOrderId(i),
      customerId: getCustId(i),
      refundAmountINR: 5000 + (i * 250),
      gatewayRefundId: `GATEWAY-REF-TXN-${800000 + i}`,
      payoutStatus: 'CREDITED_TO_SOURCE',
      payoutSpeed: 'INSTANT_IMPS',
      arnReference: `ARN-BANK-${99000000 + i}`,
      initiatedAt: addDays(baseDate, 115 + i),
      settledAt: addDays(baseDate, 116 + i)
    });
  }

  // 5.6 tax_records (50)
  dbs.payment_db.tax_records = [];
  for (let i = 1; i <= 50; i++) {
    const taxable = 30000 + (i * 1000);
    const taxAmt = Math.round(taxable * 0.18);
    dbs.payment_db.tax_records.push({
      _id: new ObjectId(),
      taxRecordId: `TAX-${10000 + i}`,
      invoiceId: `INV-${10000 + i}`,
      orderId: getOrderId(i),
      financialYear: '2023-2024',
      taxQuarter: 'Q4',
      stateJurisdiction: 'Karnataka',
      hsnSacCode: '85171300',
      taxableAmountINR: taxable,
      cgstRate: 9,
      sgstRate: 9,
      igstRate: 0,
      totalTaxCollectedINR: taxAmt,
      filingStatus: 'GSTR_1_FILED'
    });
  }

  // 5.7 wallets (50)
  dbs.payment_db.wallets = [];
  for (let i = 1; i <= 50; i++) {
    dbs.payment_db.wallets.push({
      _id: new ObjectId(),
      walletId: `WAL-${10000 + i}`,
      customerId: getCustId(i),
      currentBalanceINR: 1500 + (i * 150),
      cashbackBalanceINR: 350 + (i * 25),
      currency: 'INR',
      walletTier: i % 3 === 0 ? 'GOLD_PASS' : 'STANDARD',
      dailySpendLimitINR: 25000,
      monthlySpendLimitINR: 100000,
      isActive: true,
      lastTransactionAt: addDays(baseDate, 120 + i),
      createdAt: addDays(baseDate, 30 + i)
    });
  }

  // 5.8 offers (50)
  dbs.payment_db.offers = [];
  for (let i = 1; i <= 50; i++) {
    const bank = BANKS[(i - 1) % BANKS.length];
    dbs.payment_db.offers.push({
      _id: new ObjectId(),
      offerId: `OFF-${10000 + i}`,
      title: `Instant 10% Discount with ${bank} Credit Cards`,
      description: `Shop electronics above ₹15,000 and get instant cashback applied at checkout.`,
      bankPartner: bank,
      paymentTypeRequired: 'CREDIT_CARD_EMI',
      discountPercentage: 10,
      minOrderValueINR: 15000,
      maxDiscountINR: 2500,
      validFrom: addDays(baseDate, 60),
      validUntil: addDays(baseDate, 365),
      isActive: true,
      totalTimesRedeemed: 180 + (i * 12)
    });
  }

  // 5.9 financial_summary (50)
  dbs.payment_db.financial_summary = [];
  for (let i = 1; i <= 50; i++) {
    const gmv = 1500000 + (i * 75000);
    const disc = 80000 + (i * 3000);
    const tax = Math.round(gmv * 0.18);
    const net = gmv - disc + tax;
    dbs.payment_db.financial_summary.push({
      _id: new ObjectId(),
      summaryId: `FIN-${10000 + i}`,
      periodType: 'DAILY_RECONCILIATION',
      periodIdentifier: `2024-03-${(i % 30) + 1}`,
      grossMerchandiseValueINR: gmv,
      netRevenueINR: net,
      totalTaxCollectedINR: tax,
      totalDiscountsGivenINR: disc,
      totalRefundsIssuedINR: 45000 + (i * 1500),
      gatewayChargesINR: Math.round(gmv * 0.015),
      successfulTransactionsCount: 45 + (i * 2),
      failedTransactionsCount: 2 + (i % 3),
      calculatedAt: addDays(baseDate, 150 + i)
    });
  }

  // 5.10 payment_failures (50)
  dbs.payment_db.payment_failures = [];
  for (let i = 1; i <= 50; i++) {
    dbs.payment_db.payment_failures.push({
      _id: new ObjectId(),
      failureId: `FAIL-${10000 + i}`,
      paymentId: getPayId(i),
      orderId: getOrderId(i),
      customerId: getCustId(i),
      attemptedAmountINR: 25000 + (i * 500),
      paymentGateway: GATEWAYS[(i - 1) % GATEWAYS.length],
      errorCode: i % 2 === 0 ? 'INSUFFICIENT_FUNDS' : 'BANK_OTP_TIMEOUT',
      errorDescription: 'User exceeded session duration or issuing bank declined transaction authorization.',
      deviceInfo: 'Android 14 Chrome Mobile Client',
      retryCount: 1,
      isRecoveredLater: true,
      failedAt: addDays(baseDate, 100 + i)
    });
  }

  // =========================================================================
  // 6. analytics_db (Member 6)
  // =========================================================================
  dbs.analytics_db = {};

  // 6.1 reviews (50)
  dbs.analytics_db.reviews = [];
  const REVIEW_TITLES = [
    'Superb performance and camera quality!',
    'Exceeded expectations for daily multitasking',
    'Value for money and fast dispatch',
    'Excellent battery backup and premium build',
    'Crisp display and lightweight feel'
  ];
  const REVIEW_BODIES = [
    'The Snapdragon processor handles heavy gaming seamlessly without heating issues. Battery lasts over a day easily.',
    'Amazing display sharpness and very fast charging capability. Best purchase in this budget tier.',
    'Sturdy construction, pleasant ergonomics, and top-tier sound reproduction. Highly recommend for students.',
    'Delivered in pristine condition within 48 hours. Genuine sealed manufacturer piece with full Indian warranty.',
    'Clean software interface with regular security updates. Outstanding camera performance in low light conditions.'
  ];
  for (let i = 1; i <= 50; i++) {
    dbs.analytics_db.reviews.push({
      _id: new ObjectId(),
      reviewId: `REV-${10000 + i}`,
      productId: getProdId(i),
      customerId: getCustId(i),
      orderId: getOrderId(i),
      rating: 4 + (i % 2),
      reviewTitle: REVIEW_TITLES[(i - 1) % REVIEW_TITLES.length],
      reviewBody: REVIEW_BODIES[(i - 1) % REVIEW_BODIES.length],
      isVerifiedBuyer: true,
      helpfulVotesCount: 15 + (i * 3),
      unhelpfulVotesCount: i % 3,
      reviewStatus: 'APPROVED',
      createdAt: addDays(baseDate, 120 + i)
    });
  }

  // 6.2 ratings (50)
  dbs.analytics_db.ratings = [];
  const DIMENSIONS = ['BATTERY_LIFE', 'CAMERA_RESOLUTION', 'BUILD_QUALITY', 'VALUE_FOR_MONEY', 'DISPLAY_PANEL'];
  for (let i = 1; i <= 50; i++) {
    dbs.analytics_db.ratings.push({
      _id: new ObjectId(),
      ratingEntryId: `RAT-${10000 + i}`,
      productId: getProdId(i),
      customerId: getCustId(i),
      ratingValue: 4 + (i % 2),
      ratingCategory: DIMENSIONS[(i - 1) % DIMENSIONS.length],
      reviewId: `REV-${10000 + i}`,
      platform: 'MOBILE_APP',
      isAnonymous: false,
      verifiedPurchase: true,
      submittedAt: addDays(baseDate, 120 + i),
      updatedAt: addDays(baseDate, 120 + i)
    });
  }

  // 6.3 product_feedback (50)
  dbs.analytics_db.product_feedback = [];
  for (let i = 1; i <= 50; i++) {
    dbs.analytics_db.product_feedback.push({
      _id: new ObjectId(),
      feedbackId: `FB-${10000 + i}`,
      productId: getProdId(i),
      customerId: getCustId(i),
      feedbackType: 'FEATURE_SUGGESTION',
      sentimentScore: +(0.75 + ((i % 5) * 0.04)).toFixed(2),
      feedbackText: 'Would appreciate bundled protective case in retail packaging.',
      sentimentCategory: 'POSITIVE',
      assignedTeam: 'PRODUCT_MERCHANDISING_TEAM',
      actionTaken: 'FORWARDED_TO_OEM_REPRESENTATIVE',
      status: 'REVIEWED',
      createdAt: addDays(baseDate, 125 + i)
    });
  }

  // 6.4 sales_daily (50)
  dbs.analytics_db.sales_daily = [];
  for (let i = 1; i <= 50; i++) {
    const rev = 450000 + (i * 12000);
    const disc = 25000 + (i * 800);
    const tax = Math.round(rev * 0.18);
    dbs.analytics_db.sales_daily.push({
      _id: new ObjectId(),
      dailyMetricId: `SD-${10000 + i}`,
      recordDate: addDays(baseDate, 100 + i).toISOString().split('T')[0],
      totalOrders: 35 + (i % 15),
      totalRevenueINR: rev,
      totalDiscountINR: disc,
      totalTaxINR: tax,
      totalShippingRevenueINR: 4500 + (i * 100),
      averageOrderValueINR: Math.round(rev / (35 + (i % 15))),
      totalItemsSold: 55 + (i * 2),
      uniqueCustomersCount: 30 + (i % 12),
      topSellingCategoryId: getCatId(((i - 1) % 50) + 1),
      updatedAt: addDays(baseDate, 101 + i)
    });
  }

  // 6.5 sales_monthly (50)
  dbs.analytics_db.sales_monthly = [];
  for (let i = 1; i <= 50; i++) {
    const gross = 12000000 + (i * 450000);
    const net = Math.round(gross * 0.92);
    dbs.analytics_db.sales_monthly.push({
      _id: new ObjectId(),
      monthlyMetricId: `SM-${10000 + i}`,
      monthIdentifier: `2024-${String((i % 12) + 1).padStart(2, '0')}`,
      year: 2024,
      month: (i % 12) + 1,
      grossSalesINR: gross,
      netSalesINR: net,
      totalOrdersCount: 950 + (i * 30),
      completedOrdersCount: 900 + (i * 28),
      cancelledOrdersCount: 30 + (i % 5),
      returnedOrdersCount: 20 + (i % 4),
      averageOrderValueINR: Math.round(gross / (950 + (i * 30))),
      topSellingProductId: getProdId(((i * 2) % 50) + 1),
      generatedAt: addDays(baseDate, 150 + i)
    });
  }

  // 6.6 customer_metrics (50)
  dbs.analytics_db.customer_metrics = [];
  for (let i = 1; i <= 50; i++) {
    const spend = 45000 + (i * 3500);
    const orders = 3 + (i % 8);
    dbs.analytics_db.customer_metrics.push({
      _id: new ObjectId(),
      customerMetricId: `CM-${10000 + i}`,
      customerId: getCustId(i),
      totalOrdersCount: orders,
      totalSpendINR: spend,
      averageOrderValueINR: Math.round(spend / orders),
      lastOrderDate: addDays(baseDate, 120 + i),
      firstOrderDate: addDays(baseDate, i * 7),
      customerLifetimeDays: 120 + (i * 3),
      rfmScore: 'R5-F4-M5',
      customerSegment: i % 3 === 0 ? 'HIGH_VALUE_LOYAL' : 'CONSISTENT_BUYER',
      churnProbability: +(0.05 + ((i % 10) * 0.01)).toFixed(2),
      updatedAt: addDays(baseDate, 130 + i)
    });
  }

  // 6.7 product_metrics (50)
  dbs.analytics_db.product_metrics = [];
  for (let i = 1; i <= 50; i++) {
    const units = 120 + (i * 8);
    dbs.analytics_db.product_metrics.push({
      _id: new ObjectId(),
      productMetricId: `PMET-${10000 + i}`,
      productId: getProdId(i),
      totalUnitsSold: units,
      totalSalesRevenueINR: units * (25000 + (i * 300)),
      pageViewCount: 4500 + (i * 180),
      cartAddCount: 650 + (i * 25),
      conversionRatePercentage: +(3.2 + ((i % 5) * 0.4)).toFixed(1),
      averageRating: +(4.2 + ((i % 7) * 0.1)).toFixed(1),
      totalReviewsCount: 40 + (i * 2),
      returnRatePercentage: +(1.2 + ((i % 4) * 0.3)).toFixed(1),
      inventoryTurnoverRatio: +(4.5 + ((i % 6) * 0.5)).toFixed(1),
      calculatedAt: addDays(baseDate, 140 + i)
    });
  }

  // 6.8 category_metrics (50)
  dbs.analytics_db.category_metrics = [];
  for (let i = 1; i <= 50; i++) {
    const rev = 2500000 + (i * 95000);
    dbs.analytics_db.category_metrics.push({
      _id: new ObjectId(),
      categoryMetricId: `CATMET-${10000 + i}`,
      categoryId: getCatId(i),
      categoryName: `Category Dimension ${i}`,
      periodMonth: '2024-03',
      totalRevenueINR: rev,
      totalUnitsSold: 280 + (i * 12),
      revenueContributionPercentage: +(1.8 + ((i % 5) * 0.4)).toFixed(2),
      growthRatePercentage: +(8.5 + ((i % 8) * 0.5)).toFixed(1),
      averageSellingPriceINR: Math.round(rev / (280 + (i * 12))),
      activeProductCount: 45 + (i * 2),
      returnRatePercentage: 2.1,
      updatedAt: addDays(baseDate, 145 + i)
    });
  }

  // 6.9 search_history (50)
  dbs.analytics_db.search_history = [];
  const QUERIES = [
    'OnePlus 5G flagship emerald',
    'Noise amoled bluetooth calling smartwatch',
    'Samsung Galaxy S24 Ultra titanium',
    'ANC wireless earbuds under 3000',
    'Sony noise canceling headphones WH-1000XM5'
  ];
  for (let i = 1; i <= 50; i++) {
    dbs.analytics_db.search_history.push({
      _id: new ObjectId(),
      searchId: `SRCH-${10000 + i}`,
      customerId: getCustId(i),
      searchQuery: QUERIES[(i - 1) % QUERIES.length],
      resultsCount: 24 + (i % 18),
      clickedProductId: getProdId(i),
      deviceType: i % 2 === 0 ? 'MOBILE' : 'DESKTOP',
      hasFiltersApplied: true,
      appliedFilterDetails: { priceMin: 5000, priceMax: 65000, ratingAbove: 4 },
      searchLatencyMs: 38 + (i % 25),
      userConverted: true,
      searchedAt: addDays(baseDate, 110 + i)
    });
  }

  // 6.10 recommendations (50)
  dbs.analytics_db.recommendations = [];
  const ALGORITHMS = ['COLLABORATIVE_FILTERING', 'FREQUENTLY_BOUGHT_TOGETHER', 'SIMILAR_PRICE_BRACKET', 'CATEGORY_AFFINITY_GRAPH'];
  for (let i = 1; i <= 50; i++) {
    dbs.analytics_db.recommendations.push({
      _id: new ObjectId(),
      recommendationId: `REC-${10000 + i}`,
      customerId: getCustId(i),
      recommendedProductId: getProdId(((i * 3) % 50) + 1),
      recommendationAlgorithm: ALGORITHMS[(i - 1) % ALGORITHMS.length],
      recommendationScore: +(0.85 + ((i % 12) * 0.01)).toFixed(2),
      rankPosition: (i % 5) + 1,
      status: 'ACTIVE',
      impressionsCount: 8 + (i % 15),
      isClicked: true,
      generatedAt: addDays(baseDate, 130 + i),
      expiresAt: addDays(baseDate, 160 + i)
    });
  }

  return dbs;
}

module.exports = { generateSeedData };
