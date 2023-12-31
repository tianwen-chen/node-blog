require('dotenv').config();
const express = require('express');
const { create, result } = require('lodash');
const { default: mongoose } = require('mongoose');
const morgan = require('morgan');
const Blog = require('./models/blogs');
const { urlencoded } = require('body-parser');
const blogRoutes = require('./routes/blogRoutes');

// express app
const app = express();

// connect mongoDB & listen for requests
const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then( (result) => app.listen(3000))
    .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

// routes
app.get('/', (req, res) => {
    res.redirect('/blogs');
});

app.get('/about', (req, res) => {
    res.render('about', {title : 'About'});
});

// blog routes
app.use('/blogs', blogRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render('404', {title: '404'});
});