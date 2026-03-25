const express = require("express")
const multer = require("multer")
const sharp = require("sharp")
const fs = require("fs")

const app = express()
const upload = multer({ dest:"upload/" })

app.get("/", (req,res)=>{
res.sendFile(__dirname + "/index.html")
})

app.post("/upscale", upload.single("image"), async (req,res)=>{

try{

let input = req.file.path
let output = "hd-"+Date.now()+".jpg"

await sharp(input)
.resize({ width: 3840 }) // target 4K width
.sharpen()
.normalize()
.toFile(output)

res.download(output)

}catch(e){

res.send("error")

}

})

app.listen(3000,()=>console.log("HD LOCAL READY"))
