const nodemailer = require("nodemailer");
let transporter1 = nodemailer.createTransport({
  service: "gmail",
  port:465,
  secure:true,
  logger:true,
  debug:true,
  secureConnection: false,
  auth: {
    user: "ramsakalpatel253@gmail.com",
    pass: "lqeawyjuxfpspqrz",
  },
  tls:{
    rejectUnauthorized:false
  }
});

const sendEmailOTP = async (params) => {
  try {
    const mailOptions = {
      from: "ramsakalpatel253@gmail.com",
      to: params.email,
      subject: "Password send successfully",
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password</title>
          <style>
              body {
                  font-family: 'Arial', sans-serif;
                  background: url('https://example.com/your-background-image.jpg') center/cover no-repeat;
                  margin: 0;
                  padding: 0;
                  height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
              }
              .container {
                  max-width: 600px;
                  background-color: rgba(255, 255, 255, 0.9);
                  padding: 20px;
                  border-radius: 10px;
                  box-shadow: 0 0 20px rgba(0,0,0,0.1);
              }
              h2 {
                  color: #007BFF;
              }
              p {
                  color: #555;
                  line-height: 1.6;
                  margin-bottom: 15px;
              }
              a {
                  display: inline-block;
                  padding: 12px 24px;
                  margin-top: 20px;
                  text-decoration: none;
                  color: #ffffff;
                  background-color: #007BFF;
                  border-radius: 5px;
                  transition: background-color 0.3s ease;
              }
              a:hover {
                  background-color: #0056b3;
              }
              .nn{
                color: #FFFFFF;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h2>GET Password</h2>
              <p>Dear ${params.name} User,</p>
               <p>It seems that you've send password, but don't worry, we've got you covered!</p>
               <p>password is : ${params.password}</p>

          </div>
      </body>
      </html>
      `,
    };
    try {
      await transporter1.sendMail(mailOptions);
    } catch (err) {
      console.log(err, "error occur");
    }
    return;
  } catch (error) {
    console.log(error);
    return res.json({
      status: "Failed",
      message: error.message,
    });
  }
};

module.exports = { sendEmailOTP };
