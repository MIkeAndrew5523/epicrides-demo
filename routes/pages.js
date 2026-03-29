const router = require('express').Router();
const db = require('../database');

// Homepage
router.get('/', (req, res) => {
  res.render('layout', {
    title: 'Epic Rides - Your Express Bus to Whistler',
    page: 'home',
    body: 'index',
    siteContent: db.getSiteContent(),
    testimonials: db.getTestimonials(),
    facts: db.getFacts(),
  });
});

// Schedule
router.get('/schedule', (req, res) => {
  res.render('layout', {
    title: 'Whistler Bus Schedule - Epic Rides',
    page: 'schedule',
    body: 'schedule',
    siteContent: db.getSiteContent(),
    schedules: db.getSchedules(),
  });
});

// Pickup Locations
router.get('/locations', (req, res) => {
  res.render('layout', {
    title: 'Pick Up Locations - Epic Rides',
    page: 'locations',
    body: 'locations',
    siteContent: db.getSiteContent(),
    locations: db.getLocations(),
  });
});

// FAQ
router.get('/faq', (req, res) => {
  res.render('layout', {
    title: 'FAQ - Epic Rides',
    page: 'faq',
    body: 'faq',
    siteContent: db.getSiteContent(),
    faqs: db.getFaqs(),
  });
});

// Contact
router.get('/contact', (req, res) => {
  res.render('layout', {
    title: 'Contact Us - Epic Rides',
    page: 'contact',
    body: 'contact',
    siteContent: db.getSiteContent(),
  });
});

module.exports = router;
