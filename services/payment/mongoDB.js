const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const userScheme = new Schema({
  transactionId: String,
  payment: String
}, {
  versionKey: false,
});
const Payment = mongoose.model("Payment", userScheme);


module.exports = Payment