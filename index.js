const express = require("express")
const helmet = require("helmet")
const cors = require("cors")

const db = require("./database/dbConfig.js")
const Users = require("./users/users-model.js")

const server = express()

const bcrypt = require("bcryptjs")

server.use(helmet())
server.use(express.json())
server.use(cors())

server.get("/", (req, res) => {
  res.send("It's alive!")
})

server.post("/api/register", async (req, res) => {
  let user = req.body

  bcrypt.genSalt(10, async function(err, salt) {
    bcrypt.hash(user.password, salt, async function(err, hash) {
      await Users.add(userData)
    })
  })

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved)
    })
    .catch(error => {
      res.status(500).json(error)
    })
})

server.post("/api/login", (req, res) => {
  let { username, password } = req.body

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user) {
        res.status(200).json({ message: `Welcome ${user.username}!` })
      } else {
        res.status(401).json({ message: "Invalid Credentials" })
      }
    })
    .catch(error => {
      res.status(500).json(error)
    })
})

server.get("/api/users", (req, res) => {
  Users.find()
    .then(users => {
      res.json(users)
    })
    .catch(err => res.send(err))
})

const port = process.env.PORT || 5000
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`))
