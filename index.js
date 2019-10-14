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

server.post("/api/register", (req, res) => {
  let user = req.body

  // validate the user
  if (user.username && user.password) {
    // hash the password
    const hash = bcrypt.hashSync(user.password, 10)

    user.password = hash

    Users.add(user)
      .then(saved => {
        res.status(201).json(saved)
      })
      .catch(error => {
        res.status(500).json(error)
      })
  } else {
    res.status(400).json({ message: "Please provide a username and password" })
  }
})

server.post("/api/login", (req, res) => {
  let { username, password } = req.body

  Users.findBy({ username })
    .first()
    .then(user => {
      const passwordMatches = bcrypt.compareSync(password, user.password)
      if (user && passwordMatches) {
        res.status(200).json({ message: `Welcome ${user.username}!` })
      } else {
        res.status(401).json({ message: "Invalid Credentials" })
      }
    })
    .catch(error => {
      res.status(500).json({ message: "Could not find user with credentials" })
    })
})

server.get("/api/users", (req, res) => {
  Users.find()
    .then(users => {
      res.json(users)
    })
    .catch(err => res.send(err))
})

server.get("/hash", (req, res) => {
  // read a password from the Authorization header
  const password = req.headers.authorization

  if (password) {
    const hash = bcrypt.hashSync(password, 10) // the 8 is the number of rounds 2 ^ 8

    // return an object with the password hashed using bcryptjs
    res.status(200).json({ hash: hash })

    // { hash: '970(&(:OHKJHIY*HJKH(*^)*&YLKJBLKJGHIUGH(*P' }
  } else {
    res.status(400).json({ message: "Please provide credentials" })
  }
})

const port = process.env.PORT || 5000
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`))
