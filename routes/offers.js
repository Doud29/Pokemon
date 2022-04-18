//------------------------------------------------------//
//--------------------// Package //---------------------//
//------------------------------------------------------//

const express = require("express");
const router = express.Router();

//------------------------------------------------------//
//---------------------// Model //----------------------//
//------------------------------------------------------//
const User = require("../model/User");
const Offers = require("../model/Offers");

//------------------------------------------------------//
//---------------------// Token //----------------------//
//------------------------------------------------------//

const isAuthenticated = async (req, res, next) => {
  //on vérifier qu'un Token est présent dans la demande du client
  if (req.headers.authorization) {
    //on vient récupérer la valeur de notre token
    const token = req.headers.authorization.replace("Bearer ", "");
    //on va chercher dans notre base de données si il il exite un token similaire
    const isTokenValid = await User.findOne({ token });

    //on vient vérifier si il nous trouve dans notre base de données un utilisateur correspondant au token fourni
    if (isTokenValid) {
      //On définie un objet qui récupérera le porfil dans notre base de données
      req.user = isTokenValid;
      return next();
    } else {
      return res.status(401).json({ error: "unauthorized" });
    }
  } else {
    return res.status(401).json({ error: "unauthorized" });
  }
  //const token = req.headers.authorization.replace("Bearer ", "");
};

//------------------------------------------------------//
//---------------------// Offres //---------------------//
//------------------------------------------------------//

router.post("/user/publish", isAuthenticated, async (req, res) => {
  console.log("la route offre a été sollicitée");
  try {
    const {
      Pokemon_name,
      pokemon_description,
      pokemon_price,
      pokemon_details,
      LEVEL,
      COLOR,
    } = req.fields;
    //console.log(req.fields);
    if (
      Pokemon_name &&
      pokemon_description &&
      pokemon_price &&
      pokemon_details &&
      LEVEL &&
      COLOR
    ) {
      if (
        pokemon_price < 1000 &&
        Pokemon_name.length < 50 &&
        pokemon_description.length < 250
      ) {
        let newOffer = new Offers({
          Pokemon_name: Pokemon_name,
          pokemon_description: pokemon_description,
          pokemon_price: pokemon_price,
          Pokemon_details: [{ level: LEVEL }, { color: COLOR }],
          // pokemon_avatar: req.files.pokemon_avatar,
          owner: req.user,
        });

        await newOffer.save();

        res.json({
          id: newOffer._id,
          Pokemon_name: newOffer.Pokemon_name,
          pokemon_description: newOffer.pokemon_description,
          pokemon_price: newOffer.pokemon_price,
          Pokemon_details: newOffer.Pokemon_details,
          owner: req.user.account,
        });
      } else {
        res;
        json(
          "soit titre est trop long [moins de 50 caractères] soit votre description est trop longue [moins de 500 caractères], soit le prix [<100000]"
        );
      }
    } else {
      res.status(400).json("vous devez remplir l'ensemble des champs ");
    }

    //const offer = Offers.new({});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//------------------------------------------------------//
//--------------// exportation de la route //-----------//
//------------------------------------------------------//

module.exports = router;
