
export const sendFetch = {
    POSTImage: async (input, inputText, url) => {
        const formData = new FormData()
        formData.append('post', input.files[0])
        formData.append('filename', input.name)
        formData.append('description', inputText.value)
        await fetch(url, {
            method: 'POST',
            body: formData
        })
    },

    PUTImage: async (input, url) => {
        const formData = new FormData()
        formData.append('avatar', input.files[0])
        formData.append('filename', input.name)
        
        await fetch(url, {
            method: 'PUT',
            body: formData
        }).then(response => { return response.json() })
    },

    POSTRequest: async function (url, data) {
        return await fetch(url, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(data),
           mode: 'cors',
           cache: 'default'
       }).then(response => { return response.json() })
    },
    
    PUTRequest: async (url, property, value) => {
        const body = {}
        body[property] = value
    
        await fetch(url, {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(body),
           mode: 'cors',
           cache: 'default'
       })
    },

    DELETERequest: async (url) => {
        await fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            cache: 'default'
        })
    },
    
    GETRequest: async (url) => {
        return await fetch(url).then(response => { return response.json() })
    }
}

const PORT = 'http://localhost:3000/'

export const urls = {
    login: `${PORT}login`,
    users: `${PORT}users`,
}