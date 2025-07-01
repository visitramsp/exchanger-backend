const { userList, userDelete, adminRegister, loginAdmin, logoutAdmin, userRegistration, userLogin, userLogout } = require("../controller/userController");
const { userRegistrationValidation } = require("../helpers/validationUser");
const { verifyToken } = require("../midleware/jsonWebTokenCreate");
const validate = require("../midleware/validateRequest");

const router = require("express").Router();

router.post("/user/register",validate(userRegistrationValidation), userRegistration);
router.post("/user/login", userLogin);
router.get("/user/list",verifyToken, userList);
router.post('/user/logout', verifyToken, userLogout);


// router.post("/login", sendMail); 
// router.post("/verify_otp",validate(otpVerificationSchema) , vairfyUserOTP);

router.delete(':_id', userDelete);

// admin authontication  
router.post("/admin/register", adminRegister);
router.post("/admin/login", loginAdmin);
router.post('/admin/logout', verifyToken, logoutAdmin);


module.exports = router;
// 9CF1-DA30

// categorySchema