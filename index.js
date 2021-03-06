// Our initial setup (package requires, port number setup)
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const PORT = process.env.PORT || 5000 // So we can run on heroku || (OR) localhost:5000
const User = require('./models/project/user');
const MONGODB_URI = 'mongodb+srv://brandon:L6qFXcP6dyQMRf2H@cluster0.waj0f.mongodb.net/myFirstDatabase';


const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

const csrfProtection = csrf();

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Route setup. You can implement more in the future!
const ta01Routes = require('./routes/ta01');
const ta02Routes = require('./routes/ta02');
const ta03Routes = require('./routes/ta03'); 
const ta04Routes = require('./routes/ta04'); 
const projectRoutes = require('./routes/project/showRoom');
const authRoutes = require('./routes/project/auth');
const adminRoutes = require('./routes/project/admin');

app.use(express.urlencoded({extended: false})) // For parsing the body of a POST
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store}));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/ta01', ta01Routes)
   .use('/ta02', ta02Routes) 
   .use('/ta03', ta03Routes) 
   .use('/ta04', ta04Routes)
   .use(projectRoutes)
   .use(authRoutes)
   .use(adminRoutes)
   .get('/', (req, res, next) => {
     // This is the primary index, always handled last. 
     res.render('pages/index', {title: 'Welcome to my CSE341 repo', path: '/'});
    })
   .use((req, res, next) => {
     // 404 page
     res.render('pages/404', {title: '404 - Page Not Found', path: req.url})
   })

mongoose
.connect(MONGODB_URI)
.then(result => {
  app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
})
.catch(err => { console.log(err) });
