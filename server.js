const express=require('express')
const mongoose=require('mongoose')
require('dotenv').config()
// const PORT=4000
const app=express()
app.use(express.json())
mongoose.connect(process.env.MONGODB_URL)
.then(console.log("database connected"))
.catch((err),()=>{
    console.log(err)
})
const bookRoute=require('./bookRoute')
app.use("/api/books",bookRoute)
app.listen(process.env.PORT,()=>{
    console.log("server started...");
})