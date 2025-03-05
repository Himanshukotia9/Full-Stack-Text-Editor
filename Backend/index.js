//index.js
const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors')

const app = express()

const port = process.env.PORT || 5000;
require('dotenv').config()

//middelware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//Routes
const userRoute = require('./src/users/user.route')
const docsRoute = require('./src/docs/docs.route')

app.use('/api/auth', userRoute)
app.use('/api/docs', docsRoute)

async function main() {
    await mongoose.connect(process.env.DB_URL);
    app.use('/', (req, res) => {
        res.send('Welcome to Text-Editor Server')
    })
}
main().then(() => console.log('✅ Connected to database')).catch(err => console.error("❌ Database connection error:", err));


app.listen(port, () => {
  console.log(`🚀 server running on port ${port}`)
})