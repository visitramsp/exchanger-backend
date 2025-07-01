const express = require("express");
const cors = require("cors");
const dbConnection = require("./db");
const userRoute=require("./Routes/userRoute")
// const paymentGetway=require("./Routes/PaymentGetwayRoute")
const port = process.env.PORT || 2000;
const app = express();
const bodyParser = require("body-parser");
const fileUpload=require("express-fileupload");
const { authenticateToken } = require("./helpers/authenticateToken");
require('dotenv').config();

app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload({useTempFiles : true,}))

console.log(authenticateToken,"authenticateToken");

// app.use('/api', authenticateToken);
// app folder router list start

// lqea wyju xfps pqrz
app.get("/",async (req,res)=>{
  res.json({
    message:"server start"
  })
})

// authontication api start
app.use("/api", userRoute);
// admin authontication
// app.use("/api/", userRoute);
// authontication api end

// app.use("/api", paymentGetway);
// app folder router list end

app.use((req, res, next) => {
  res.status(404).send('404 Not Found');
});

app.listen(port, () => {
  console.log("localhost://2000 start ...");
  dbConnection();
  console.log("start");
});
