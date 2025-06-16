const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit'); // Add this line
const app = express();
const port = 3000;

// Rate limiter middleware: max 50 requests per 10 minutes per IP
const limiter = rateLimit({
 windowMs: 10 * 60 * 1000, // 10 minutes
 max: 50, // limit each IP to 100 requests per windowMs
 message: { error: 'Too many requests, please try again later.' }
});

// Apply rate limiter to all requests
app.use(limiter);

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
 pathRewrite: {'^/serviceTrans': '',},
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