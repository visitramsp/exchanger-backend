const Razorpay = require("razorpay");
const razorePayModel = require("../Model/RazorePaySchema");
const crypto = require("crypto");
var razorpay = new Razorpay({
  key_id: "rzp_test_FWyGehPvS74iAh",
  key_secret: "9IcZR0fA1LwRi2LNF3QT57vd",
});

const paymetnCheckout = async (req, res) => {
  try {
    const { name, amount } = req.body;
    console.log(name, amount, "name");
    const orders = await razorpay.orders.create({
      amount: Number(amount * 100),
      currency: "INR",
    });

    await razorePayModel.create({
      order_id: orders.id,
      name: name,
      amount: amount,
    });

    console.log(orders);
    res.json({ orders });
  } catch (err) {
    console.log("Error", err);
  }
};

const paymentVerification = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;
    const generated_signature = razorpay_order_id + "|" + razorpay_payment_id;

    const expect = crypto
      .createHmac("sha256", "9IcZR0fA1LwRi2LNF3QT57vd")
      .update(generated_signature)
      .digest("hex");
    const idValidated = expect === razorpay_signature;
    if (idValidated) {
      await razorePayModel.findOneAndUpdate(
        { order_id: razorpay_order_id },
        {
            $set: {
                razorpay_payment_id: razorpay_payment_id,
                razorpay_order_id: razorpay_order_id,
                razorpay_signature: razorpay_signature
            }
        },
        { new: true } // optional, returns the updated document
    );
      res.redirect(
        `http://localhost:3000/cart?payment_id=${razorpay_payment_id}`
      );
      return;
    } else {
      res.redirect("http://localhost:3000/failed");
      return;
    }
  } catch (err) {
    console.log("Error", err);
  }
};

module.exports = { paymetnCheckout, paymentVerification };
