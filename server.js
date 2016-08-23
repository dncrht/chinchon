ServeMe = require('serve-me');

ServeMe({
  debug: (process.env.NODE_ENV !== 'production'),
  directory: "./www"
}).start(
  process.env.PORT || 3000
);
