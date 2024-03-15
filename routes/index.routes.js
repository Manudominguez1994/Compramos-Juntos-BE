const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("Test server");
});

const authRouter = require("./auth.routes")
router.use("/auth", authRouter)

const userRouter = require("./user.routes")
router.use("/user", userRouter)

module.exports = router;
