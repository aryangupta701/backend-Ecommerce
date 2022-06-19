const http = require('http')
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



//unhandled promise rejection
process.on("unhandledRejection" , err => {
    console.log(`Error : ${err.message}`)
    console.log("Closing Server Due to unhandled Promise rejection")
    sv.close(()=>{
        process.exit(1)
    })
})