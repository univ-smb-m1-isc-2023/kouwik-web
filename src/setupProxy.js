const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy pour les endpoints API standards
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  );

  // Proxy pour le WebSocket
  app.use(
    '/ws',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      ws: true, // Activation du support WebSocket
      changeOrigin: true,
    })
  );
  app.use(
    '/trigger-websocket',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      ws: true, // Activation du support WebSocket
      changeOrigin: true,
    })
  );
};
