const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy pour les endpoints API standards
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.kouwik.oups.net/',
      changeOrigin: true,
    })
  );

  // Proxy pour le WebSocket
  app.use(
    '/ws',
    createProxyMiddleware({
      target: 'https://api.kouwik.oups.net/',
      ws: true, // Activation du support WebSocket
      changeOrigin: true,
    })
  );
  app.use(
    '/trigger-websocket',
    createProxyMiddleware({
      target: 'https://api.kouwik.oups.net/',
      ws: true, // Activation du support WebSocket
      changeOrigin: true,
    })
  );
};
