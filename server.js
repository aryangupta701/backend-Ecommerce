const http = require('http')
const cloudinary = require('cloudinary')
//uncaught Exception
process.on("uncaughtException", err => {
    console.log(`Error : ${err.message}`)
    console.log("Closing Server Due to Uncaught Exception")
    process.exit(1)
})

const PORT = process.env.PORT || 4000
const app = require('./app')
const server = http.createServer(app)
const sv = server.listen(PORT)

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_KEY,
    api_secret : process.env.API_SECRET 
})

//unhandled promise rejection
process.on("unhandledRejection" , err => {
    console.log(`Error : ${err.message}`)
    console.log("Closing Server Due to unhandled Promise rejection")
    sv.close(()=>{
        process.exit(1)
    })
})