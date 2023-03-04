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
const { send } = require('process');
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



//--------------users---------------

app.post('/login', async (req, res) => {
    const userToLogin = req.body
    const users = await client.db().collection('users')

    const userToFind = await users.findOne({email: userToLogin.email, password: userToLogin.password})
    if (userToFind) { 
        res.send({check: true, user: userToFind}) 
    } else {
        res.send({check: false}) 
    }
})

app.post('/users', async (req, res) => {
    const userToRegistr = req.body
    const collection = await client.db().collection('users')
    
    const userToFind = await collection.findOne({email: userToRegistr.email})
    
    if (userToFind) { 
        res.send(false) 
    } else { 
        res.send(true) 
        userToRegistr.url = 'http://localhost:3000/uploads/unknown_user.jpg'
        collection.insertOne(userToRegistr)
    }
})

app.get('/users/:id', async (req, res) => {
    const id = new ObjectId(req.params.id)
    const users = await client.db().collection('users')
    const userToFind = await users.findOne({_id: id})
    res.send(userToFind)
})

app.get('/users', async (req, res) => {
    console.log(req.body)
    const users = await client.db().collection('users').find().toArray()
    res.send(users)
})

//----х----
app.put('/users/:id', async (req, res) => {
    const userId = new ObjectId(req.params.id)
    const update = req.body
    const users = await client.db().collection('users')
    const userToFind = await users.findOne({_id: userId})
    console.log(update)
    res.send('')
})

app.put('users/:id/avatar',upload.single('avatar'), async (req, res) => {
    const date = moment().format('DDMMYYYY-HHmmss_SSS')
    const imgName = `uploads/${date}-${req.body.filename}.JPG`
    fs.rename(`uploads/${req.file.fieldname}.JPG`, imgName, (err) => { if(err) { throw err} })

    const userId = new ObjectId(req.params.id)
    const collection = await client.db().collection('users')
    await collection.findOneAndUpdate({_id: userId}, {url: imgName})

    res.send('')
})



//--------------posts---------------

app.post('/posts/:id', upload.single('post'), async (req, res) => { 
    const date = moment().format('DDMMYYYY-HHmmss_SSS')
    const imgName = `uploads/${date}-${req.body.filename}.JPG`
    fs.rename(`uploads/${req.file.fieldname}.JPG`, imgName, (err) => { if(err) { throw err} })
    
    
    const id = req.params.id
    const URL = `http://localhost:3000/${imgName}`
    const allPosts = client.db().collection('posts')
    const post = {userID: id, user: req.body.filename,  url: URL, description: req.body.description, date: date}
    await allPosts.insertOne(post)
    
    res.send(URL)
}) 

app.get('/posts/id:id', async (req, res) => {
    const id = new ObjectId(req.params.id)
    const allPosts = await client.db().collection('posts')
    const post = await allPosts.findOne({_id: id})
    if (post) {
        res.send(post)
    } else {
        res.send(false)
    }
})

app.get('/posts/user:id', async (req, res) => {
    const id = req.params.id
    const allPosts = await client.db().collection('posts')
    const userPosts = await allPosts.find({userID: id}).toArray()
    if (userPosts) {
        res.send(userPosts)
    } else {
        res.send(false)
    }
})

app.get('/posts', async(req, res) => {
    const allPosts = await client.db().collection('posts').find().sort({date:-1}).toArray()
    res.send(allPosts)
})

app.get('/posts/part:part', async(req, res) => {
    const row = 9
    let part = req.params.part
    const allPosts = await client.db().collection('posts').find().sort({date:-1}).toArray()
    const countOfPosts = allPosts.length
    const allPartOfPosts = Math.ceil(countOfPosts / row)

    if (part <= allPartOfPosts) {
        part--
        const start = row * part
        const end = start + row
        const sliceOfPosts = allPosts.slice(start, end)
        res.send(sliceOfPosts)
    } else {
        res.send(JSON.stringify(''))
    }
})

app.put('/posts/id:id', async(req, res) => {
    const update = req.body
    const postId = new ObjectId(req.params.id)

    await client.db().collection('posts').findOneAndUpdate({_id: postId}, {$set: update})
    res.send('')
})

app.put('/posts/like:id', async(req, res) => { 
    const update = req.body
    const postId = new ObjectId(req.params.id)
    const collection = await client.db().collection('posts')
    const findPost = await collection.findOne({_id: postId})

    if (update.like) {
        if (findPost.like) {
            if (findPost.unlike) {
                const findUnlike = findPost.unlike.find(elem => elem == update.like)
                
                if (findUnlike) {
                    const findUnlike = findPost.unlike.findIndex(elem => elem == update.like)
                    findPost.unlike.splice(findUnlike, 1)
                    collection.findOneAndUpdate({_id: postId}, {$set: findPost})
                }
            }
            const findLike = findPost.like.find(elem => elem == update.like)
            if (!findLike) {
                findPost.like.push(update.like)
                collection.findOneAndUpdate({_id: postId}, {$set: findPost})
            }
        } else {
            collection.findOneAndUpdate({_id: postId}, {$set: {like: [update.like]}})
            if (findPost.unlike) {
                const findUnlike = findPost.unlike.find(elem => elem == update.like)
                if (findUnlike) {
                    const findUnlike = findPost.unlike.findIndex(elem => elem == update.like)
                    findPost.unlike.splice(findUnlike, 1)
                    collection.findOneAndUpdate({_id: postId}, {$set: findPost})
                }
            }
        }
    }


    if (update.unlike) {
        if (findPost.unlike) {
            if (findPost.like) {
                const findLike = findPost.like.find(elem => elem == update.unlike)
                if (findLike) {
                    const findLike = findPost.like.findIndex(elem => elem == update.unlike)
                    findPost.like.splice(findLike, 1)
                    collection.findOneAndUpdate({_id: postId}, {$set: findPost})
                }
            }
            const findUnlike = findPost.unlike.find(elem => elem == update.unlike)
            if (!findUnlike) {
                findPost.unlike.push(update.unlike)
                collection.findOneAndUpdate({_id: postId}, {$set: findPost})
            }
        } else {
            collection.findOneAndUpdate({_id: postId}, {$set: {unlike: [update.unlike]}})
            if (findPost.like) {
                const findLike = findPost.like.find(elem => elem == update.unlike)
                if (findLike) {
                    const findLike = findPost.like.findIndex(elem => elem == update.unlike)
                    findPost.like.splice(findLike, 1)
                    collection.findOneAndUpdate({_id: postId}, {$set: findPost})
                }
            }
        }
    }

    res.send('')
})



//---------comments----------
app.post('/posts/:id/comments', async(req, res) => {
    const update = req.body
    const postId = req.params.id
    const collection = await client.db().collection('comments')
    update['postID'] = postId
    const newComment = await collection.insertOne(update)
    const newCommentId = new ObjectId(newComment.insertedId)
    const sendComment = await collection.findOne({_id: newCommentId})

    res.send(sendComment)
})

app.get('/posts/:id/comments', async(req, res) => {
    const postId = req.params.id
    const collection = await client.db().collection('comments')
    const findAllPost = await collection.find({postID: postId}).toArray()

    console.log(findAllPost)
    res.send(findAllPost)
})

app.delete('/posts/:id/comments', async(req, res) => {
    const commentId = new ObjectId(req.params.id)
    const collection = await client.db().collection('comments')
    collection.findOneAndDelete({_id: commentId})
    
    res.send('')
})

app.post('/posts/:id/commentTocomment', async(req, res) => {
    const update = req.body
    const commentId = new ObjectId(req.params.id)
    const collection = await client.db().collection('comments')
    const findComment = await collection.findOne({_id: commentId})


    if (!findComment.commentsThisComment) {
        findComment.commentsThisComment = [update]
        collection.findOneAndUpdate({_id: commentId}, {$set: findComment})
    } else {
        findComment.commentsThisComment.push(update)
        collection.findOneAndUpdate({_id: commentId}, {$set: findComment})
    }

    res.send({})
})




app.listen(PORT, () => console.log('Server start'))


