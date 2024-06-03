const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)
    .then(() => console.log('connected...'))
    .catch(e => console.log("error"));

const PORT = process.env.PORT;

const postSchema = new mongoose.Schema({
    Name: String,
    email: String,
    qualification: String,
    countryFlag: String,
    country: String,
    imagePath: String,
    category: String,
    heading: String,
    description: String,
    content: String,
    created_at: { type: Date, default: Date.now }
});

const blogmodel = mongoose.model('BlogDescription', postSchema);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');  // Directory to save uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));  // Use current timestamp as filename
    }
});

const upload = multer({ storage: storage });

const app = express();

const filepath = path.join(__dirname, 'public')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/',async(req, resp) => {
    try {
        const latest_records = await blogmodel.find().sort({ created_at: -1 }).limit(10);
        resp.render('index', { latestRecords: latest_records });
    } catch (e) {
        console.log("error");
        resp.render('index', { latestRecords: [] });
    }
})

app.get('/about', (req, resp) => {
    resp.render('about')
})

app.get('/Category', (req, resp) => {
    resp.render('Category')
})

app.get('/contact', (req, resp) => {
    resp.render('contact')
})

app.get('/createBlog', (req, resp) => {
    resp.render('createBlog', { msg: null })
})

app.post('/post', (req, resp) => {
    resp.render('readBlog')
})

app.get('/search', async (req, res) => {
    const searchQuery = req.query.searchQuery;
    try {
        if (!searchQuery) {
            throw new Error('Search query parameter is missing');
        }

        const results = await blogmodel.find({
            $or: [
                { Name: { $regex: new RegExp(searchQuery, 'i') } },
                { email: { $regex: new RegExp(searchQuery, 'i') } },
                { qualification: { $regex: new RegExp(searchQuery, 'i') } },
                { country: { $regex: new RegExp(searchQuery, 'i') } },
                { category: { $regex: new RegExp(searchQuery, 'i') } },
                { heading: { $regex: new RegExp(searchQuery, 'i') } },
                { description: { $regex: new RegExp(searchQuery, 'i') } },
                { content: { $regex: new RegExp(searchQuery, 'i') } }
            ]
        });
        res.render('search', { latestRecords: results });
    } catch (e) {
        res.render('search', { latestRecords: [] });
    }
});



app.post('/createBlog/post', upload.single('image'), (req, resp) => {
    const { Name, email, qualification, countryFlag, country, category, heading, description, content } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    const newBlog = new blogmodel({
        Name,
        email,
        qualification,
        countryFlag,
        country,
        imagePath,
        category,
        heading,
        description,
        content
    });

    newBlog.save()
        .then(() => {
            const msg = "Your data is successfully posted";
            console.log(msg);
            resp.render('createBlog', { msg: msg });
        })
        .catch(e => {
            const msg = "Your data is not successfully posted";
            console.log(e);
            resp.render('createBlog', { msg: msg });
        });
});

app.get('/readBlog', async (req, res) => {
    try {
        const blogId = req.query._id;
        if (!blogId) {
            return res.status(400).send('Blog ID is required');
        }

        const result = await blogmodel.findById(blogId);

        if (!result) {
            return res.status(404).send('Blog post not found');
        }

        res.render('readBlog', { record: result });
    } catch (error) {
        console.error("Error retrieving blog post:", error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/rules',(req,resp)=>{
    resp.render('templates/rules')
})

app.get('/privacy',(req,resp)=>{
    resp.render('templates/privacy')
})

app.listen(PORT, () => {
    console.log(`You can visit this link http://localhost:${PORT}`);
})