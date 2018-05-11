const { EvaEngine, DI } = require('evaengine');
const next = require('next');
const http = require('http');
const { parse } = require('url');
const { join } = require('path');
const routes = require('./routes');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handler = routes.getRequestHandler(app);

const engine = new EvaEngine({
  projectRoot: `${__dirname}`,
  port
});
engine.bootstrap();
const expressApp = EvaEngine.getApp();

// console.log('---------hotReloader config', app.hotReloader.config);
app
  .prepare()
  .then(() => {
    process.on('uncaughtException', engine.getUncaughtExceptionHandler());
    expressApp.set('port', port);
    expressApp.set('logger', DI.get('logger'));

    const server = http.createServer(expressApp);
    server.on('error', engine.getServerErrorHandler());

    expressApp.use(DI.get('debug')());
    expressApp.get('*', (req, res) => {
      const parsedUrl = parse(req.url, true);
      const rootStaticFiles = [
        '/robots.txt',
        '/sitemap.xml',
        '/favicon.ico'
      ];
      if (rootStaticFiles.indexOf(parsedUrl.pathname) > -1) {
        const path = join(__dirname, 'static', parsedUrl.pathname);
        return app.serveStatic(req, res, path);
      }
      return handler(req, res, parsedUrl);
    });
    server.listen(port);
  });
