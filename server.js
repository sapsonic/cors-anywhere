// Import required modules
var cors_proxy = require('./lib/cors-anywhere');
var parseEnvList = function (env) {
  if (!env) {
    return [];
  }
  return env.split(',');
};

// Configure the server for Vercel
cors_proxy.createServer({
  originBlacklist: parseEnvList(process.env.CORSANYWHERE_BLACKLIST),
  originWhitelist: parseEnvList(process.env.CORSANYWHERE_WHITELIST),
  requireHeader: ['origin', 'x-requested-with'],
  checkRateLimit: require('./lib/rate-limit')(process.env.CORSANYWHERE_RATELIMIT),
  removeHeaders: [
    'cookie',
    'cookie2',
    'x-request-start',
    'x-request-id',
    'via',
    'connect-time',
    'total-route-time',
  ],
  redirectSameOrigin: true,
  httpProxyOptions: {
    xfwd: false, // Prevent adding X-Forwarded-For headers, as Vercel already handles them.
  },
}).listen(3000, '0.0.0.0', function () {
  console.log('Running CORS Anywhere on 0.0.0.0:3000');
});
