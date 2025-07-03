const { userList, userDelete, adminRegister, loginAdmin, logoutAdmin, userRegistration, userLogin, userLogout, documentUpload, documentVerification, getDocuments, addNominee } = require("../controller/userController");
const { userRegistrationValidation, documentValidation, addNomineeSchema } = require("../helpers/validationUser");
const { upload } = require("../midleware/ImageMidleware");
const { verifyToken } = require("../midleware/jsonWebTokenCreate");
const validate = require("../midleware/validateRequest");

const router = require("express").Router();

router.post("/user/register", validate(userRegistrationValidation), userRegistration);
router.post("/user/login", userLogin);
router.get("/user/list", verifyToken, userList);
router.post('/user/logout', verifyToken, userLogout);
router.post('/user/document_upload', verifyToken, validate(documentValidation), upload, documentUpload);
router.post('/user/document_verification', verifyToken, documentVerification);
router.get('/user/get_document', verifyToken, getDocuments);

// nominee api
router.post('/user/add_nominee', verifyToken, validate(addNomineeSchema), addNominee);



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