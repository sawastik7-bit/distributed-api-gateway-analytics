import { createProxyMiddleware } from 'http-proxy-middleware';

const userServiceProxy = createProxyMiddleware({
  target: 'http://localhost:4001',
  changeOrigin: true,

  pathRewrite: (path) => {
    const newPath = '/users' + path;
    console.log(`[Rewrite] ${path} → ${newPath}`);
    return newPath;
  },

  on: {
    proxyReq: (proxyReq, req, res) => {
if(req.user){
    proxyReq.setHeader('X-User-Id',req.user.id);
    proxyReq.setHeader('X-User-Name',req.user.name);
    proxyReq.setHeader('X-User-Role',req.user.role);
}
proxyReq.setHeader('X-Real-Ip',req.ip);
    },
    error: (err, req, res) => {
      console.error('[Gateway] Service A error:', err.message);
      res.status(503).json({
        success: false,
        message: 'User service is unavailable'
      });
    }
  }
});

const productServiceProxy = createProxyMiddleware({
  target: 'http://localhost:4002',
  changeOrigin: true,

  pathRewrite: (path) => {
    const newPath = '/products' + path;
    console.log(`[Rewrite] ${path} → ${newPath}`);
    return newPath;
  },

  on: {
    proxyReq: (proxyReq, req, res) => {
      if(req.user){
    proxyReq.setHeader('X-User-Id',req.user.id);
    proxyReq.setHeader('X-User-Name',req.user.name);
    proxyReq.setHeader('X-User-Role',req.user.role);
}
proxyReq.setHeader('X-Real-Ip',req.ip);
    },
    error: (err, req, res) => {
      console.error('[Gateway] Service B error:', err.message);
      res.status(503).json({
        success: false,
        message: 'Product service is unavailable'
      });
    }
  }
});

export { userServiceProxy, productServiceProxy };