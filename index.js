require('dotenv').config();
const port = process.env.PORT;
const express = require( 'express');
const cors = require( 'cors');
const app = express();

const corsOptions = {
    origin: "*",
    methods: "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS",
    credentials: false,
    preflightContinue: false,
    allowedHeaders: "Content-Type, Authorization, X-Requested-With",
};

app.use(cors(corsOptions));

app.listen(port, () => console.log("Run in Port : " + port));