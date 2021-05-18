const Car = require('../../models/project/car');
const Order = require('../../models/project/order');

exports.getCars = (req, res, next) => {
   Car.find()
   // .populate('userId')
   .then(cars => {
      res.render('pages/project/showRoom', {
         cars: cars,
         pageTitle: 'ShowRoom',
         path: '/project'
      })
   // .catch(err => {
   //    console.log(err);
   //    })
   });
};

exports.getDetail = (req, res, next) => {
   const carId = req.params.carId;
   Car.findById(carId)
      .then( car => {
         res.render('pages/project/car-detail', {
            car: car,
            pageTitle: car.name,
            path:'/cars'
         });
      })
      .catch(err => {
         console.log(err)});
};


exports.getCart = (req, res, next) => {
   req.user
      .populate('cart.items.carId')
      .execPopulate()
      .then(user => {
         const cars = user.cart.items;
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

exports.postOrder = (req, res, next) => {
   req.user
     .populate('cart.items.carId')
     .execPopulate()
     .then(user => {
       const cars = user.cart.items.map(i => {
         return { quantity: i.quantity, car: { ...i.carId._doc } };
       });
       const order = new Order({
         user: {
           name: req.user.name,
           userId: req.user
         },
         cars: cars
       });
       return order.save();
     })
     .then(result => {
       return req.user.clearCart();
     })
     .then(() => {
       res.redirect('/orders');
     })
     .catch(err => console.log(err));
 };
 
 exports.getOrders = (req, res, next) => {
    Order.find({"user.userId": req.user._id})
     .then(orders => {
       res.render('pages/project/orders', {
         path: '/orders',
         pageTitle: 'Your Orders',
         orders: orders
       });
     })
     .catch(err => console.log(err));
 };


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