const { createProxyMiddleware } = require('http-proxy-middleware');

const default_backend_url = "http://localhost:8080";



module.exports = function (app) {
    app.use(
        '/backend',
        createProxyMiddleware({
            target: process.env && process.env.REACT_APP_WEB_BACKEND
                ? process.env.REACT_APP_WEB_BACKEND + "/"
                : default_backend_url + "/",
            changeOrigin: true,
            pathRewrite: {
                '^/backend': ''
            }
        })
    );
};