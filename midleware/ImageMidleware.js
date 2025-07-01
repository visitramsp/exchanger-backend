const cloudinary = require("cloudinary").v2;
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
    const file = req?.files?.image;
    if (!file) {
      next();
    } else {
      const result = await cloudinary.uploader.upload(file.tempFilePath);
      fs.unlinkSync(file.tempFilePath);
      req.imageUrl = result.secure_url;
      next();
    }

  } catch (err) {
    return res.status(500).json({
      message: "Image upload failed.",
      status: false,
    });
  }
};




module.exports = { imageUplode, upload };


