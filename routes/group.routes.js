const router = require("express").Router();
const Group = require("../models/Group.model");
const Product = require("../models/Product.model")
const isAuthenticated = require("../middlewares/isAuthenticated");

//POST => /group/create
router.post("/create", isAuthenticated, async (req, res, next) => {
  const { name, date, hour, coordinates, products, users } = req.body;
  const liderUser = req.payload._id;
  // Validar campos vacíos
  if (!name || !date || !hour || !coordinates) {
    res
      .status(400)
      .json({ errorMessage: "Todos los campos deben estar rellenos" });
    return;
  }

  try {
    const response = await Group.create({
      liderUser: liderUser,
      name,
      date,
      hour,
      coordinates,
      products,
      users,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
});

//GET => /allgroups Recibir todos los grupos
router.get("/allgroups", isAuthenticated, async (req, res, next) => {
  try {
    const response = await Group.find()
      .populate("liderUser")
      .populate("users")
      .populate("products");
    res.json(response);
  } catch (error) {
    next(error);
  }
});
// Ruta GET para obtener los datos de un grupo específico
router.get("/:groupId", isAuthenticated, async (req, res, next) => {
  const { groupId } = req.params;
  try {
    const group = await Group.findById(groupId)
      .populate("liderUser")
      .populate("users")
      .populate("products");
    if (!group) {
      return res.status(404).json({ message: "Grupo no encontrado" });
    }
    res.json(group);
  } catch (error) {
    next(error);
  }
});
// Ruta PUT para añadir un usuario a un grupo específico
router.put("/:groupId/adduser/:userId", isAuthenticated, async (req, res, next) => {
  const { groupId, userId } = req.params;
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Grupo no encontrado" });
    }
    if (group.users.includes(userId)) {
      return res.status(400).json({ message: "El usuario ya está en este grupo" });
    }
    group.users.push(userId); // Añadir el usuario al array de usuarios del grupo
    await group.save();
    res.json(group);
  } catch (error) {
    next(error);
  }
});
// Ruta PUT añade una compra
router.put("/:groupId/addpurchase/:userId", isAuthenticated, async (req, res, next) => {
 const { groupId, userId } = req.params;
const { productId, quantity } = req.body; 

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Grupo no encontrado" });
    }
    const purchase = { userId, productId, quantity };
    group.purchase.push(purchase);
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    product.cantidad -= quantity;
    await product.save();
    await group.save();
    res.json(group);
  } catch (error) {
    next(error);
  }
});
// Ruta PUT cerrar grupo
router.put("/:groupId/close", isAuthenticated, async (req, res, next) => {
  const { groupId } = req.params;
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Grupo no encontrado" });
    }
    group.status = false;
    await group.save();
    res.json(group);
  } catch (error) {
    next(error);
  }
});
// Ruta PUT abrir grupo
router.put("/:groupId/open", isAuthenticated, async (req, res, next) => {
  const { groupId } = req.params;
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Grupo no encontrado" });
    }
    group.status = true;
    await group.save();
    res.json(group);
  } catch (error) {
    next(error);
  }
});
// PUT => Editar grupo
router.put("/edit/:groupId", isAuthenticated, async (req, res, next) => {
  const { groupId } = req.params;
  const { nombre, fecha, hora } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Grupo no encontrado" });
    }
    if (nombre) {
      group.name = nombre;
    }
    if (fecha) {
      group.date = fecha;
    }
    if (hora) {
      group.hour = hora;
    }
    await group.save();
    res.json(group);
  } catch (error) {
    next(error);
  }
});
//Delete salir del grupo
router.delete("/:groupId/leave", isAuthenticated, async (req, res, next) => {
  const { groupId } = req.params;
  const userId = req.payload._id; 
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Grupo no encontrado" });
    }
    const userIndex = group.users.findIndex(id => id.toString() === userId.toString());
    if (userIndex !== -1) {
      group.users.splice(userIndex, 1);
    }
    group.purchase = group.purchase.filter(purchase => purchase.userId.toString() !== userId.toString());
    await group.save();
    res.status(200).json({ message: "Usuario salió del grupo exitosamente" });
  } catch (error) {
    next(error);
  }
});
//Ruta Delete para borrar una compra
router.delete("/:groupId/removepurchase/:userId/:productId/:quantity", isAuthenticated, async (req, res, next) => {
  const { groupId, userId, productId, quantity } = req.params;
  
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Grupo no encontrado" });
    }
    const purchaseIndex = group.purchase.findIndex(p => p.userId.toString() === userId && p.productId.toString() === productId);
    if (purchaseIndex === -1) {
      return res.status(404).json({ error: "Compra no encontrada" });
    }
    const deletedPurchase = group.purchase.splice(purchaseIndex, 1)[0];
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    product.cantidad += parseInt(quantity); // Aumentar la cantidad disponible
    await group.save();
    await product.save();
    res.status(200).json({ message: "Compra eliminada exitosamente", deletedPurchase });
  } catch (error) {
    next(error);
  }
});
// Ruta DELETE para eliminar un grupo y sus productos asociados
router.delete('/:groupId', async (req, res, next) => {
  const { groupId } = req.params;
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Grupo no encontrado' });
    }
    await Product.deleteMany({ _id: { $in: group.products } });
    await Group.findByIdAndDelete(groupId);
    res.status(200).json({ message: 'Grupo y productos asociados eliminados exitosamente' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
