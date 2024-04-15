const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("Test server");
});

const authRouter = require("./auth.routes")
router.use("/auth", authRouter)

const userRouter = require("./user.routes")
router.use("/user", userRouter)

const uploadRoutes = require("./upload.routes");
router.use("/upload", uploadRoutes);

const productRoutes = require("./product.routes");
router.use("/product", productRoutes);

const groupRoutes = require("./group.routes");
router.use("/group", groupRoutes);

const chatRoutes = require("./chat.routes");
router.use("/chat", chatRoutes);

module.exports = router;
