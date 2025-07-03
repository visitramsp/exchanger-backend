const cloudinary = require("cloudinary").v2;
const { log, Console, error } = require("console");
const fs = require("fs");
cloudinary.config({
  cloud_name: "dphvr6oeo",
  api_key: "518249919789397",
  api_secret: "EKRxfouFEz9iq4B5bwmJfKzec40",
});

const imageUplode = async (tempFilePath) => {
  const data = cloudinary.uploader.upload(tempFilePath, (error, result) => {
    if (error) {
      return error;
    } else {
      return result;
    }
  });

  return data;
};

const upload = async (req, res, next) => {
  try {
    const file = req?.files?.pan_card;
    console.log(file, "file in upload middleware");
    if (!file) {
      return res.status(201).json({
        message: "image is required",
        status: false,
        response_code: 500
      })
    } else {
      if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        const result = await cloudinary.uploader.upload(file.tempFilePath);
        fs.unlinkSync(file.tempFilePath);
        req.imageUrl = result.secure_url;
        next();
      } else {
        return res.status(200).json({
          message: "file type should be png, jpg, jpeg is required",
          status: false,
          response_code: 200
        });
      }

    }

  } catch (err) {
    return res.status(500).json({
      message: "Image upload failed.",
      status: false,
      error: err.message,
      response_code: 500
    });
  }
};

// const upload = async (req, res, next) => {
//   try {
//     const files = req?.files;

//     if (!files || Object.keys(files).length === 0) {
//       return res.status(400).json({
//         message: "No file uploaded",
//         status: false,
//       });
//     }

    
    
//     const fileKey = Object.keys(files)[0];
//     console.log(fileKey,"fileKey========>");
//     const file = files[fileKey];

//     console.log(file, "file in upload middleware");

//     if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
//       const result = await cloudinary.uploader.upload(file.tempFilePath);
//       fs.unlinkSync(file.tempFilePath);
//       req.imageUrl = result.secure_url;
//       next();
//     } else {
//       return res.status(400).json({
//         message: "File type must be PNG, JPG, or JPEG",
//         status: false,
//       });
//     }

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       message: "Image upload failed.",
//       error: err.message,
//       status: false,
//     });
//   }
// };




module.exports = { imageUplode, upload };


