const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json())
app.use(cookieParser())

const errorMiddleware = require('./middlewares/error')
const mongoose = require('mongoose')

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: './config/config.env' });
}

mongoose.connect(process.env.url).then(()=>{
    console.log('Connected with MongooseDB successfully')
}).catch((err)=>{
    console.log(err)
})

//routes
const product = require('./routes/productRoutes')
const user = require('./routes/userRoutes')


app.use('/api/v1', product)
app.use('/api/v1', user )

app.use(errorMiddleware)

module.exports = app;