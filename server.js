ServeMe = require('serve-me');
 
ServeMe({
  directory: "./www"
}).start(
  process.env.PORT || 3000
);

