const Car = require('../../models/project/car');
const Cart = require('../../models/project/cart');

exports.getCars = (req, res, next) => {
   Car.fetchAll()
   .then(cars => {
      res.render('pages/project/showRoom', {
         cars: cars,
         pageTitle: 'ShowRoom',
         path: '/project'
      })
   .catch(err => {
      console.log(err);
      })
   });
};

exports.getDetail = (req, res, next) => {
   const carId = req.params.carId;
   Car.findById(carId)
      .then( car => {
         res.render('pages/project/car-detail', {
            car: car,
            pageTitle: 'cool',
            path:'/cars'
         });
      })
      .catch(err => {
         console.log(err)});
};


exports.getCart = (req, res, next) => {
   req.user
      .getCart()
      .then(cars => {
         res.render('pages/project/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            cars: cars
         });
      })
      .catch(err => { console.log(err) });
   };



exports.postCart = (req, res, next) => {
   const carId = req.body.carId;
   Car.findById(carId)
      .then( car => {
        return req.user.addToCart(car);
         
   })
   .then(result => {
      console.log(result);
      res.redirect('/cart');
   });
};

exports.postCartRemoveCar = (req, res, next) => {
   const carId = req.body.carId;
   req.user
      .removeItemFromCart(carId)
      .then(result => {
         res.redirect('/cart');
      })
      .catch(err => console.log(err));
};

// exports.postDecreaseQuantity = (req, res, next) => {
//    const carQty = req.body.carQuantity;
//          req.user
//          .removeSingleItemFromCart(carQty)
//          .then(result => {
//             res.redirect('/cart');
//          })
//          .catch(err => console.log(err));
//    };




// exports.postCartRemoveCar = (req, res, next) => {
//    const carNumber = req.body.carNumber;
//    Car.findByNumber(carNumber, car => {
//       Cart.removeCar(carNumber, car.price);
//       res.redirect('/cart');
//    });
// };

// exports.postRemoveCar = (req, res, next) => {
//    const carNumber = req.body.carNumber;
//    Car.removeByNumber(carNumber);
//    res.redirect('/cart')
// };