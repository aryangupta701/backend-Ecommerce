const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const path = require('path')
const cors = require('cors')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload())
app.use(cors({
    origin: 'https://aryangupta701.github.io'
}))
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
const payment = require('./routes/paymentRoutes')


app.use('/api/v1', product)
app.use('/api/v1', user )
app.use('/api/v1', order )
app.use('/api/v1', payment )

// app.use(express.static(path.join(__dirname,"")))
// app.get("*", (req,res)=>{
//     res.sendFile(path.resolve(__dirname,""))
// })

app.use(errorMiddleware)

module.exports = app;
