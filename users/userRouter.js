const express = require("express")

const router = express.Router()

const Users = require("./users-model")

const bcrypt = require("bcryptjs")

router.post("/users", async (req, res) => {
  const userData = req.body

  const newUser = await Users.findBy(`${userData.username} = username`)

  res.status(201).json(newUser)
})
