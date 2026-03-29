# Admin CMS

## Layout
Admin pages use the same layout.ejs but with `page: 'admin'` which triggers admin-specific nav/sidebar rendering.

## CRUD Pattern
Each entity (schedules, testimonials, facts, locations, FAQ) follows:
- GET /admin/{entity} — List view with edit/delete buttons
- POST /admin/{entity} — Create new
- POST /admin/{entity}/:id/update — Update existing
- POST /admin/{entity}/:id/delete — Delete

## Forms
Use standard HTML forms with POST method. No AJAX needed for admin.
Include hidden `_method` field if needed for semantic clarity.

## Flash Messages
Use `req.session.flash` to pass success/error messages between redirects.
Display in template: `<% if (flash) { %><div class="flash flash--<%= flash.type %>"><%= flash.message %></div><% } %>`

## Admin Credentials
- Username: admin
- Password: epicrides2026
