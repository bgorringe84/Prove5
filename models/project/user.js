const mongodb = require('mongodb');
const getDb = require('../../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
   constructor(username, email, cart, id) {
      this.name = username;
      this.email = email;
      this.cart = cart;
      this._id = id;
   }
   save() {
      const db = getDb();
      return db.collection('users').insertOne(this);
   }

   addToCart(car) {
      const cartItemsIndex = this.cart.items.findIndex(ci => {
         return ci.carId.toString() === car._id.toString();
      });
      let newQuantity = 1;
      const updatedCartItems = [...this.cart.items];

      if (cartItemsIndex >= 0) {
         newQuantity = this.cart.items[cartItemsIndex].quantity + 1;
         updatedCartItems[cartItemsIndex].quantity = newQuantity;
      } else {
         updatedCartItems.push( { carId: new ObjectId(car._id), quantity: newQuantity } );
      }
      updatedCartItems
      const updatedCart = {items: updatedCartItems };
      const db = getDb();
      return db
         .collection('users')
         .updateOne(
            { _id: new ObjectId(this._id) },
            { $set: {cart: updatedCart}}
         );
   }


   getCart() {
      const db = getDb();
      const carIds = this.cart.items.map(i => {
        return i.carId;
      });
      return db
        .collection('cars')
        .find({ _id: { $in: carIds } })
        .toArray()
        .then(cars => {
          return cars.map(p => {
            return {
              ...p,
              quantity: this.cart.items.find(i => {
                return i.carId.toString() === p._id.toString();
              }).quantity
            };
          });
        });
    }

    removeItemFromCart(carId) {
      const updatedCartItems = this.cart.items.filter(item => {
         return item.carId.toString() !== carId.toString();
      });
      const db = getDb();
      return db
         .collection('users')
         .updateOne(
            { _id: new ObjectId(this._id)},
            { $set: {cart: {items: updatedCartItems}}}
         );
    }

   //  removeSingleItemFromCart(carQty) {
       
   //  }

   static findById(userId) {
      const db = getDb();
      return db.collection('users')
      .findOne({_id: new ObjectId(userId)})
   }
}

module.exports = User;