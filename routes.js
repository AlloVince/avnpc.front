const nextRoutes = require('next-routes');
require('isomorphic-unfetch');

const routes = module.exports = nextRoutes();
routes.add('index', '/');
routes.add('thinking', '/thinking');
routes.add('reading', '/reading');
routes.add('note', '/reading/:slug');
routes.add('p', '/p/:id');
routes.add('page', '/pages/:slug');
routes.add('about', '/about');
