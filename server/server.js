//----------------------------------express---------------------------------
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
const fs = require('fs');
const PORT = 3000;
const cors = require('cors');
const app = express();
const multer = require('multer');



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
        .then(data => { 

        if (data.length > minLength) {
        const lengthUsers = JSON.parse(data).length
        const user = req.body
        let allUsers = data

        user.id = lengthUsers + 1
        allUsers = allUsers.slice(1, -1)
        allUsers = allUsers + ',' + JSON.stringify(user)
        allUsers = '[' + allUsers + ']'

        writeFileAsync(path.resolve(__dirname, 'users.txt'), allUsers)

        } else {
            const user = req.body
            user.id = 1
            writeFileAsync(path.resolve(__dirname, 'users.txt'), '['+ JSON.stringify(user) +']') 
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




app.post('/uploads', upload.single('avatar'), async (req, res, next) => { 

    fs.rename(`uploads/${req.file.fieldname}.JPG`, `uploads/${req.body.filename}.JPG`, (err) => { if(err) { throw err} })
    readFileAsync(path.resolve(__dirname, 'users.txt'))
    .then(data => {
        const allUsers = JSON.parse(data)
        const findUser = allUsers.find(user => user.email === req.body.filename)
        const findIndexUser = allUsers.findIndex(user => user.email === req.body.filename)
        
        findUser.imgURL = `http://localhost:3000/uploads/${req.body.filename}.JPG`
        allUsers.splice(findIndexUser, 1, findUser)
        writeFileAsync(path.resolve(__dirname, 'users.txt'), JSON.stringify(allUsers))

    })
})  






app.listen(PORT, () => console.log('Server start'))



