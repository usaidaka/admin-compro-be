const express = require("express");
const dotenv = require("dotenv");
const Boom = require("boom");
const cors = require("cors");

const app = express();
const Port = process.env.NODEJS_PORT || 8080;

// Import routes
const Nusamarin = require("./server/api/nusamarin");
const AquaticDirect = require("./server/api/aquatic-direct");
const KratomBusiness = require("./server/api/kratom-business");
const DiasporaFund = require("./server/api/diaspora-fund");
const Admin = require("./server/api/auth");

dotenv.config();
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./server/service/clearCredential");

// Handling Invalid Input
app.use((error, req, res, next) => {
  if (error) {
    console.log(["API Request", "Invalid input", "ERROR"], { info: error });
    res.statusCode = 400;
    // Log Transaction
    const timeDiff = process.hrtime(req.startTime);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);
    const logData = {
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      timeTaken,
    };
    console.log(["API Request", "Invalid input", "info"], logData);
    return res.status(400).json(Boom.badRequest().output.payload);
  }

  next();
});

app.use((req, res, next) => {
  const oldSend = res.send;
  res.send = async (data) => {
    res.send = oldSend; // set function back to avoid the 'double-send'
    const statusCode =
      (data.output && data.output.statusCode) || res.statusCode;
    let bodyResponse = data;

    if (statusCode !== 200 && data.isBoom) {
      bodyResponse = data.output.payload;
    }

    const response = {
      statusCode,
      bodyResponse,
    };

    // Log Transaction
    const timeDiff = process.hrtime(req.startTime);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);
    const logData = {
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      timeTaken,
    };

    console.log(["API Request", "info"], logData);
    return res.status(response.statusCode).send(response.bodyResponse); // just call as normal with data
  };

  next();
});

// Route middlewares
app.use("/api/nusamarin", Nusamarin);
app.use("/api/aquatic-direct", AquaticDirect);
app.use("/api/kratom-business", KratomBusiness);
app.use("/api/diaspora-fund", DiasporaFund);
app.use("/api/admin", Admin);

// Sys ping api
app.get("/sys/ping", (req, res) => {
  req.startTime = process.hrtime();
  res.send("ok");
});

app.listen(Port, () => {
  console.log(["Info"], `Server started on port ${Port}`);
});
