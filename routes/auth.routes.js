const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middlewares/isAuthenticated");

//Ruta Post Registrar el usuario
router.post("/signup", async (req, res, next) => {
  const { name, email, password, confirmPassword, coordinates } = req.body;
  // console.log("quiero ver req.body", req.body);

  //   //! Validaciones de usuario
  
  // Validar campos vacíos
  if (!name || !email || !password || !confirmPassword ) {
    res
      .status(400)
      .json({ errorMessage: "Todos los campos deben estar rellenos" });
    return;
  }

  // Validar contraseña coincidente
  if (password !== confirmPassword) {
    res
      .status(400)
      .json({ errorMessage: "Las constraseñas no coinciden" });
    return;
  }

  // Validar contraseña
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  if (!passwordRegex.test(password)) {
    res
      .status(400)
      .json({ errorMessage: "La contraseña debe tener 8 caracteres, mayuscula,simbolo ,y numero" });
    return;
  }
  // Validar correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res
      .status(400)
      .json({ errorMessage: "Formato de correo no correcto" });
    return;
  }

  try {
    //Usuario no repetido
    const userfound = await User.findOne({ email: email });
    if (userfound) {
      res.status(400).json({ errorMessage: "Este correo ya esta registrado" });
      return;
    }
    //Encriptar constraseña
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // console.log("pass filter", hashPassword);

    //Crear usuario en la base de datos
    const response = await User.create({
      name: name,
      email: email,
      password: hashPassword,
      coordinates: coordinates
    });
    // console.log("usuario creado en DB", response);
    res.json("Usuario creado");
  } catch (error) {
    console.log(error, "error error");
    next(error);
  }
});
//Ruta Post Validar credenciales y crear sesion
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    //!Validacion de Usuario

    //Usuario existente
    const foundUser = await User.findOne({ email });
    // console.log(foundUser);
    if (foundUser === null) {
      res.status(400).json({ errorMessage: "Email no registrado" });
      return;
    }
    //Contraseña Correcta
    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );
    if (isPasswordCorrect === false) {
      res.status(400).json({ errorMessage: "Contraseña no valida" });
      return;
    }
    //?Crear sesion

    //Objeto para guardar datos del usuario

    const payload = {
      _id: foundUser._id,
      email: foundUser.email,
    };

    //Validacion de Token

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "1d",
    });

    res.json(authToken);
  } catch (error) {
    next(error);
  }
});
//Ruta Get para indicar al Front que el usuario esta activo
router.get("/verify", isAuthenticated, (req, res, next) => {
  res.json(req.payload);
});

module.exports = router;
