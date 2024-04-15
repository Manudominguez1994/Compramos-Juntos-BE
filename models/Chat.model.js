const { Schema, model } = require("mongoose");

const chatSchema = new Schema(
  {
    userOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    groupId: 
      {
        type: Schema.Types.ObjectId,
        ref: "Group",
      },
    description: {type: String},
  },
  {
    timestamps: true,
  }
);

const Chat = model("Chat", chatSchema);
module.exports = Chat;
