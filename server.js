const express = require("express")
const multer = require("multer")
const sharp = require("sharp")
const path = require("path")

const app = express()
const upload = multer({ dest: "upload/" })

// ✅ penting: serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

// upscale route
app.post("/upscale", upload.single("image"), async (req, res) => {

  try {

    let output = "hd-" + Date.now() + ".jpg"

    await sharp(req.file.path)
      .resize({ width: 3840 })
      .sharpen()
      .normalize()
      .toFile(output)

    res.download(output)

  } catch (e) {
    res.send("error upscale")
  }

})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("SERVER RUNNING on port " + PORT))
