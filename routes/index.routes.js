const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("Test server");
});

module.exports = router;
