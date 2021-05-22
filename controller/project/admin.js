const Car = require('../../models/project/car');
const User = require('../../models/project/user');

exports.getAddCar = (req, res, next) => {
   let message = req.flash('error');
   if (message.length > 0) {
      message = message[0];
   } else {
      message = null;
   }
   res.render('pages/project/admin/add-car', {
      path: '/add-car',
      pageTitle: 'Add Car',
      errorMessage: message
   });
};

exports.postAddCar = (req, res, next) => {
   console.log("name=" + req.body.name);
   const name = req.body.name;
   const startDate = req.body.startDate;
   const endDate = req.body.endDate;
   const number = req.body.number;
   const price = req.body.price;
   const imgUrl = req.body.imgUrl;
   const description = req.body.description;
   const car = new Car ({
      dates: { dates: [startDate, endDate] },
      name: name,
      number: number,
      price: price,
      description: description,
      imgUrl: imgUrl,
      userId: req.user
   });
   console.log(car);
   car
   .save()
   .then(result => {
      res.redirect('/project');
   })
   .catch(err => {
      console.log(err);
   });
};

exports.getEditCar = (req, res, next) => {
   let message = req.flash('error');
   if (message.length > 0) {
      message = message[0];
   } else {
      message = null;
   }
   res.render('pages/project/admin/edit-car', {
      path: '/edit-car',
      pageTitle: 'Edit Car',
      errorMessage: message
   });
};