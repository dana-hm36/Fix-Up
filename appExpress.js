const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const base64Img = require('base64-img');
const bodyParser = require('body-parser');
const multer = require('multer');
const { result } = require('lodash');
const route = require('./routes/ticketRouter');
// const session = require('express-session');


// express app
const app = express();

// connect to mongodb & listen for requests cluster
//const dbURI = 'mongodb+srv://netninga:test1234@cluster0.yftpykd.mongodb.net/cluster0?retryWrites=true&w=majority';
// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(result => app.listen(3000))
//   .catch(err => console.log(err));
// connect localy

// const uri = 'mongodb://localhost:27017/?authSource=project_node_junior'|| process.env.DATABASE_URI;
const uri = 'mongodb://127.0.0.1:27017/project_node_junior'|| process.env.DATABASE_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('error', (error)=> console.error('MongoDB connection error:', error.DATABASE_URI));
db.once('open', ()=> {
    console.log('MongoDB connected!');
    //////////////////////////// Starting Server /////////////////////////////
    app.listen(3000 || process.env.PORT, ()=> {
        console.log("Server started!");
    });
});



// middleware & static files
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.json())
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});



// app.use(session(0)
// blog routes
app.use(routes);
app.use(route);



