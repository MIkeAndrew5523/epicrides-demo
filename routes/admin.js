const router = require('express').Router();
const db = require('../database');
const { requireAdmin } = require('../middleware/auth');

// Login page
router.get('/login', (req, res) => {
  res.render('layout', {
    title: 'Admin Login - Epic Rides',
    page: 'admin-login',
    body: 'admin/login',
    siteContent: db.getSiteContent(),
  });
});

// Login POST
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const admin = db.verifyAdmin(username, password);
  if (!admin) {
    req.session.flash = { type: 'error', message: 'Invalid credentials' };
    return res.redirect('/admin/login');
  }
  req.session.admin = admin;
  res.redirect('/admin');
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Dashboard
router.get('/', requireAdmin, (req, res) => {
  res.render('layout', {
    title: 'Admin Dashboard - Epic Rides',
    page: 'admin',
    body: 'admin/dashboard',
    siteContent: db.getSiteContent(),
    stats: db.getBookingStats(),
  });
});

// ===== BOOKINGS =====
router.get('/bookings', requireAdmin, (req, res) => {
  res.render('layout', {
    title: 'Manage Bookings - Epic Rides',
    page: 'admin',
    body: 'admin/bookings',
    siteContent: db.getSiteContent(),
    bookings: db.getBookings(),
  });
});

router.post('/bookings/:ref/cancel', requireAdmin, (req, res) => {
  db.cancelBooking(req.params.ref);
  req.session.flash = { type: 'success', message: 'Booking cancelled' };
  res.redirect('/admin/bookings');
});

// ===== SCHEDULES =====
router.get('/schedules', requireAdmin, (req, res) => {
  res.render('layout', {
    title: 'Manage Schedules - Epic Rides',
    page: 'admin',
    body: 'admin/schedules',
    siteContent: db.getSiteContent(),
    schedules: db.getSchedules(false),
  });
});

router.post('/schedules', requireAdmin, (req, res) => {
  db.createSchedule(req.body);
  req.session.flash = { type: 'success', message: 'Schedule created' };
  res.redirect('/admin/schedules');
});

router.post('/schedules/:id/update', requireAdmin, (req, res) => {
  db.updateSchedule(req.params.id, { ...req.body, active: req.body.active ? 1 : 0 });
  req.session.flash = { type: 'success', message: 'Schedule updated' };
  res.redirect('/admin/schedules');
});

router.post('/schedules/:id/delete', requireAdmin, (req, res) => {
  db.deleteSchedule(req.params.id);
  req.session.flash = { type: 'success', message: 'Schedule deleted' };
  res.redirect('/admin/schedules');
});

// ===== CONTENT =====
router.get('/content', requireAdmin, (req, res) => {
  res.render('layout', {
    title: 'Manage Content - Epic Rides',
    page: 'admin',
    body: 'admin/content',
    siteContent: db.getSiteContent(),
    testimonials: db.getTestimonials(false),
    facts: db.getFacts(false),
    faqs: db.getFaqs(false),
  });
});

// Testimonials CRUD
router.post('/testimonials', requireAdmin, (req, res) => {
  db.createTestimonial({ ...req.body, rating: parseInt(req.body.rating) || 5, sort_order: parseInt(req.body.sort_order) || 0 });
  req.session.flash = { type: 'success', message: 'Testimonial added' };
  res.redirect('/admin/content');
});

router.post('/testimonials/:id/update', requireAdmin, (req, res) => {
  db.updateTestimonial(req.params.id, { ...req.body, rating: parseInt(req.body.rating) || 5, active: req.body.active ? 1 : 0 });
  req.session.flash = { type: 'success', message: 'Testimonial updated' };
  res.redirect('/admin/content');
});

router.post('/testimonials/:id/delete', requireAdmin, (req, res) => {
  db.deleteTestimonial(req.params.id);
  req.session.flash = { type: 'success', message: 'Testimonial deleted' };
  res.redirect('/admin/content');
});

// Facts CRUD
router.post('/facts', requireAdmin, (req, res) => {
  db.createFact({ ...req.body, sort_order: parseInt(req.body.sort_order) || 0 });
  req.session.flash = { type: 'success', message: 'Fact added' };
  res.redirect('/admin/content');
});

router.post('/facts/:id/update', requireAdmin, (req, res) => {
  db.updateFact(req.params.id, { ...req.body, active: req.body.active ? 1 : 0 });
  req.session.flash = { type: 'success', message: 'Fact updated' };
  res.redirect('/admin/content');
});

router.post('/facts/:id/delete', requireAdmin, (req, res) => {
  db.deleteFact(req.params.id);
  req.session.flash = { type: 'success', message: 'Fact deleted' };
  res.redirect('/admin/content');
});

// FAQ CRUD
router.post('/faqs', requireAdmin, (req, res) => {
  db.createFaq({ ...req.body, sort_order: parseInt(req.body.sort_order) || 0 });
  req.session.flash = { type: 'success', message: 'FAQ added' };
  res.redirect('/admin/content');
});

router.post('/faqs/:id/update', requireAdmin, (req, res) => {
  db.updateFaq(req.params.id, { ...req.body, active: req.body.active ? 1 : 0 });
  req.session.flash = { type: 'success', message: 'FAQ updated' };
  res.redirect('/admin/content');
});

router.post('/faqs/:id/delete', requireAdmin, (req, res) => {
  db.deleteFaq(req.params.id);
  req.session.flash = { type: 'success', message: 'FAQ deleted' };
  res.redirect('/admin/content');
});

// Site content update
router.post('/site-content', requireAdmin, (req, res) => {
  for (const [key, value] of Object.entries(req.body)) {
    db.updateSiteContent(key, value);
  }
  req.session.flash = { type: 'success', message: 'Site content updated' };
  res.redirect('/admin/content');
});

// ===== LOCATIONS =====
router.get('/locations', requireAdmin, (req, res) => {
  res.render('layout', {
    title: 'Manage Locations - Epic Rides',
    page: 'admin',
    body: 'admin/locations',
    siteContent: db.getSiteContent(),
    locations: db.getLocations(),
  });
});

router.post('/locations', requireAdmin, (req, res) => {
  db.createLocation({ ...req.body, lat: parseFloat(req.body.lat) || 0, lng: parseFloat(req.body.lng) || 0, sort_order: parseInt(req.body.sort_order) || 0 });
  req.session.flash = { type: 'success', message: 'Location added' };
  res.redirect('/admin/locations');
});

router.post('/locations/:id/update', requireAdmin, (req, res) => {
  db.updateLocation(req.params.id, { ...req.body, lat: parseFloat(req.body.lat) || 0, lng: parseFloat(req.body.lng) || 0 });
  req.session.flash = { type: 'success', message: 'Location updated' };
  res.redirect('/admin/locations');
});

router.post('/locations/:id/delete', requireAdmin, (req, res) => {
  db.deleteLocation(req.params.id);
  req.session.flash = { type: 'success', message: 'Location deleted' };
  res.redirect('/admin/locations');
});

module.exports = router;
