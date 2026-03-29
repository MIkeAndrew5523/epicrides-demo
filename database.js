const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'epicrides.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ============================================================
// SCHEMA
// ============================================================

db.exec(`
  CREATE TABLE IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    departure_city TEXT NOT NULL,
    arrival_city TEXT NOT NULL,
    departure_time TEXT NOT NULL,
    arrival_time TEXT NOT NULL,
    days_of_week TEXT NOT NULL DEFAULT 'Mon,Tue,Wed,Thu,Fri,Sat,Sun',
    price_oneway REAL NOT NULL,
    price_roundtrip REAL NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_ref TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    schedule_id INTEGER,
    travel_date TEXT NOT NULL,
    return_date TEXT,
    passengers INTEGER NOT NULL DEFAULT 1,
    trip_type TEXT NOT NULL DEFAULT 'roundtrip',
    total_price REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (schedule_id) REFERENCES schedules(id)
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quote TEXT NOT NULL,
    author TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    active INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS did_you_know (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fact_text TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS pickup_locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city TEXT NOT NULL,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    lat REAL,
    lng REAL,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS site_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS faq (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// ============================================================
// SEED DATA (only if tables are empty)
// ============================================================

function seedIfEmpty() {
  const count = db.prepare('SELECT COUNT(*) as c FROM admin_users').get().c;
  if (count > 0) return; // already seeded

  // Admin user
  const hash = bcrypt.hashSync('epicrides2026', 10);
  db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run('admin', hash);

  // Schedules — Vancouver to Whistler
  const insertSchedule = db.prepare(`
    INSERT INTO schedules (departure_city, arrival_city, departure_time, arrival_time, days_of_week, price_oneway, price_roundtrip, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const schedules = [
    ['Vancouver', 'Whistler', '6:25 AM', '8:10 AM', 'Mon,Tue,Wed,Thu,Fri,Sat,Sun', 33.50, 44.00, 1],
    ['Vancouver', 'Whistler', '8:25 AM', '10:10 AM', 'Mon,Tue,Wed,Thu,Fri,Sat,Sun', 33.50, 44.00, 2],
    ['Vancouver', 'Whistler', '10:25 AM', '12:10 PM', 'Mon,Tue,Wed,Thu,Fri,Sat,Sun', 33.50, 44.00, 3],
    ['Vancouver', 'Whistler', '12:25 PM', '2:10 PM', 'Mon,Tue,Wed,Thu,Fri,Sat,Sun', 33.50, 44.00, 4],
    ['Vancouver', 'Whistler', '2:25 PM', '4:10 PM', 'Mon,Tue,Wed,Thu,Fri,Sat,Sun', 33.50, 44.00, 5],
    ['Vancouver', 'Whistler', '4:25 PM', '6:10 PM', 'Fri,Sat,Sun', 33.50, 44.00, 6],
    ['Vancouver', 'Whistler', '6:25 PM', '8:10 PM', 'Fri,Sat,Sun', 33.50, 44.00, 7],
    ['Whistler', 'Vancouver', '8:25 AM', '10:10 AM', 'Mon,Tue,Wed,Thu,Fri,Sat,Sun', 33.50, 44.00, 8],
    ['Whistler', 'Vancouver', '10:25 AM', '12:10 PM', 'Mon,Tue,Wed,Thu,Fri,Sat,Sun', 33.50, 44.00, 9],
    ['Whistler', 'Vancouver', '12:25 PM', '2:10 PM', 'Mon,Tue,Wed,Thu,Fri,Sat,Sun', 33.50, 44.00, 10],
    ['Whistler', 'Vancouver', '2:25 PM', '4:10 PM', 'Mon,Tue,Wed,Thu,Fri,Sat,Sun', 33.50, 44.00, 11],
    ['Whistler', 'Vancouver', '4:25 PM', '6:10 PM', 'Mon,Tue,Wed,Thu,Fri,Sat,Sun', 33.50, 44.00, 12],
    ['Whistler', 'Vancouver', '6:25 PM', '8:10 PM', 'Fri,Sat,Sun', 33.50, 44.00, 13],
    ['Whistler', 'Vancouver', '8:25 PM', '10:10 PM', 'Fri,Sat,Sun', 33.50, 44.00, 14],
  ];
  for (const s of schedules) insertSchedule.run(...s);

  // Testimonials
  const insertTestimonial = db.prepare('INSERT INTO testimonials (quote, author, rating, sort_order) VALUES (?, ?, ?, ?)');
  insertTestimonial.run("Excellent service from Scott and Epic Rides. Fast, efficient, friendly and unreal value for money. Most other options were gonna be at least $100. Perfect pick up location downtown and straight to Whistler village. Highly recommended!", "Conor L.", 5, 1);
  insertTestimonial.run("The ride with Scott and epic rides was great! The value was by far the best option we were able to find for getting to Whistler. The ride was punctual and we made great time getting to our destination. It was wonderful to be dropped off at the front door of our hotel! Would use this again if returning to Whistler.", "Amanda A.", 5, 2);
  insertTestimonial.run("Couldn't make my return trip on time, emailed Scott and the situation was easily resolved, no Greyhound politics here! Thanks Epic Rides and Scott :)", "Jonny S.", 5, 3);

  // Did You Know facts
  const insertFact = db.prepare('INSERT INTO did_you_know (fact_text, sort_order) VALUES (?, ?)');
  const facts = [
    "EpicRides is the only true direct, non-stop service between Vancouver and Whistler.",
    "EpicRides is a locally owned and operated company since 2012.",
    "You can take all luggage, skis, and bikes for free on an EpicRides shuttle.",
    "EpicRides is the only company that offers an all-inclusive fare, no hidden fees.",
    "Your trip between Vancouver and Whistler is only 1:45 minutes.",
    "EpicRides has the newest luxury shuttles on the Sea to Sky corridor.",
    "EpicRides is paperless, no need to print your ticket to check in.",
    "EpicRides uses Canadian made, non-chemical disinfectants on all our buses.",
    "EpicRides offers multi passes for our frequent travellers starting as low as $25 per round trip.",
    "EpicRides is the #1 Recommended company by Vancouver and Whistler Locals.",
    "EpicRides offers an on-time service.",
    "EpicRides never cancels a departure due to road closure.",
    "EpicRides offers the most flexible cancellation and change policy.",
    "Before EpicRides started, the average bus fare to Whistler was over $100.",
    "EpicRides offers the most departure times from each city.",
  ];
  facts.forEach((f, i) => insertFact.run(f, i + 1));

  // Pickup Locations
  const insertLocation = db.prepare('INSERT INTO pickup_locations (city, name, address, lat, lng, description, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)');
  insertLocation.run('Vancouver', 'Downtown Vancouver', '1088 Melville St, Vancouver, BC', 49.2860, -123.1245, 'Main downtown pickup point near the Burrard SkyTrain station.', 1);
  insertLocation.run('Whistler', 'Whistler Village', 'Gateway Drive, Whistler Village, BC', 50.1163, -122.9574, 'Drop off right in Whistler Village near the main gondola.', 2);

  // Site Content
  const insertContent = db.prepare('INSERT INTO site_content (key, value) VALUES (?, ?)');
  const content = {
    'hero_title': 'Your Express Bus to Whistler',
    'hero_subtitle': 'Direct, non-stop service between Vancouver and Whistler Village',
    'price_roundtrip': '44',
    'price_oneway': '33.50',
    'price_multipass': '25',
    'phone': '604-349-1234',
    'email': 'info@epicrides.ca',
    'address': '1088 Melville St, Vancouver, BC',
    'hours': '9am - 7:30pm, 7 days/week',
    'trip_time': '1:45',
    'about_text': 'Epic Rides is the #1 recommended company by Vancouver and Whistler locals. We offer a direct, non-stop express bus service between Vancouver and Whistler with the most affordable fares, newest luxury shuttles, and best customer service on the Sea to Sky corridor. Operating since 2012, we are a locally owned and operated company committed to getting you there safely, comfortably, and on time.',
    'copyright': '2026 Epic Rides',
  };
  for (const [k, v] of Object.entries(content)) insertContent.run(k, v);

  // FAQ
  const insertFaq = db.prepare('INSERT INTO faq (question, answer, sort_order) VALUES (?, ?, ?)');
  const faqs = [
    ["How do I book a trip?", "You can book online through our website by clicking 'Book Now', or call us at 604-349-1234. We recommend booking online for the fastest experience.", 1],
    ["What is your cancellation policy?", "We offer the most flexible cancellation and change policy. Account holders can make free unlimited changes up to 8 hours before departure.", 2],
    ["How much luggage can I bring?", "All luggage, skis, snowboards, and bikes travel free! There are no hidden fees or extra charges for your gear.", 3],
    ["How long is the trip?", "The average trip time between Vancouver and Whistler is approximately 1 hour and 45 minutes, depending on traffic and weather conditions.", 4],
    ["Where do you pick up in Vancouver?", "Our main pickup location is at 1088 Melville St, Vancouver, BC — conveniently located in downtown Vancouver.", 5],
    ["Do your buses have washrooms?", "Yes! All of our luxury shuttles are equipped with onboard washrooms for your comfort.", 6],
    ["Do you offer group discounts?", "Yes, we offer group discounts for parties of 6 or more passengers. Contact us for a custom quote.", 7],
    ["What happens if the highway is closed?", "EpicRides never cancels a departure due to road closure. We will wait for the road to reopen and get you to your destination.", 8],
  ];
  for (const f of faqs) insertFaq.run(...f);
}

seedIfEmpty();

// ============================================================
// HELPER FUNCTIONS
// ============================================================

module.exports = {
  // Schedules
  getSchedules: (activeOnly = true) => {
    const where = activeOnly ? 'WHERE active = 1' : '';
    return db.prepare(`SELECT * FROM schedules ${where} ORDER BY sort_order`).all();
  },
  getSchedule: (id) => db.prepare('SELECT * FROM schedules WHERE id = ?').get(id),
  createSchedule: (data) => {
    return db.prepare(`INSERT INTO schedules (departure_city, arrival_city, departure_time, arrival_time, days_of_week, price_oneway, price_roundtrip, sort_order)
      VALUES (@departure_city, @arrival_city, @departure_time, @arrival_time, @days_of_week, @price_oneway, @price_roundtrip, @sort_order)`).run(data);
  },
  updateSchedule: (id, data) => {
    return db.prepare(`UPDATE schedules SET departure_city=@departure_city, arrival_city=@arrival_city, departure_time=@departure_time, arrival_time=@arrival_time, days_of_week=@days_of_week, price_oneway=@price_oneway, price_roundtrip=@price_roundtrip, active=@active WHERE id=@id`).run({ ...data, id });
  },
  deleteSchedule: (id) => db.prepare('DELETE FROM schedules WHERE id = ?').run(id),

  // Bookings
  getBookings: (filters = {}) => {
    let sql = 'SELECT b.*, s.departure_city, s.arrival_city, s.departure_time FROM bookings b LEFT JOIN schedules s ON b.schedule_id = s.id';
    const conditions = [];
    const params = {};
    if (filters.status) { conditions.push('b.status = @status'); params.status = filters.status; }
    if (filters.date) { conditions.push('b.travel_date = @date'); params.date = filters.date; }
    if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY b.created_at DESC';
    return db.prepare(sql).all(params);
  },
  getBooking: (ref) => {
    return db.prepare('SELECT b.*, s.departure_city, s.arrival_city, s.departure_time, s.arrival_time FROM bookings b LEFT JOIN schedules s ON b.schedule_id = s.id WHERE b.booking_ref = ?').get(ref);
  },
  createBooking: (data) => {
    const ref = 'ER-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    db.prepare(`INSERT INTO bookings (booking_ref, customer_name, customer_email, customer_phone, schedule_id, travel_date, return_date, passengers, trip_type, total_price)
      VALUES (@booking_ref, @customer_name, @customer_email, @customer_phone, @schedule_id, @travel_date, @return_date, @passengers, @trip_type, @total_price)`).run({ ...data, booking_ref: ref });
    return { booking_ref: ref };
  },
  cancelBooking: (ref) => {
    return db.prepare("UPDATE bookings SET status = 'cancelled' WHERE booking_ref = ?").run(ref);
  },

  // Testimonials
  getTestimonials: (activeOnly = true) => {
    const where = activeOnly ? 'WHERE active = 1' : '';
    return db.prepare(`SELECT * FROM testimonials ${where} ORDER BY sort_order`).all();
  },
  createTestimonial: (data) => {
    return db.prepare('INSERT INTO testimonials (quote, author, rating, sort_order) VALUES (@quote, @author, @rating, @sort_order)').run(data);
  },
  updateTestimonial: (id, data) => {
    return db.prepare('UPDATE testimonials SET quote=@quote, author=@author, rating=@rating, active=@active WHERE id=@id').run({ ...data, id });
  },
  deleteTestimonial: (id) => db.prepare('DELETE FROM testimonials WHERE id = ?').run(id),

  // Did You Know
  getFacts: (activeOnly = true) => {
    const where = activeOnly ? 'WHERE active = 1' : '';
    return db.prepare(`SELECT * FROM did_you_know ${where} ORDER BY sort_order`).all();
  },
  createFact: (data) => {
    return db.prepare('INSERT INTO did_you_know (fact_text, sort_order) VALUES (@fact_text, @sort_order)').run(data);
  },
  updateFact: (id, data) => {
    return db.prepare('UPDATE did_you_know SET fact_text=@fact_text, active=@active WHERE id=@id').run({ ...data, id });
  },
  deleteFact: (id) => db.prepare('DELETE FROM did_you_know WHERE id = ?').run(id),

  // Pickup Locations
  getLocations: () => db.prepare('SELECT * FROM pickup_locations ORDER BY sort_order').all(),
  createLocation: (data) => {
    return db.prepare('INSERT INTO pickup_locations (city, name, address, lat, lng, description, sort_order) VALUES (@city, @name, @address, @lat, @lng, @description, @sort_order)').run(data);
  },
  updateLocation: (id, data) => {
    return db.prepare('UPDATE pickup_locations SET city=@city, name=@name, address=@address, lat=@lat, lng=@lng, description=@description WHERE id=@id').run({ ...data, id });
  },
  deleteLocation: (id) => db.prepare('DELETE FROM pickup_locations WHERE id = ?').run(id),

  // Site Content
  getSiteContent: () => {
    const rows = db.prepare('SELECT key, value FROM site_content').all();
    const obj = {};
    for (const r of rows) obj[r.key] = r.value;
    return obj;
  },
  updateSiteContent: (key, value) => {
    const existing = db.prepare('SELECT id FROM site_content WHERE key = ?').get(key);
    if (existing) {
      db.prepare('UPDATE site_content SET value = ? WHERE key = ?').run(value, key);
    } else {
      db.prepare('INSERT INTO site_content (key, value) VALUES (?, ?)').run(key, value);
    }
  },

  // FAQ
  getFaqs: (activeOnly = true) => {
    const where = activeOnly ? 'WHERE active = 1' : '';
    return db.prepare(`SELECT * FROM faq ${where} ORDER BY sort_order`).all();
  },
  createFaq: (data) => {
    return db.prepare('INSERT INTO faq (question, answer, sort_order) VALUES (@question, @answer, @sort_order)').run(data);
  },
  updateFaq: (id, data) => {
    return db.prepare('UPDATE faq SET question=@question, answer=@answer, active=@active WHERE id=@id').run({ ...data, id });
  },
  deleteFaq: (id) => db.prepare('DELETE FROM faq WHERE id = ?').run(id),

  // Contact Messages
  createContactMessage: (data) => {
    return db.prepare('INSERT INTO contact_messages (name, email, subject, message) VALUES (@name, @email, @subject, @message)').run(data);
  },
  getContactMessages: () => db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all(),

  // Admin Auth
  verifyAdmin: (username, password) => {
    const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
    if (!user) return null;
    if (!bcrypt.compareSync(password, user.password_hash)) return null;
    return { id: user.id, username: user.username };
  },

  // Stats
  getBookingStats: () => {
    const today = new Date().toISOString().split('T')[0];
    return {
      totalBookings: db.prepare('SELECT COUNT(*) as c FROM bookings').get().c,
      todayBookings: db.prepare('SELECT COUNT(*) as c FROM bookings WHERE date(created_at) = ?').get(today).c,
      confirmedBookings: db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'confirmed'").get().c,
      cancelledBookings: db.prepare("SELECT COUNT(*) as c FROM bookings WHERE status = 'cancelled'").get().c,
    };
  },
};
