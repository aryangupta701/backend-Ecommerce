const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json())

const errorMiddleware = require('./middlewares/error')
const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://aryangupta:hQXEysyaTNJDcPa8@cluster0.aolya.mongodb.net/products?retryWrites=true&w=majority").then(()=>{
    console.log('Connected with MongooseDB successfully')
}).catch((err)=>{
    console.log(err)
})
//routes
const product = require('./routes/productRoutes')

app.use('/api/v1', product)

app.use(errorMiddleware)

module.exports = app;
