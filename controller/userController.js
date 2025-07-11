
const { sendEmailOTP } = require("../helpers/sendEmailOtp");
const { jsonWebTokenCreate } = require("../midleware/jsonWebTokenCreate");
const bcrypt = require("bcryptjs");
require('dotenv').config();
const { uerRegistrationModel } = require("../Model/UserSchema");
const { documentModel } = require("../Model/DocumentSchema");
const nomineeModel = require("../Model/nomineeSchema");
const { adminRegisters } = require("../model/AdminRegisterSchema");

const userRegistration = async (req, res) => {
  const {
    name,
    email,
    mobile_no,
    state,
    distric,
    city,
    current_location,
    pincode,
    user_type
  } = req.body;

  try {
    const existingUser = await uerRegistrationModel.findOne({ email });
    if (existingUser) {
      return res.status(200).json({
        message: "Email already exists",
        status: true,
        status_code: 200
      });
    }
    const existingMobileNumberUser = await uerRegistrationModel.findOne({ mobile_no });
    if (existingMobileNumberUser) {
      return res.status(200).json({
        message: "Mobile number already exists",
        status: true,
        status_code: 200
      });
    }

    let finalUserType = "user";
    if (user_type && ["admin", "user"].includes(user_type)) {
      finalUserType = user_type;
    }
    const last4Digits = mobile_no.slice(-4);
    const password = `${name}${last4Digits}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const params = { name, email, password }
    const newUser = new uerRegistrationModel({
      name,
      email,
      mobile_no,
      state,
      distric,
      city,
      current_location,
      pincode,
      user_type: finalUserType,
      password: hashedPassword
    });
    console.log(newUser, "newUser");
    await sendEmailOTP(params);
    await newUser.save();
    return res.status(201).json({
      status_code: 201,
      status: true,
      message: "User registered successfully"
    });

  } catch (err) {
    return res.status(500).json({
      status_code: 500,
      status: false,
      message: err.message
    });
  }
}

const userLogin = async (req, res) => {
  const { email, password, user_type } = req.body;
  try {
    if (!email || !password || !user_type) {
      return res.status(400).json({
        status_code: 400,
        status: false,
        message: `All fields are required: ${!email ? "email, " : ""}${!password ? "password, " : ""}${!user_type ? "user_type, " : ""}`,
      });
    }
    const userFindData = await uerRegistrationModel.findOne({ email });
    if (userFindData.user_type !== 'user' && user_type !== 'user') {
      return res.status(403).json({
        status_code: 403,
        status: false,
        message: "Access denied. Only user can login.",
      });
    }
    if (user_type !== 'user') {
      return res.status(403).json({
        status_code: 403,
        status: false,
        message: "Access denied. Only user can login.",
      });
    }

    const isMatch = await bcrypt.compare(password, userFindData.password);
    if (!isMatch) {
      return res.status(401).json({
        status_code: 401,
        status: false,
        message: "Invalid credentials"
      });
    }
    console.log(userFindData, "userFindData");

    const token = jsonWebTokenCreate(userFindData);
    userFindData.is_login = true;
    await userFindData.save();
    return res.status(200).json({
      status_code: 200,
      status: true,
      message: "Login successful",
      data: { token, data: userFindData },
    });

  } catch (err) {
    return res.status(500).json({
      status_code: 500,
      status: false,
      message: err.message
    });
  }
};
const userLogout = async (req, res) => {
  try {
    const email = req.user.email;
    const userFindData = await uerRegistrationModel.findOne({ email });
    if (!userFindData.is_login) {
      return res.status(200).json({ status_code: 200, status: false, message: "User already logout!" });
    }
    if (!userFindData) {
      return res.status(500).json({ status_code: 500, status: false, message: "users not found" });
    }
    userFindData.is_login = false;
    await userFindData.save();
    return res.status(200).json({
      status_code: 200,
      status: true,
      message: "Logout successful",
    });

  } catch (err) {
    return res.status(500).json({ status_code: 500, status: false, message: "Server error" });
  }
};

const userList = async (req, res, next) => {
  try {
    if (!req.user._id) {
      return res.status(500).json({
        data: usersList,
        message: `user email ${req.user.email} not found`,
        status_code: 500,
      });
    }
    const usersList = await uerRegistrationModel.find({ _id: req.user._id })
    return res.status(200).json({
      data: usersList?.[0],
      message: "user fetched successfully.",
      status_code: 200,
    });
  } catch (err) {
    return res.status(500).json({
      status_code: 500,
      status: false,
      message: err.message,
    });
  }
};

const documentUpload = async (req, res) => {

  try {
    const { document_type } = req.body;
    console.log(document_type, "document_type, pan_card");
    if (!document_type) {
      return res.status(400).json({
        status_code: 400,
        status: false,
        message: "All fields are required",
      });
    }
    const existingDocument = await documentModel.findOne({ document_type });
    if (existingDocument) {
      return res.status(200).json({
        status_code: 200,
        status: false,
        message: "Document already exists",
      });
    }
    const userId = req.user._id;
    const newDocument = new documentModel({
      document_type,
      pan_card: req.imageUrl,
      users: userId
    });
    await newDocument.save();
    return res.status(201).json({
      status_code: 201,
      status: true,
      message: "Document uploaded successfully",
    });
  } catch (err) {
    return res.status(500).json({
      status_code: 500,
      status: false,
      message: err.message,
    });
  }
}

const documentVerification = async (req, res) => {
  try {
    const { id } = req.body


    if (!id) {
      return res.status(400).json({
        status_code: 400,
        status: false,
        message: "Document ID is required",
      });
    }
    const document = await documentModel.findById(id);

    if (!document) {
      return res.status(404).json({
        status_code: 404,
        status: false,
        message: "Document not found",
      });
    }
    document.verified = !document.verified;
    await document.save();

    return res.status(201).json({
      status_code: 201,
      status: true,
      message: `Document ${document.verified ? "verified" : "unverified"} successfully`,
    });
  } catch (err) {
    return res.status(500).json({
      status_code: 500,
      status: false,
      message: err.message,
    });
  }
}

const getDocuments = async (req, res) => {
  try {
    const _id = req.user._id;
    let query = {};
    if (_id) {
      query.users = _id;
    }
    const documents = await documentModel.find(query).populate('users');
    return res.status(200).json({
      status_code: 200,
      status: true,
      message: "Documents fetched successfully",
      data: documents,
    });

  } catch (err) {
    return res.status(500).json({
      status_code: 500,
      status: false,
      message: err.message,
    });
  }
};

// Add a new nominee
const addNominee = async (req, res) => {
  try {
    const { fullName, relationship, dob, gender, mobile, email, address, idProofType, idProofNumber } = req.body;
    const existingNominee = await nomineeModel.findOne({ fullName });
    console.log(existingNominee?.email, "req.body=====>");


    if (existingNominee) {
      return res.status(400).json({
        status: false,
        status_code: 400,
        message: "Nominee with this full name already exists"
      });
    }
    if (existingNominee?.email === email) {
      return res.status(400).json({
        status: false,
        status_code: 400,
        message: "Nominee with this email already exists"
      });

    }
    if (existingNominee?.mobile === mobile) {
      return res.status(400).json({
        status: false,
        status_code: 400,
        message: "Nominee with this email already exists"
      });

    }

    const newNominee = new nomineeModel({
      userId: req.user._id,
      fullName,
      relationship,
      dob,
      gender,
      mobile,
      email,
      address,
      idProofType,
      idProofNumber
    });

    await newNominee.save();

    return res.status(201).json({
      status: true,
      status_code: 201,
      message: "Nominee added successfully",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, message: err.message });
  }
};

// Get all nominees for logged-in user
const getNominees = async (req, res) => {
  try {
    const nominees = await nomineeModel.find({ userId: req.user._id });

    return res.status(200).json({
      status: true,
      data: nominees
    });

  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

// Update nominee
const updateNominee = async (req, res) => {
  try {
    const { id } = req.params;

    const nominee = await nomineeModel.findOne({ _id: id, userId: req.user._id });
    if (!nominee) {
      return res.status(404).json({
        status: false,
        message: "Nominee not found"
      });
    }

    Object.assign(nominee, req.body);
    await nominee.save();

    return res.status(200).json({
      status: true,
      message: "Nominee updated successfully",
      data: nominee
    });

  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

// Delete nominee
const deleteNominee = async (req, res) => {
  try {
    const { id } = req.params;

    const nominee = await nomineeModel.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!nominee) {
      return res.status(404).json({
        status: false,
        message: "Nominee not found"
      });
    }

    return res.status(200).json({
      status: true,
      message: "Nominee deleted successfully"
    });

  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

// const userList = async (req, res, next) => {
//   try {

//     console.log(req.user._id, "req.user" );

//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 8;

//     let query = {};
//     if (req.query.search) {
//       const searchRegex = new RegExp(req.query.search, "i");
//       query = {
//         $or: [
//           { name: { $regex: searchRegex } },
//           { email: { $regex: searchRegex } },
//           { state: { $regex: searchRegex } },
//           { city: { $regex: searchRegex } },
//           { distric: { $regex: searchRegex } },
//           { mobile_no: { $regex: searchRegex } },
//         ],
//       };
//     }
//     const usersList = await uerRegistrationModel
//       .find(query)
//       .sort({ _id: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec();
//     if (req.query.search?.length > 0 && usersList?.length === 0) {
//       return res.status(200).json({
//         data: [],
//         message: "Not Found",
//         status_code: 200,
//       });
//     }

//     const totalUsers = await uerRegistrationModel.countDocuments(query);
//     const totalPages = Math.ceil(totalUsers / limit);

//     return res.status(200).json({
//       data: usersList,
//       message: "user fetched successfully.",
//       status_code: 200,
//       totalPages,
//       currentPage: page,
//       count: usersList.length
//     });
//   } catch (err) {
//     return res.status(500).json({
//       status_code: 500,
//       status: false,
//       message: "Internal server error",
//     });
//   }
// };

// const sendMail = async (req, res) => {
//   const email = req.body.email;
//   try {
//     if (!email) {
//       return res.status(200).json({
//         message: `Email is Required`,
//         status_code: 200,
//         status: false,
//       });
//     }
//     const otp = Math.floor(100000 + Math.random() * 90000);
//     const findUser = await uerRegistrationModel.findOne({ email });
//     if (!findUser) {
//       return res.status(400).json({
//         message: `Invalid: your email ID is ${email} `,
//         status_code: 400,
//         status: false,
//       });
//     }
//     const params = { email, otp };
//     await sendEmailOTP(params);
//     await loginUserModel.findOneAndUpdate(
//       { email },
//       { $set: { otp } },
//       { upsert: true, new: true }
//     );

//     return res.status(201).json({
//       message: `${email}  OTP send Successfully`,
//       otp: otp,
//       status_code: 201,
//       status: true,
//     });

//   } catch (err) {
//     return res.status(500).json({
//       message: `Invailid User ${email}`,
//       error: err.message,
//       status_code: 500,
//       status: false,
//     });
//   }
// };

// const vairfyUserOTP = async (req, res) => {
//   try {
//     const email = req.body.email;
//     const otp = req.body.otp;
//     const existsUser = await loginUserModel.findOne({ email });
//     if (!existsUser) {
//       return res.status(200).json({
//         message: `User ${email} not found`,
//         status_code: 404,
//         status: false,
//       });
//     }
//     const token = jsonWebTokenCreate(existsUser);
//     await loginUserModel.updateOne({ _id: existsUser._id }, { $set: { is_login: true } });
//     if (existsUser?.otp === Number(otp) && existsUser.email === email) {
//       return res.status(201).json({
//         message: `User verified successfully`,
//         data: existsUser,
//         status_code: 200,
//         status: true,
//         token: token,
//       });
//     } else {
//       return res.status(404).json({
//         message: `${email} Not verified`,
//         status_code: 404,
//         status: true,
//       });
//     }
//   } catch (err) {
//     res.status(500).json({
//       message: `Invalid User ${req.body.email}`,
//       error: err.message,
//       status_code: 500,
//       status: false,
//     });
//   }
// };

const userDelete = async (req, res) => {
  try {
    const _id = req.params;
    const user = await userModel.findByIdAndDelete(_id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status_code: 404,
        status: false,
      });
    }

    return res.status(200).json({
      message: "User deleted successfully",
      data: user,
      status_code: 200,
      status: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      status_code: 500,
      status: false,
    });
  }
};

// admin api start

const adminRegister = async (req, res) => {
  const { name, email, password, mobile, user_type } = req.body;

  try {
    // Manual validation
    if (!name || !email || !password || !mobile || !user_type) {
      return res.status(400).json({
        message: `All fields are required: ${!name ? "name, " : ""}${!email ? "email, " : ""}${!password ? "password, " : ""}${!mobile ? "mobile, " : ""}${!user_type ? "user_type, " : ""}`,
        status_code: 400,
        status: false,
      });
    }

    // Optional extra check before hitting DB
    if (user_type !== 'admin') {
      return res.status(400).json({
        message: 'Invalid user type. Only admin is allowed.',
        status_code: 400,
        status: false,
      });
    }

    const existingAdmin = await adminRegisters.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists", status: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new adminRegisters({
      name,
      email,
      mobile,
      password: hashedPassword,
      user_type,
    });

    await newAdmin.save();

    res.status(201).json({
      code: 201,
      status: true,
      message: "Admin registered successfully",
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      status: false,
      message: err.message,
    });
  }
};

const loginAdmin = async (req, res) => {
  const { email, password, user_type } = req.body;

  try {
    if (!email || !password || !user_type) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: `All fields are required: ${!email ? "email, " : ""}${!password ? "password, " : ""}${!user_type ? "user_type, " : ""}`,
      });
    }

    const admin = await adminRegisters.findOne({ email });

    if (admin.user_type !== 'admin' && user_type !== 'admin') {
      return res.status(403).json({
        code: 403,
        status: false,
        message: "Access denied. Only admin can login.",
      });
    }

    // Check if user_type matches
    if (user_type !== 'admin') {
      return res.status(403).json({
        code: 403,
        status: false,
        message: "Access denied. Only admin can login.",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        code: 401,
        status: false,
        message: "Invalid credentials"
      });
    }
    console.log(admin, "admin");

    const token = jsonWebTokenCreate(admin);
    admin.isLogin = true;
    await admin.save();
    res.status(200).json({
      code: 200,
      status: true,
      message: "Login successful",
      data: { token, data: admin },
    });

  } catch (err) {
    res.status(500).json({
      code: 500,
      status: false,
      message: "Server error"
    });
  }
};

const logoutAdmin = async (req, res) => {
  try {
    const email = req.user.email;
    console.log(email, "email");
    const admin = await adminRegisters.findOne({ email });
    if (!admin) {
      return res.status(404).json({ code: 404, status: false, message: "Admin not found" });
    }
    admin.isLogin = false;
    await admin.save();
    res.status(200).json({
      code: 200,
      status: true,
      message: "Logout successful",
    });

  } catch (err) {
    res.status(500).json({ code: 500, status: false, message: "Server error" });
  }
};


// admin api end

module.exports = {
  userRegistration,
  userLogin,
  // sendMail,
  userList,
  userLogout,
  // vairfyUserOTP,
  userDelete,
  adminRegister,
  loginAdmin,
  logoutAdmin,
  documentUpload,
  documentVerification,
  getDocuments,
  addNominee,
  getNominees,
  updateNominee,
  deleteNominee
};
