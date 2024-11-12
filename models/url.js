const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortID: {
      type: String,
      required: true,
      // unique: true,
    },
    redirectURL: {
      type: String,
      required: true
    },
    visitHistory: {
      type: [
        {
          timeStamp: {
            type: Number, // Use Date if preferred instead of Number
          },
        },
      ],
      default: [], // Default value to ensure an empty array for visit history
    },
    createdBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    }
  },
  { timestamps: true }
);

const Url = mongoose.model("Url", urlSchema);

module.exports = Url;
