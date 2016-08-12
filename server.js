var express = require('express'),
    http = require('http'),
    path = require('path'),
    fs = require('fs'),
    app = express();

app.use(express.bodyParser());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/config', (req, res, next) => {
  fs.readFile('json/' + req.query.data + '.json', 'utf8', (err, data) => {
    if(err){
      console.error(err);
      return;
    }
    res.send(data);
  });
});

app.get('/data', (req, res, next) => {
  fs.readFile('json/' + req.query.data + '.json', 'utf8', (err, data) => {
    var data = JSON.parse(data);
    if('page' in req.query) {
      res.send(data.splice(req.query.page, 10));
    } else {
      if (err) {
        console.error(err);
        return;
      }
      res.send(data.splice(0, 10));
    }
  });
});

app.use((err, req, res, next) => {
  if (app.get('env') == 'development') {
    var errorHandler = express.errorHandler();
    errorHandler(err, req, res, next);
  } else {
    res.send(500);
  }
});

http.createServer(app).listen(3000, () => {
  console.log('Добро пожаловать localhost:' + 3000);
});
