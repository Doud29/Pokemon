//------------------------------------------------------//
//--------------------// Package //---------------------//
//------------------------------------------------------//

const express = require("express");
const cloudinary = require("cloudinary").v2;
const formidable = require("express-formidable");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const router = express.Router();

//------------------------------------------------------//
//---------------------// Model //----------------------//
//------------------------------------------------------//

const User = require("../model/User");

//------------------------------------------------------//
//--------------------// Dresseur //--------------------//
//------------------------------------------------------//

cloudinary.config({
  cloud_name: "le-r-acteur",
  api_key: "927477243267287",
  api_secret: "KvTumojz0oud0xPSDAtK2Ev7a_I",
});

router.post("/user/signup", async (req, res) => {
  console.log("la routesignup a bien été sollicitée");
  try {
    //on vient destructurer notre req.fields pour une meilleure visibilité.
    const { email, username, age, gender, tactic, newsletter, password } =
      req.fields;
    //console.log(req.fields);

    const isEmailexisting = await User.findOne({ email: email });

    if (
      email &&
      username &&
      age &&
      gender &&
      tactic &&
      newsletter &&
      req.files.avatar &&
      username &&
      password
    ) {
      if (isEmailexisting) {
        if (email.includes("@")) {
          //on télécharge notre photo
          let pictureToUpload = req.files.avatar.path;
          //console.log(pictureToUpload);
          //on upload la photo sur cloudinary
          const result = await cloudinary.uploader.upload(pictureToUpload, {
            folders: "/Pokemon/Avatar",
            public_name: `${req.fields.username}`,
          });
          //pourquoi je suis obligé de redéclarer mon password en req.fields alors que je l'ai destructurer au début?
          //si je ne le fais pas, j'ai un message d'erreur.
          const password = req.fields.password;
          const salt = uid2(16);
          const hash = SHA256(password + salt).toString(encBase64);
          const token = uid2(16);

          //on créait un nouveau dresseur sur la base du Model user.
          const dresseur = new User({
            email: email,
            account: {
              username: username,
              age: age,
              gender: gender,
              tactic: tactic,
            },
            avatar: result,
            newsletter: newsletter,
            token: token,
            hash: hash,
            salt: salt,
          });
          //console.log(dresseur);
          //on suvegarde le dresseur sur notre base de données
          await dresseur.save();
          //on renvoie cette réponse à notre client
          res.json({
            _id: dresseur._id,
            email: dresseur.email,
            account: dresseur.account,
            avatar: dresseur.avatar.url,
            token: dresseur.token,
          });
        } else {
          res.json("votre mail n'est pas valide et doit inclure un @");
        }
      } else {
        res.json("tous les champs doivennt être rempli");
      }
    } else {
      res.json("ce mail existe déjà");
    }

    // res.json("votre dresseur a bien été enregistré");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//------------------------------------------------------//
//--------------// exportation de la route //-----------//
//------------------------------------------------------//

module.exports = router;
