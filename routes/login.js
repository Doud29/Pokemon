//------------------------------------------------------//
//--------------------// Package //---------------------//
//------------------------------------------------------//

const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

//------------------------------------------------------//
//---------------------// Model //----------------------//
//------------------------------------------------------//

const User = require("../model/User");

//------------------------------------------------------//
//---------------------// Login //----------------------//
//------------------------------------------------------//

router.post("/user/login", async (req, res) => {
  console.log("la route login a été sollicitée");
  try {
    const isAccountExisting = await User.findOne({ email: req.fields.email });
    //onsole.log(isAccountExisting);
    if (isAccountExisting) {
      const hashExisting = isAccountExisting.hash;
      const saltExisting = isAccountExisting.salt;
      const password = req.fields.password;

      const newhash = SHA256(password + saltExisting).toString(encBase64);

      if (hashExisting === newhash) {
        res.json({
          _id: isAccountExisting._id,
          token: isAccountExisting.token,
          account: { username: isAccountExisting.account.username },
        });
      } else {
        res.json("vous n'avez pas renseigné la bonne étape");
      }
    } else {
      res.json("compte inexistant, vous devez vous créer un compte");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//------------------------------------------------------//
//--------------// exportation de la route //-----------//
//------------------------------------------------------//

module.exports = router;
