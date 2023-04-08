const mongoose = require('mongoose');
const  Product = require('./product');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart : {
        items : [
            {
                productId: {type: Schema.Types.ObjectId ,ref:'Product', required: true},
                quantity: {type : Number , required : true}
            }
        ]
    }
});

userSchema.methods.addToCart = function(product) {
    // Check whether current product exits in cart or not
        const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
      })
     
      let newQuantity = 1;
      const updatedCartItems = [...this.cart.items];

      if(cartProductIndex >=0){
        newQuantity = this.cart.items[cartProductIndex].quantity+1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
      } else {
        updatedCartItems.push({
          productId: product._id,
          quantity: newQuantity
        });
      }

      const updatedCart = {items: updatedCartItems};
      this.cart = updatedCart;
      return this.save();
}


userSchema.methods.removeItemFromCart = function(prodId){
    const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== prodId.toString();
        })
    this.cart.items = updatedCartItems;
    return this.save();    
}

userSchema.methods.addOrder = function(){
    const products = this.cart.items;
    const order = {
        items : products,
        user: {
        _id: this._id,
        name : this.name
        }
    };

}

userSchema.methods.clearCart = function(){
    this.cart.items = [];
    return this.save();
}

module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// const ObjectId = mongodb.ObjectId;

// class User{
//   constructor(username,email,cart,id){
//     this.name = username;
//     this.email = email;
//     this.cart = cart; // {items : []}
//     this._id = id;
//   }

//   save(){
//     const db = getDb();
//     return db.collection('users')
//     .insertOne(this)
//     .then(result => {
//       //console.log('Result is : ',result);
//     })
//     .catch(err => {
//       console.log(err);
//     });
//   }

//   addToCart(product){

//   }

//   getCart(){
//     const db = getDb();
//     
//     return db
//     .collection('products')
//     .
//   }

//   deleteCartProduct(prodId){
//     const updatedCartItems = this.cart.items.filter(item => {
//       return item.productId.toString() !== prodId.toString();
//     })
//     const db = getDb();
//     return db
//      .collection('users')
//      .updateOne(
//        {_id: new ObjectId(this._id) },
//        { $set : {cart: {items: updatedCartItems}} }
//      );
//   }

//   addOrder(){
//     const db = getDb();
//    return this.getCart()
//       .then(products => {
//         const order = {
//           items : products,
//           user: {
//             _id: new ObjectId(this._id),
//             name : this.name
//           }
//         };
//         return db.collection('orders')
//           .insertOne(order)
//       })
//     .then(result => {
//       this.cart = {items: [] };
//       return db.collection('users')
//       .updateOne(
//         {_id: new ObjectId(this._id) },
//         { $set : {cart: {items: [] }} }
//       )
//     })
//   }

//   getOrders(){
//      const db = getDb();
//      return db
//      .collection('orders')
//      .find({'user._id': new ObjectId(this._id)})
//      .toArray()
//   }

//   static findById(userId){
//    const  db = getDb();
//     return db.collection('users')
//     .findOne({_id : new ObjectId(userId)})
//     .then(user => {
//       //console.log('User is : ',user);
//       return user;
//     })
//     .catch(err => {
//       console.log(err);
//     });
//   }
// }

// module.exports = User;
