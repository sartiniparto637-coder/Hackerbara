const express = require("express")
const fetch = (...a)=>import("node-fetch").then(({default:f})=>f(...a))

const app = express()
app.use(express.json())

const DG = process.env.DEEPGRAM

if(!DG){
  console.log("WARNING: DEEPGRAM API KEY BELUM DISET")
}

// UI utama (mobile friendly)
app.get("/", (req,res)=>{
res.send(`
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Voice AI</title>

<style>
body{
margin:0;
font-family:sans-serif;
background:#0f172a;
color:white;
display:flex;
flex-direction:column;
height:100vh;
}
.top{
padding:15px;
background:#020617;
text-align:center;
font-size:20px;
}
#chat{
flex:1;
overflow:auto;
padding:10px;
display:flex;
flex-direction:column;
gap:10px;
}
.me{
align-self:flex-end;
background:#22c55e;
padding:10px;
border-radius:15px;
max-width:75%;
}
.ai{
align-self:flex-start;
background:#334155;
padding:10px;
border-radius:15px;
max-width:75%;
}
.mic{
position:fixed;
bottom:20px;
right:20px;
width:70px;
height:70px;
border-radius:50%;
border:none;
background:#22c55e;
font-size:25px;
color:white;
}
</style>
</head>

<body>

<div class="top">🎤 Voice AI Mobile</div>
<div id="chat"></div>
<button class="mic" onclick="talk()">🎙</button>

<script>
function bubble(t,me){
chat.innerHTML += '<div class="'+(me?'me':'ai')+'">'+t+'</div>'
chat.scrollTop = chat.scrollHeight
}

async function talk(){

let stream = await navigator.mediaDevices.getUserMedia({audio:true})
let rec = new MediaRecorder(stream)

rec.ondataavailable = async e=>{

let text = "halo"

bubble(text,true)

let r = await fetch("/ai",{
method:"POST",
headers:{"Content-Type":"application/json"},
body: JSON.stringify({text})
})

let j = await r.json()

bubble(j.text,false)

new Audio("data:audio/mp3;base64,"+j.audio).play()
}

rec.start()
setTimeout(()=>rec.stop(),2000)
}
</script>

</body>
</html>
`)
})

// AI endpoint
app.post("/ai", async (req,res)=>{
try{

const text = req.body.text || "halo"
const reply = "Halo juga 👋 Kamu bilang: " + text

const tts = await fetch(
"https://api.deepgram.com/v1/speak?model=aura-asteria-en",
{
method:"POST",
headers:{
"Authorization":"Token "+DG,
"Content-Type":"application/json"
},
body: JSON.stringify({text:reply})
})

const audio = await tts.arrayBuffer()

res.json({
text: reply,
audio: Buffer.from(audio).toString("base64")
})

}catch(e){
console.log(e)
res.json({text:"AI error",audio:""})
}
})

// route test biar server ga dimatiin replit
app.get("/test",(req,res)=>{
res.send("SERVER HIDUP 🔥")
})

const PORT = process.env.PORT || 3000

process.on("uncaughtException",err=>{
console.log("ERROR:",err)
})

process.on("unhandledRejection",err=>{
console.log("PROMISE:",err)
})

app.listen(PORT,"0.0.0.0",()=>{
console.log("SERVER RUNNING on",PORT)
})
