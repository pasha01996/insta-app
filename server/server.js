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
app.post('/users', async (req, res) => {

    const minLength = 12

    await readFileAsync(path.resolve(__dirname, 'users.txt'))
        .then(async (data) =>  { 

        if (data.length > minLength) {
        const lengthUsers = JSON.parse(data).length
        const user = req.body
        let allUsers = data

        user.id = lengthUsers + 1
        allUsers = allUsers.slice(1, -1)
        allUsers = allUsers + ',' + JSON.stringify(user)
        allUsers = '[' + allUsers + ']'

        writeFileAsync(path.resolve(__dirname, 'users.txt'), allUsers)
        
        await readFileAsync(path.resolve(__dirname, 'posts.txt'))
            .then(data => {
                const post = {id: user.id, posts: []}
                const allPosts = JSON.parse(data)
                allPosts.push(post)
                writeFileAsync(path.resolve(__dirname, 'posts.txt'), JSON.stringify(allPosts))
            })
        
        } else {
            const user = req.body
            user.id = 1
            writeFileAsync(path.resolve(__dirname, 'users.txt'), '['+ JSON.stringify(user) +']')

            const post = {id: 1, posts: []}
            writeFileAsync(path.resolve(__dirname, 'posts.txt'), '['+ JSON.stringify(post) +']')
        }

    })  

})

app.get('/users/:id', async (req, res) => {
    await readFileAsync(path.resolve(__dirname, 'users.txt'))
        .then(data => {
            const id = +req.params.id
            const allUsers = JSON.parse(data)
            const findUser = allUsers.find(user => user.id === id )
            res.send(findUser)
        })
})

app.get('/users', async (req, res) => {
    await readFileAsync(path.resolve(__dirname, 'users.txt'))
        .then(data => {res.send(data)})   
})

app.put('/users/:id', async (req, res) => {
    await readFileAsync(path.resolve(__dirname, 'users.txt'))
        .then(data => { 
            const id = +req.params.id
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

app.post('/posts/:id', upload.single('post'), async (req, res) => { 
    const date = moment().format('DDMMYYYY-HHmmss_SSS')
    const id = +req.params.id
    const imgName = `uploads/${date}-${req.body.filename}.JPG`
    fs.rename(`uploads/${req.file.fieldname}.JPG`, imgName, (err) => { if(err) { throw err} })
    
    await readFileAsync(path.resolve(__dirname, 'posts.txt'))
        .then(async data => {
            const URL = `http://localhost:3000/${imgName}`
            
            const allPosts = JSON.parse(data)
            const indexUserPost = allPosts.findIndex(post => post.id === id)
            const userPosts = {img: URL, description: req.body.description}
            allPosts[indexUserPost].posts.push(userPosts)
            await writeFileAsync(path.resolve(__dirname, 'posts.txt'), JSON.stringify(allPosts))
            res.send('')
    })
}) 

app.get('/posts/:id', async (req, res) => {
    const id = +req.params.id
    await readFileAsync(path.resolve(__dirname, 'posts.txt'))
        .then(data => {
            const allPosts = JSON.parse(data)
            const indexUserPost = allPosts.findIndex(post => post.id === id)
            res.send(allPosts[indexUserPost].posts)
        })
})

app.get('/posts', async(req, res) => {
    readFileAsync(path.resolve(__dirname, 'posts.txt'))
        .then(data => {
            const allData = JSON.parse(data) 
            const allPosts = []
            allData.forEach(post => post.posts.forEach(post => allPosts.push(post)))
            res.send(allPosts)
        })
})



app.listen(PORT, () => console.log('Server start'))




