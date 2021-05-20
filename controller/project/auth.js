const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const User = require('../../models/project/user');

const transporter = nodemailer.createTransport(sendgridTransport({
   auth: {
      api_key: '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'
   }
}));

exports.getLogin = (req, res, next) => {
   let message = req.flash('error');
   if (message.length > 0) {
      message = message[0];
   } else {
      message = null;
   }
   res.render('pages/project/auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: message
   });
};

exports.getSignup = (req, res, next) => {
   let message = req.flash('error');
   if (message.length > 0) {
      message = message[0];
   } else {
      message = null;
   }
   res.render('pages/project/auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: message
   });
   };

exports.postSignup = (req, res, next) => {
   const name = req.body.name;
   const email = req.body.email;
   const password = req.body.password;
   const confirmPassword = req.body.confirmPassword;
   User.findOne({email: email})
   .then(userDoc => {
      if(userDoc) {
         req.flash('error', 'E-Mail already registered, please retry.');
         return res.redirect('/signup');
      }
      return bcrypt
      .hash(password, 12)
      .then(hashedPassword => {
         const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            car: { items: [] }
         });
         user.save();
      })
      .then(result => {
         res.redirect('/login')
         // return transporter.sendMail({
         //    to: email,
         //    from: 'bgorringe84@gmail.com',
         //    subject: 'E-Commerce-Project Registration',
         //    html: '<h1>Thank you for registering with the E-Commerce-Project! </h1>'
         // });
         
      })
      .catch(err => console.log(err));
   })
   .catch(err => console.log(err));
};

exports.postLogin = (req, res, next) => {
   const email = req.body.email;
   const password = req.body.password;
   User.findOne({ email: email })
   .then( user => {
      if (!user) {
         req.flash('error', 'Invalid email or password.');
         return res.redirect('/login');
      }
      bcrypt.compare(password, user.password).then( doMatch => {
         if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
               console.log(err);
               res.redirect('/project');
            });
         }
         req.flash('error', 'Invalid password.');
         res.redirect('/login');
      })
      .catch(err => {
         console.log(err);
         res.redirect('/login');
       });
   })
   .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
   req.session.destroy(err => {
      console.log(err);
      res.redirect('/project');
   });
};



