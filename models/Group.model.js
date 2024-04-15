const { Schema, model } = require("mongoose");

const groupSchema = new Schema(
  {
    name: {
      type: String,
    },
    liderUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    status: {
      type: Boolean,
      default: true,
    },
    date: {
      type: String,
    },
    hour: {
      type: String,
    },
    distance: {
      type: Number,
      default: 0,
    },
    purchase: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    chat: [
      {
        type: Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],
    coordinates: [Number],
  },
  {
    timestamps: true,
  }
);

const Group = model("Group", groupSchema);
module.exports = Group;
