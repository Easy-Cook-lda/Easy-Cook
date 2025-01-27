const express = require('express')
const session = require('express-session')
const path = require('path')
const routes = require('./routes')

const app = express()
const PORT = 3000

app.use(express.json());

app.use(session({
    secret: 'bda024bf-1d47-470d-9fd1-363444a77d3b',  // Um segredo para assinar o cookie da sessão
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Define como 'true' se estiveres a usar HTTPS
}));

app.use(express.static(path.join(__dirname, '../public')))

app.use(routes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})