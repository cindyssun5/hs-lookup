var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var qs = require('querystring');

mongoose.Promise = global.Promise;

mongoose.connect = ('mongodb:http://localhost:27017/data/db');
//mongodb://heroku_smfptfwr:rasceap468scfer0jih4b9h44g@ds013946.mlab.com:13946/heroku_smfptfwr

var app = express();
app.set('view engine', 'ejs');
app.set('port', (process.env.PORT) || 4568);
app.use(bodyParser.json());
app.use(express.static(__dirname));

var Deck = mongoose.model('Deck', {
  name: String,
  deckArray: Array
});

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/saveDeck', function(req, res){
  Deck.findOne({name: req.body.deckName}).exec(function(err,found){
    if(found){
      console.log('found deck name');
      res.send(301, 'error');
    } else {
      console.log('entered server side post');
      var newDeck = new Deck({
       name: req.body.deckName,
       deckArray: req.body.deckArray
     });

      newDeck.save(function(err){
        if(err){
          console.error(err);
          res.status(301).send('Error saving new deck');
        } else {
          res.send({ deckName: name });
        }
      });
    }
  });
});

app.get('/deck/*', function(req, res){
  var deckID = req.path.split('/')[2];
  Deck.findOne({name: deckID}).exec(function(err, found){
    if(found){
      res.send(found);
    } else {
      console.err(err);
      res.status(501).send(err);
    }
  });
});

app.listen(app.get('port'), function() {
  console.log("Server started on port" + app.get('port') + ". Listening...");
});
