const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/pokemon");

const Offer = mongoose.model("Offer", {
  Pokemon_name: String,
  pokemon_description: String,
  pokemon_price: Number,
  Pokemon_details: Array,
  avatar: { type: mongoose.Schema.Types.Mixed, default: {} },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = Offer;
