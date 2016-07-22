var path = require('path');
var express = require('express');
var browserify = require('browserify-middleware');
var bodyParser = require('body-parser');
var history = require('connect-history-api-fallback');

const routes = require('./routes');

const app = express();
const port = process.env.PORT || 4040;

app.use(bodyParser.json());

// Load Routes
routes(app);

app.use(history());
app.use(express.static(path.join(__dirname, "../client/public")));

app.get('/app-bundle.js',
  browserify(path.join(__dirname, '../client/main.js'), {
     transform: [ [ require('babelify'), { presets: ["es2015", "react"] } ] ]
   })
);

app.listen(port, () => {
  console.log("Server is listening on port " + port)
})
