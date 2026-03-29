# Routes

## Pattern
- `pages.js` — Public GET routes (/, /schedule, /locations, /faq, /contact)
- `booking.js` — Booking routes (GET /book, POST /api/bookings, GET /api/bookings/:ref, POST /api/bookings/:ref/cancel)
- `admin.js` — Admin CMS routes (all under /admin prefix)

## DB Access
Import helpers from `../database.js`:
```js
const db = require('../database');
db.getTestimonials(); // returns array
db.createBooking(data); // returns booking object
```

## Error Handling
Use try/catch, send 500 with error message in dev mode.

## JSON API Format
```json
{ "success": true, "data": { ... } }
{ "success": false, "error": "message" }
```

## Auth
Admin routes use `requireAdmin` middleware from `../middleware/auth.js`.
Checks `req.session.admin` — redirects to /admin/login if not set.
