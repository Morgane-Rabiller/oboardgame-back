require('dotenv').config();
const port = process.env.PORT;
const express = require('express');
const cors = require('cors');
const app = express();
const router = require("./router/index.js");

app.use(express.json());

const corsOptions = {
    origin: "*",
    methods: "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS",
    credentials: false,
    preflightContinue: false,
    allowedHeaders: "Content-Type, Authorization, X-Requested-With",
};

app.use(cors(corsOptions));

app.use(router);

app.listen(port, () => console.log("Run in Port : " + port));