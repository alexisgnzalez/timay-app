<<<<<<< HEAD
//Install express server
=======
>>>>>>> develop
const express = require('express');
const path = require('path');

const app = express();

<<<<<<< HEAD
// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/timay-app'));

app.get('/*', function(req,res) {
res.sendFile(path.join(__dirname+'/dist/timay-app/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
=======
app.use(express.static(__dirname + '/dist'));
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.listen(process.env.PORT || 4200);
>>>>>>> develop
