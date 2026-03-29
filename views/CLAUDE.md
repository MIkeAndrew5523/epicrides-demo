# EJS Templates

## Layout Pattern
All pages use `layout.ejs` as a wrapper. Pages are rendered by the route passing `body` content path:

```js
res.render('layout', {
  title: 'Page Title',
  page: 'index',  // used for nav active state
  body: '../views/index'  // the page content partial
});
```

Inside layout.ejs, the page content is included via:
```ejs
<%- include(body) %>
```

## Template Data
All templates receive from routes:
- `title` — page title
- `page` — current page identifier for nav highlighting
- `siteContent` — key/value object from site_content table
- Page-specific data (testimonials, schedules, etc.)

## Partials Convention
Shared components go in `views/partials/` if needed, included via `<%- include('partials/name') %>`
