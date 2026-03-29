const router = require('express').Router();
const db = require('../database');

// Booking page
router.get('/book', (req, res) => {
  res.render('layout', {
    title: 'Book Now - Epic Rides',
    page: 'book',
    body: 'booking',
    siteContent: db.getSiteContent(),
    schedules: db.getSchedules(),
  });
});

// Create booking API
router.post('/api/bookings', (req, res) => {
  try {
    const { customer_name, customer_email, customer_phone, schedule_id, travel_date, return_date, passengers, trip_type } = req.body;
    const schedule = db.getSchedule(parseInt(schedule_id));
    if (!schedule) return res.json({ success: false, error: 'Invalid schedule selected' });

    const price = trip_type === 'roundtrip' ? schedule.price_roundtrip : schedule.price_oneway;
    const total_price = price * parseInt(passengers);

    const result = db.createBooking({
      customer_name,
      customer_email,
      customer_phone: customer_phone || '',
      schedule_id: parseInt(schedule_id),
      travel_date,
      return_date: return_date || null,
      passengers: parseInt(passengers),
      trip_type,
      total_price,
    });

    res.json({ success: true, data: result });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// Booking confirmation page
router.get('/booking/:ref', (req, res) => {
  const booking = db.getBooking(req.params.ref);
  if (!booking) {
    return res.status(404).render('layout', {
      title: 'Booking Not Found - Epic Rides',
      page: 'booking-confirm',
      body: '404',
      siteContent: db.getSiteContent(),
    });
  }
  res.render('layout', {
    title: 'Booking Confirmation - Epic Rides',
    page: 'booking-confirm',
    body: 'booking-confirm',
    siteContent: db.getSiteContent(),
    booking,
  });
});

// Lookup booking
router.get('/api/bookings/:ref', (req, res) => {
  const booking = db.getBooking(req.params.ref);
  if (!booking) return res.json({ success: false, error: 'Booking not found' });
  res.json({ success: true, data: booking });
});

// Cancel booking
router.post('/api/bookings/:ref/cancel', (req, res) => {
  try {
    const result = db.cancelBooking(req.params.ref);
    if (result.changes === 0) return res.json({ success: false, error: 'Booking not found' });
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

module.exports = router;
