const Sentry = require('@sentry/node');
const pkg = require('../package.json');

// Fastify Sentry hook
Sentry.init({
    dsn: process.env.SENTRY_DNS,
    environment: process.env.NODE_ENV,
    release: `lifesten@${pkg.version}`
})


function SentryErrorLogging(error){
    if (process.env.NODE_ENV !== 'development') {
        Sentry.captureException(error);
    }
}

module.exports = { SentryErrorLogging };