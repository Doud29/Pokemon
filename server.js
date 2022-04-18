//on importe les packages//
const express = require("express");
const app = express();
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

//on connecte mongoose

mongoose.connect(process.env.MONGODB_URI);

app.use(formidable(), cors());

require("dotenv").config();

//-----------------------------------------------------------------------//
//---------------------//Importation des routes //-----------------------//
//-----------------------------------------------------------------------//

const dresseurRoutes = require("./routes/dresseur");
app.use(dresseurRoutes);

const OfferRoutes = require("./routes/offers");
app.use(OfferRoutes);

const LoginRoutes = require("./routes/login");
app.use(LoginRoutes);

//-----------------------------------------------------------------------//
//-----------------------// Message d'erreur //--------------------------//
//-----------------------------------------------------------------------//

app.use("*", (req, res) => {
  res.status(400).json({ error: error.message });
});

//on lance le serveur

app.listen(process.env.PORT, () => {
  console.log("Server has started");
});
