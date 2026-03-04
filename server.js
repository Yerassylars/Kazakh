const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 3000

const DATA_FILE = path.join(__dirname, 'materials.json')
const UPLOAD_DIR = path.join(__dirname, 'uploads')
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR)

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g,'_'))
})
const upload = multer({ storage })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(UPLOAD_DIR))
app.use('/', express.static(path.join(__dirname)))

function loadData(){
  try{ return JSON.parse(fs.readFileSync(DATA_FILE,'utf8')||'[]') }catch(e){ return [] }
}
function saveData(arr){ fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2), 'utf8') }

app.get('/api/ping', (req,res)=> res.json({ok:true}))

app.get('/api/materials', (req,res)=>{
  const data = loadData()
  res.json(data)
})

app.post('/api/materials', upload.single('file'), (req,res)=>{
  const { subject, type, title, description, url } = req.body
  const file = req.file
  const item = { id: Date.now(), subject, type, title, desc: description }
  if(url) item.url = url
  if(file){ item.file = '/uploads/' + path.basename(file.path) }

  const arr = loadData()
  arr.unshift(item)
  saveData(arr)
  res.json({ok:true, item})
})

app.listen(PORT, ()=> console.log(`Server started at http://localhost:${PORT}`))
