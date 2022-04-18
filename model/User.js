//-----------------------------------------------------------------------//
//------------------//MODEL pour la base de données//--------------------//
//-----------------------------------------------------------------------//

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/pokemon");

const User = mongoose.model("User", {
  email: {
    unique: true,
    type: String,
  },
  account: {
    username: {
      required: true,
      type: String,
    },
    // nous verrons plus tard comment uploader une image
    gender: {
      required: true,
      type: String,
    },
    age: {
      required: true,
      type: String,
    },
    tactic: {
      required: true,
      type: String,
    },
  },
  avatar: Object,
  newsletter: Boolean,
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;
