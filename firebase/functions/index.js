const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const util = require("util");

const app = express();
app.use(cors({ origin: true }));

require("dotenv").config();

// 导出 otherapi
const otherApi = require("./otherapi.js");
exports.sailor_otherapi = functions
  .runWith({
    vpcConnector: "ktx",
    vpcConnectorEgressSettings: "PRIVATE_RANGES_ONLY",
  })
  .region("asia-southeast1")
  .https.onRequest(otherApi);

