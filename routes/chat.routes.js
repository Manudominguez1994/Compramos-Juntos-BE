const router = require("express").Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const Chat = require("../models/Chat.model");
const Group = require("../models/Group.model");

//POST Crea un mensaje nuevo del chat
/* This code snippet defines a POST route in an Express router that creates a new message in a chat
associated with a specific group. Here's a breakdown of what the code is doing: */
router.post("/create/:groupId", isAuthenticated, async (req, res, next) => {
  const { description } = req.body;
  const groupId = req.params.groupId;
  const userId = req.payload._id;
  try {
    const newmessage = await Chat.create({
      userOwner: userId,
      groupId: groupId,
      description: description,
    });
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { $push: { chat: newmessage } },
      { new: true }
    );
    if (!updatedGroup) {
      // Manejar el caso en que no se encuentra el grupo
      return res.status(404).json({ error: "Group not found" });
    }
    res.json(newmessage, updatedGroup, "mensaje creado");
  } catch (error) {
    next(error);
  }
});
//GET Entrega todos los mensaje del chat
router.get("/allChats", isAuthenticated, async (req, res, next) => {
  try {
    const allChats = await Chat.find()
      .populate("userOwner")
      .populate("groupId");
    res.json(allChats);
  } catch (error) {
    next(error);
  }
});
//DELETE borrar mensajes del chat ¿?

module.exports = router;
