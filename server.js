const express = require("express")
const fetch = (...args)=>import("node-fetch").then(({default:fetch})=>fetch(...args))

const app = express()

app.use(express.json())
app.use(express.static("public"))

const DEEPGRAM = process.env.DEEPGRAM

app.get("/", (req,res)=>{
  res.sendFile(__dirname + "/public/login.html")
})

app.post("/ai", async (req,res)=>{
  const text = req.body.text

  const reply = "Halo, kamu bilang: " + text

  const tts = await fetch(
    "https://api.deepgram.com/v1/speak?model=aura-asteria-en",
    {
      method:"POST",
      headers:{
        "Authorization":"Token " + DEEPGRAM,
        "Content-Type":"application/json"
      },
      body: JSON.stringify({text: reply})
    }
  )

  const audio = await tts.arrayBuffer()

  res.json({
    text: reply,
    audio: Buffer.from(audio).toString("base64")
  })
})

app.listen(process.env.PORT || 5000)
