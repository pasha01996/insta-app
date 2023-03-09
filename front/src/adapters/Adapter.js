export default class Adapter {
    constructor() {}

    setSessionStorage (name, data) {
        sessionStorage.setItem(name, JSON.stringify(data))
    }

    getSessionStorage (name) {
        return JSON.parse(sessionStorage.getItem(name))
    }

    sendDataToServer(url, data, method) {
        return fetch(url, {
           method: method,
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(data),
           mode: 'cors',
           cache: 'default'
       })
    }

    sendImgToServer (url, data, method) {
        return fetch(url, {
            method: method,
            body: data
        })
    }

    sendGetRequest (url) {
        return fetch(url)
    }

    sendDeleteRequest (url) {
        fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            cache: 'default'
        })
    }
}