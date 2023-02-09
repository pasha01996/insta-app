//-----------uploads-----------
    // const inputX = document.getElementById('up-file')
    // const button = document.getElementById('button-upfile')
    // const formAvatar = document.getElementById('form-avatar')


    async function sendPOST(url, imput) {
        
        const formData = new FormData()
        formData.append('avatar', imput.files[0])
        formData.append('filename', imput.name)
        return await fetch(url, {
            method: 'POST',
            body: formData
        })
        .then(response =>  response.json())
        .then(data => `<img width="150px" height="150px" src="http://localhost:3000/uploads/${data.filename}.JPG" alt="">`)
        
    }



    // button.addEventListener('click', (e) => {
    //     e.preventDefault()
    //     sendPOST('http://localhost:3000/uploads', inputX, formAvatar)
    // })