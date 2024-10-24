require('dotenv').config();
const port = process.env.PORT || 8080;
const express = require('express');
const db = require( './db/db.js');
const cors = require('cors');
const app = express();
const router = require("./router/index.js");
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json());

const corsOptions = {
    origin: "http://localhost:3000",
    // origin: "https://oboardgame.mogo-r.fr",
    methods: "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS",
    credentials: true,
    preflightContinue: false,
    allowedHeaders: "Content-Type, Authorization, X-Requested-With",
};

app.use(cors(corsOptions));

app.use(router);
db.sync().then(console.log("Connexion OK !!!")).catch(error => console.log(error));

app.listen(port, () => console.log("Run in Port : " + port));