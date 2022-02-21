const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json())

const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://aryangupta:hQXEysyaTNJDcPa8@cluster0.aolya.mongodb.net/products?retryWrites=true&w=majority").then(()=>{
    console.log('Connected with MongooseDB successfully')
}).catch((err)=>{
    console.log(err)
})
//routes
const product = require('./api/routes/productRoutes')

app.use('/', product)

app.use((req,res,next)=>{
    res.status(200)
    res.json({
        message : "this is app.js"
    })
})


module.exports = app;
