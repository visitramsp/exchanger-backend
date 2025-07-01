const mongoose = require("mongoose");

const razorePaySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    amount: {
      type: Number,
      required: false,
    },
    order_id: {
      type: String,
    },
    razorpay_payment_id: {
      type: String,
      default: null,
    },
    razorpay_order_id: {
      type: String,
      default: null,
    },
    razorpay_signature: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const razorePayModel = mongoose.model("paymentGetway", razorePaySchema);

module.exports = razorePayModel;
