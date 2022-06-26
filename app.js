const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const path = require('path')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload())

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
const order = require('./routes/orderRoutes')


app.use('/api/v1', product)
app.use('/api/v1', user )
app.use('/api/v1', order )

app.use(errorMiddleware)

module.exports = app;
