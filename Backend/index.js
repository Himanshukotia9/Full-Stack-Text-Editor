//index.js
const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const { google } = require('googleapis');
const Docs = require('./src/docs/docs.model');

const app = express()

const port = process.env.PORT || 5000;
require('dotenv').config()

const stripHtml = (html) => html.replace(/<[^>]*>?/gm, '');

//middelware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//Routes
const userRoute = require('./src/users/user.route')
const docsRoute = require('./src/docs/docs.route')

app.use('/api/auth', userRoute)
app.use('/api/docs', docsRoute)

const auth = new google.auth.GoogleAuth({
  keyFile: 'google_credentials.json',
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});


const drive = google.drive({ version: 'v3', auth });

app.post('/api/docs/upload-to-drive/:id', async (req, res) => {
  try {
    const document = await Docs.findById(req.params.id);
    if (!document) return res.status(404).json({ error: 'Document not found' });
    
    const fileMetadata = {
      name: `${document.title}.txt`,
      mimeType: 'text/plain',
      parents: ['11ZwJ1t91RmWf6M_emsZ2k_V2Le7jh0CF'],
    };
    
    const media = {
      mimeType: 'text/plain',
      body: stripHtml(document.content),
    };

    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
    });

    res.json({ message: 'Uploaded successfully', fileId: file.data.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


async function main() {
    await mongoose.connect(process.env.DB_URL);
    app.use('/', (req, res) => {
        res.send('Welcome to Text-Editor Server')
    })
}
main().then(() => console.log('✅ Connected to database')).catch(err => console.error("❌ Database connection error:", err));


app.listen(port, () => {
  console.log(`🚀 server running on port ${port}`)
})