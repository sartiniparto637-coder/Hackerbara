const express = require("express")
const fetch = (...args)=>import("node-fetch").then(({default:fetch})=>fetch(...args))
const app = express()

app.use(express.json())
app.use(express.static("public"))

const DEEPGRAM = "1a8bc784c3dab2ba86df7dfd828af42592fb1ad2"

app.post("/ai", async (req,res)=>{
  const text = req.body.text

  // contoh AI sederhana (lu bisa ganti OpenAI dll)
  const reply = "AI jawab: "+text

  const tts = await fetch("https://api.deepgram.com/v1/speak?model=aura-asteria-en",{
    method:"POST",
    headers:{
      "Authorization":"Token "+DEEPGRAM,
      "Content-Type":"application/json"
    },
    body: JSON.stringify({text:reply})
  })

  const audio = await tts.arrayBuffer()

  res.json({
    text: reply,
    audio: Buffer.from(audio).toString("base64")
  })
})

app.listen(3000,()=>console.log("SERVER RUNNING"))
