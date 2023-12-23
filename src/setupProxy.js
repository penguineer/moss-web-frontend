const { createProxyMiddleware } = require('http-proxy-middleware');

const default_backend_url = "http://localhost:8080";



module.exports = function (app) {
    app.use(
        '/backend',
        createProxyMiddleware({
            target: window.ENV && window.ENV.REACT_APP_WEB_BACKEND
                ? window.ENV.REACT_APP_WEB_BACKEND + "/"
                : default_backend_url + "/",
            changeOrigin: true,
            pathRewrite: {
                '^/backend': ''
            }
        })
    );
};