const { Schema, model } = require("mongoose");


const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    name:{
      type: String,
      required: true,
    },
    imagen:{
      type: String,
      default: "https://res.cloudinary.com/dgfqxvzld/image/upload/v1713186447/my-app/m4dtqo2r22dmmgpsppuh.png"
    },
    dateborn: {
      type: Date
    },
    ratio: {
      type: Number,
      default: 1,
      max: 5,
      min: 1
    },
    coordinates: [Number]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
