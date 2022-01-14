const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 10;

const UserModel = require("../models/User.model");
const generateToken = require("../config/jwt.config");

// Importando a instância do multer que é responsável por fazer o upload dos arquivos
const uploader = require("../config/cloudinary.config");

// CRUD de projeto

// Rota para upload de arquivo
router.post(
  "/image-upload",
  uploader.single("profilePicture"),
  (req, res, next) => {
    console.log(process.env.REACT_APP_URL);

    if (!req.file) {
      return next(new Error("Upload não conseguiu ser finalizado"));
    }

    console.log(req.file);

    return res.status(201).json({ url: req.file.path });
  }
);

// Definindo nossos route listeners
router.post("/signup", (req, res, next) => {
  const { name, email, password, pictureUrl } = req.body;

  // Verifica se a senha recebida é fraca
  if (
    !password ||
    !password.match(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/gm
    )
  ) {
    return res.status(400).json({
      msg: "O campo senha é obrigatório e precisa ter no mínimo 8 caracteres e conter letras maiúsculas e minúsculas, números e caracteres especiais.",
    });
  }

  // Criptografar a senha do usuário
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);

  const passwordHash = bcrypt.hashSync(password, salt);

  // Inserir o usuário no banco
  UserModel.create({ ...req.body, passwordHash })
    .then((result) => {
      const { name, email, _id } = result;
      return res.status(201).json({ name, email, _id });
    })
    .catch((err) => {
      console.error(err);
      return next(err);
    });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  // Buscar o usuário no banco através do email
  UserModel.findOne({ email })
    .then((result) => {
      if (!result) {
        return res
          .status(404)
          .json({ msg: "Este email não está cadastrado em nosso serviço" });
      }

      // Comparar se o hash armazenado no banco "bate" com a senha que o usuário enviou
      if (bcrypt.compareSync(password, result.passwordHash)) {
        // Gerar e assinar um token JWT para o usuário logado
        const token = generateToken(result);
        // Efetivar o login do usuário
        const { _id, name, email, pictureUrl } = result;
        return res
          .status(200)
          .json({ token, user: { _id, name, email, pictureUrl } });
      } else {
        return res.status(400).json({ msg: "E-mail ou senha errado" });
      }
    })
    .catch((err) => {
      console.error(err);
      return next(err);
    });
});

module.exports = router;
