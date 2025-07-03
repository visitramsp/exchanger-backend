import Joi from "joi";
const phonePattern = /^[6-9]\d{9}$/;
export const userRegister = Joi.object({
  name: Joi.string()
    .min(3)
    .max(25)
    .trim()
    .required()
    .pattern(/^[a-zA-Z\s]+$/)
    .label("Full Name"),
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .label("Email"),
  phone: Joi.string()
    .trim()
    .required()
    .regex(phonePattern)
    .messages({
      "string.pattern.base":
        "Invalid Phone number format. It should be in the format +xx-xxxxxxxxxx",
      "any.required": "Phone number is required",
      "string.empty": "Phone number must not be empty",
    })
    .label("Phone Number"),
  country: Joi.string().trim().required("Selecting Country Code is Required"),
})
export const userRegistrationValidation = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .trim()
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      "string.pattern.base": "Name can only contain letters and spaces",
      "string.empty": "Name is required",
      "any.required": "Name is required"
    }),
  mobile_no: Joi.string()
    .trim()
    .pattern(phonePattern)
    .required()
    .messages({
      "string.pattern.base": "Mobile number must be a valid 10-digit Indian number starting with 6-9",
      "string.empty": "Mobile number is required",
      "any.required": "Mobile number is required"
    })
    .label("Mobile Number"),
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Email must be a valid format",
      "string.empty": "Email is required",
      "any.required": "Email is required"
    })
    .label("Email"),
  state: Joi.string()
    .trim()
    .min(2)
    .required(),
  city: Joi.string()
    .trim()
    .min(2),
  // .label("City"),

  distric: Joi.string()
    .trim()
    .min(2)
    .required(),
  // .label('distric'),
  current_location: Joi.string()
    .trim()
    .min(2)
    .required()
    .label("Current Location"),

  pincode: Joi.string()
    .trim()
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      "string.pattern.base": "Pincode must be exactly 6 digits",
      "string.empty": "Pincode is required",
      "any.required": "Pincode is required"
    })
    .label("Pincode")
});
export const otpVerificationSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Email must be a valid format',
      'any.required': 'Email is required',
      'string.empty': 'Email cannot be empty'
    }),

  otp: Joi.number()
    .integer()
    .required()
    .messages({
      'number.base': 'OTP must be a number',
      'any.required': 'OTP is required',
      'number.empty': 'OTP cannot be empty'
    })
});


export const documentValidation = Joi.object({
  document_type: Joi.string().valid('pan_card', 'aadhaar', 'passport').required(),
})


export const addNomineeSchema = Joi.object({
  fullName: Joi.string().required(),
  relationship: Joi.string().required(),
  dob: Joi.date().required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  mobile: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
  email: Joi.string().email().required(),
  address: Joi.string().required(),
  idProofType: Joi.string().optional(),
  idProofNumber: Joi.string().optional()
});