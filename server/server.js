//----------------------------------express---------------------------------
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
const fs = require('fs');
const PORT = 3000;
const cors = require('cors');
const app = express();
const multer = require('multer');
const moment = require('moment');
const { MongoClient } = require('mongodb');
const { json } = require('express');
const uri = "mongodb+srv://pasha096:pasha096@cluster0.rjjcxdz.mongodb.net/insta?retryWrites=true&w=majority"
const client = new MongoClient(uri)
const ObjectId = require('mongodb').ObjectId;

//-------------------------------------multer-------------------------------
const storage= multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}.JPG`)
    }

})
const upload = multer({storage})

//---------------------------------functions--------------------------------

const writeFileAsync = async (path, data) => {
    return new Promise((res, rej) => fs.writeFile(path, data, (err) => {
        if (err) {return rej(err.message)}
        res()
    }))
}

const readFileAsync = async (path) => {
    return new Promise((res, rej) => fs.readFile(path, {encoding: 'utf-8'}, (err, data) => {
        if (err) {return rej(err.message)}
        res(data)
    }))
}

//--------------------------------server---------------------------------

app.use(cors())
app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'))

//--------------------------------server---------------------------------

//remake to mongo
app.post('/users', async (req, res) => {
    const user = req.body
    const users = await client.db().collection('users')
    users.insertOne(user)
})
//remake to mongo
app.get('/users/:id', async (req, res) => {
    const id = new ObjectId(req.params.id)
    const users = await client.db().collection('users')
    const userToFind = await users.findOne({_id: id})
    res.send(userToFind)
})
//remake to mongo
app.get('/users', async (req, res) => {
    console.log(req.body)
    const users = await client.db().collection('users').find().toArray()
    res.send(users)
})
//remake to mongo
app.post('/login', async (req, res) => {
    const userToLogin = req.body
    const users = await client.db().collection('users')
    const userToFind = await users.findOne({email: userToLogin.email, password: userToLogin.password})
    
    if (userToFind) { res.send(userToFind) } else { res.send(false) }
})


app.put('/users/:id', async (req, res) => {

    await readFileAsync(path.resolve(__dirname, 'users.txt'))
        .then(data => { 
            const id = req.params.id
            const allUsers = JSON.parse(data)
            const findUser = allUsers.find(user => user.id === id)
            const findIndexUser = allUsers.findIndex(user => user.id === id)
            const user = req.body
            const mergedUser = {...findUser, ...user}
            allUsers.splice(findIndexUser, 1, mergedUser)
            res.send(mergedUser)
            writeFileAsync(path.resolve(__dirname, 'users.txt'), JSON.stringify(allUsers))
    })  


})

app.post('/uploads', upload.single('avatar'), async (req, res) => { 
    const date = moment().format('DDMMYYYY-HHmmss_SSS')
    const imgName = `uploads/${date}-${req.body.filename}.JPG`
    fs.rename(`uploads/${req.file.fieldname}.JPG`, imgName, (err) => { if(err) { throw err} })
    readFileAsync(path.resolve(__dirname, 'users.txt'))
    .then(data => {
        const allUsers = JSON.parse(data)
        const findUser = allUsers.find(user => user.email === req.body.filename)
        const findIndexUser = allUsers.findIndex(user => user.email === req.body.filename)
        
        findUser.imgURL = `http://localhost:3000/${imgName}`
        allUsers.splice(findIndexUser, 1, findUser)
        writeFileAsync(path.resolve(__dirname, 'users.txt'), JSON.stringify(allUsers))
    })
})  

//remake to mongo
app.post('/posts/:id', upload.single('post'), async (req, res) => { 
    const date = moment().format('DDMMYYYY-HHmmss_SSS')
    const imgName = `uploads/${date}-${req.body.filename}.JPG`
    fs.rename(`uploads/${req.file.fieldname}.JPG`, imgName, (err) => { if(err) { throw err} })
    
    
    const id = req.params.id
    const URL = `http://localhost:3000/${imgName}`
    const allPosts = client.db().collection('posts')
    const post = {userID: id, url: URL, description: req.body.description}
    await allPosts.insertOne(post)
    
    res.send(URL)
}) 
//remake to mongo
app.get('/posts/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)
    const allPosts = await client.db().collection('posts')
    const postsToSend = []
    const userPosts = await allPosts.find({userID: id}).toArray()
   
    console.log(userPosts)
    if (userPosts) {
        res.send(userPosts)
    } else {
        res.send(false)
    }
})
//remake to mongo
app.get('/posts', async(req, res) => {
    const allPosts = await client.db().collection('posts').find().toArray()
    res.send(allPosts)
})

app.put('/posts/:id', async(req, res) => {
    const update = req.body
    const postId = new ObjectId(req.params.id)

    await client.db().collection('posts').findOneAndUpdate({_id: postId}, {$set: update})
    res.send('')
})


app.listen(PORT, () => console.log('Server start'))




