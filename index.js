import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

const app = express()
app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ["POST", "GET"],
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}))

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'signup'
})

app.get('/dashboard', (req, res) => {
  if (req.session.email) {
    return res.json({valid: true, email: req.session.email})
  } else {
    return res.json({valid: false})
  }
})

app.post('/signup', (req, res) => {
  const sql = "INSERT INTO users (`email`,`password`) VALUES (?)"
  const values = [
    req.body.email,
    req.body.password
  ]
  db.query(sql, [values], (err, result) => {
    if (err) return res.json({Message: 'Error in Node'})
    return res.json(result)
  })
})

app.post('/signin', (req, res) => {
  const sql = "SELECT * FROM users WHERE email = ? and password = ?"
  db.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) return res.json({Message: 'Error inside Server'})
    if (result.length > 0) {
      req.session.email = result[0].email
      console.log(req.session.email)
      return res.json({Login: true})
    } else {
      return res.json({Login: false})
    }
  })
})

app.listen(3020, () => {
  console.log('started on 3020 port')
})