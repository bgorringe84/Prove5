const mongodb = require('mongodb');
const getDb = require('../../util/database').getDb;


class Car {
   // constructor(id, name, number, price, description, imgUrl, startDate, endDate, userId){
   //    this.id = id;
   //    this.name = name;
   //    this.number = number;
   //    this.price = price;
   //    this.description = description;
   //    this.imgUrl = imgUrl;
   //    this.startDate = startDate;
   //    this.endDate = endDate;
   //    this.userId = userId;
   // }

   save() {
      const db = getDb();
      db.collection('cars')
         .insertOne(this)
         .then(result => {
            console.log(result);
         })
         .catch(err => {
            console.log(err);
         });
   }
   
   static fetchAll() {
      const db = getDb();
      return db
         .collection('cars')
         .find()
         .toArray()
         .then(cars => {
            console.log(cars);
            return cars;
         })
         .catch(err => {
            console.log(err);
         });
   }

   static findById(carId) {
      const db = getDb();
      return db
         .collection('cars')
         .find({ _id: new mongodb.ObjectId(carId) })
         .next()
         .then(car => {
            console.log(car);
            return car;
         })
         .catch(err => { console.log(err)
         });
   }

};




module.exports = Car;

// const fs = require('fs');
// const path = require('path');
// const Cart = require('./cart');

// const p = path.join(path.dirname(require.main.filename), 'data/project', 'cars.json');

// const getCarsFromFile = cb => {
//    fs.readFile(p, (err, data) => {
//       if (err) {
//          return cb([]);
//       }
//       cb(JSON.parse(data));
//    });
// };

// module.exports = class Car {
//    constructor(dates, name, number, description, price, imgUrl) {
//       this.dates = dates;
//       this.name = name;
//       this.number = number;
//       this.description = description;
//       this.price = price;
//       this.imgUrl = imgUrl;
//    }
   
//    save() {
//       getCarsFromFile(cars => {
//          cars.push(this);
//          fs.writeFile(p, JSON.stringify(cars), (err) => {
//             console.log(err);
//          });
//       });
//    }

//    static removeByNumber(number) {
//       getCarsFromFile(cars => {
//          const car = cars.find(car => car.number !== number);
//          const updatedCars = cars.filter(car => car.number !== number);
//          fs.writeFile(p, JSON.stringify(updatedCars), err => {
//             if (!err) {
//                Cart.removeCar(number, car.price);
//             }
//          });
//       });
//    }

//    static fetchAll(cb) {
//       getCarsFromFile(cb);
//    }

//    static findByNumber(number, cb) {
//       getCarsFromFile(cars => {
//          const car = cars.find(c => c.number === number);
//          cb(car);
//       });
//    }
// };
