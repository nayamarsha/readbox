const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const port = 3000;
// API Gateway mengarahkan permintaan ke service1
app.use('/serviceBooks', createProxyMiddleware({
 target: 'http://localhost:3001',
 changeOrigin: true,
pathRewrite: { '^/serviceBooks': '' },
}));

// API Gateway mengarahkan permintaan ke service2
app.use('/serviceTrans', createProxyMiddleware({
 target: 'http://localhost:3002',
 changeOrigin: true,
 pathRewrite: {'^/servicetrans': '',},
}));

app.use('/serviceAcc', createProxyMiddleware({
 target: 'http://localhost:3003',
 changeOrigin: true,
 pathRewrite: {'^/serviceAcc': '',},
}));

app.use('/serviceAuth', createProxyMiddleware({
 target: 'http://localhost:3004',
 changeOrigin: true,
 pathRewrite: {'^/serviceAuth': '',},
}));

app.use('/serviceFines', createProxyMiddleware({
 target: 'http://localhost:3009',
 changeOrigin: true,
 pathRewrite: {'^/serviceFines': '',},
}));
app.listen(port, () => {
 console.log(`API Gateway berjalan pada port ${port}`);
});