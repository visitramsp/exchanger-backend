const { paymetnCheckout, paymentVerification } = require("../controller/PaymentGetwayController");

const router = require("express").Router();

router.post("/payment/checkout", paymetnCheckout);
router.post("/payment/verification", paymentVerification);

module.exports = router;


