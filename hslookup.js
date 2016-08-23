var express = require('express');

var app = express();
app.set('view engine', 'ejs');
app.set('port', (process.env.port) || 4568)
app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.render('index');
});

app.listen(app.get('port'), function() {
  console.log("Server started on port" + app.get('port') + ". Listening...");
});
