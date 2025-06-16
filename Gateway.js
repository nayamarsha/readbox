const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit'); 
const app = express();
const port = 3000;

// rate limiter
const limiter = rateLimit({
 windowMs: 10 * 60 * 1000, // 10 minutes
 max: 50, // limit each IP to 100 requests per windowMs
 message: { error: 'Too many requests, please try again later.' }
});

app.use(limiter);

// API Gateway ke serviceBooks
app.use('/serviceBooks', createProxyMiddleware({
 target: 'http://localhost:3001',
 changeOrigin: true,
pathRewrite: { '^/serviceBooks': '' },
}));

// API Gateway ke serviceTrans
app.use('/serviceTrans', createProxyMiddleware({
 target: 'http://localhost:3002',
 changeOrigin: true,
 pathRewrite: {'^/serviceTrans': '',},
}));

// API Gateway ke serviceAcc
app.use('/serviceAcc', createProxyMiddleware({
 target: 'http://localhost:3003',
 changeOrigin: true,
 pathRewrite: {'^/serviceAcc': '',},
}));

// API Gateway ke serviceAuth
app.use('/serviceAuth', createProxyMiddleware({
 target: 'http://localhost:3004',
 changeOrigin: true,
 pathRewrite: {'^/serviceAuth': '',},
}));

// API Gateway ke serviceFines
app.use('/serviceFines', createProxyMiddleware({
 target: 'http://localhost:3009',
 changeOrigin: true,
 pathRewrite: {'^/serviceFines': '',},
}));
app.listen(port, () => {
 console.log(`API Gateway berjalan pada port ${port}`);
});