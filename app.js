var express = require('express')
,nunjucks = require('nunjucks')
,cookieSession = require('cookie-session')
, qs = require('querystring')
,moniker = require('moniker');


var app = express();
var posts = [];

// Setup nunjucks templating engine
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.use(express.static('public'));
app.use(cookieSession({
  name: 'session',
  keys: ['key1','key2'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
app.set('port', process.env.PORT || 3000);

// Home page
app.get('/', function(req, res) {
    if(!req.session.id){
        var name = moniker.choose();
        name = name.charAt(0).toUpperCase() + name.slice(1);
        var dex = name.indexOf('-') + 2;
        name = name.slice(0,dex-1) + name.charAt(dex-1).toUpperCase() + name.slice(dex);
        req.session.id = name;
    }
    res.render('index.html', {
        id: req.session.id,
        smaks: posts.reverse()
    });
    posts.reverse();
});

// Other example
app.post('/smak', function(req, res) {
    var body
    req.on('data', function(d) {
    body += d;
    //console.log(d)
    })
    req.on('end', function(d) {

        console.log('game')
        if(body !=''){
            var post = qs.parse(body)
            //console.log("here" + JSON.stringify(post));
            if(post.undefinedsmak){
              console.log("here" + post.undefinedsmak);
              posts.push(JSON.parse(post.undefinedsmak));
              console.log(posts);
            }
        

        }
        res.end();

    }) 
});



// Kick start our server
app.listen(app.get('port'), function() {
    console.log('Server started on port', app.get('port'));
});
