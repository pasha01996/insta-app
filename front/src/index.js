import {Form} from "./scripts/Form.js"
import {Control} from "./scripts/Control.js"
import {checks} from "./scripts/module.js"
import {create} from "./scripts/html_elems.js"
import {sendFetch} from "./adapters/fetch.js"
import {urls} from "./adapters/fetch.js"

import "./styles/header.css" 
import "./styles/style.css" 
import "./styles/modal.css" 
import "./styles/form.css" 
import "./styles/table.css"
import "./styles/edit_form_table.css"
import "./styles/user_profile.css"
import "./styles/create_post.css"
import "./styles/interesting.css"
import "./styles/paginations.css"

const port = 'http://localhost:3000'

let isAuthorized = false
let isRegistered = false
//-------------------------------------functions-----------------------------------------

const setSessionStorage = (name, data) => {
    sessionStorage.setItem(name, JSON.stringify(data))
}

const getSessionStorage = (name) => {
    return JSON.parse(sessionStorage.getItem(name))
}

const changeLocation = (hash) => {
    location.hash = `${hash}`
}

const displayPage = async (htmlElem) => {
    await new Promise((res, rej) => res(document.getElementById('wrapper_body').replaceWith(htmlElem)))
}

const displayUserAvatar = async (...args) => {
    const user = getSessionStorage('whoAuthorized')

    args.forEach( elem => {
        const userImg = document.getElementById(elem)
        userImg.style.backgroundImage = `url(${user.url})`
    })
}

const updateUserAvatar = async () => {
    const user = getSessionStorage('whoAuthorized')
    const url = `http://localhost:3000/users/${user._id}`
    const res = await sendFetch.GETRequest(url)
    setSessionStorage('whoAuthorized', res)
}

const createDataForRequest = (userEmail, userUrl, userId, comment) => {
    const body = {}
    body['user'] = userEmail
    body['userUrl'] = userUrl
    body['userID'] = userId
    body['comment'] = comment
    return body
}

const createPost = async (wrapper, data) => {
    const postData = data

    let countLike = 0
    let countUnlike = 0
    if (postData.like) {countLike = postData.like.length} 
    if (postData.unlike) {countUnlike = postData.unlike.length}
    
    const getTime = () => {
        let timeOfPost = data.date.slice(9, 13)
         timeOfPost = timeOfPost.split('')
         timeOfPost.splice(2, 0, ':')
         return timeOfPost.join('')
    }

    const htmlElem = document.createElement('div')
    htmlElem.classList.add('user__post')
    htmlElem.insertAdjacentHTML('afterbegin', `
        <div class="modal_post_description">
            <span class="span_post_description">${postData.user}</span>
            <span class="span_post_description">${getTime()}</span>
        </div>
    `)
    
    const divImg = document.createElement('div')
    divImg.insertAdjacentHTML('afterbegin', `
        <img class="modal__img_post" src="${postData.url}" alt="${postData.description}" data-postId="${postData._id}">
        <div class="user_description_post">${postData.description}</div> 
    `)

    const divLike = document.createElement('div')
    divLike.classList.add('modal_post_description')
    
    const likeBtn = document.createElement('button')
    likeBtn.classList.add('btn', 'green')
    likeBtn.insertAdjacentHTML('afterbegin', `<i class="fa fa-thumbs-up fa-lg" aria-hidden="true">`)
    const span1 = document.createElement('span')
    span1.textContent = countLike
    likeBtn.append(span1)


    const unlikeBtn = document.createElement('button')
    unlikeBtn.classList.add('btn', 'red')
    unlikeBtn.insertAdjacentHTML('afterbegin', `<i class="fa fa-thumbs-down fa-lg" aria-hidden="true">`)
    const span2 = document.createElement('span')
    span2.textContent = countUnlike
    unlikeBtn.append(span2)

    likeBtn.addEventListener('click', async () => {
        const user = JSON.parse(sessionStorage.getItem('whoAuthorized')) 
        const url = `http://localhost:3000/posts/like${postData._id}`
        await sendFetch.PUTRequest(url, 'like', user._id)

        const req = await sendFetch.GETRequest(`${port}/posts/id${postData._id}`)
        if(req.like) span1.innerText = req.like.length
        if (req.unlike) span2.innerText = req.unlike.length
    })

    unlikeBtn.addEventListener('click', async () => {
        const user = JSON.parse(sessionStorage.getItem('whoAuthorized')) 
        const url = `http://localhost:3000/posts/like${postData._id}`
        await sendFetch.PUTRequest(url, 'unlike', user._id)

        const req = await sendFetch.GETRequest(`${port}/posts/id${postData._id}`)
        if(req.like) span1.innerText = req.like.length
        if (req.unlike) span2.innerText = req.unlike.length
    })

    divLike.append(likeBtn)
    divLike.append(unlikeBtn)
    htmlElem.append(divImg)
    htmlElem.append(divLike)
    wrapper.append(htmlElem) 
}

const createComments = async (wrapper, data, idPost) => {
    const commentData = data

    const sectionComments = document.createElement('div')
    sectionComments.classList.add('modal__main')

    const headerComments = document.createElement('div')
    headerComments.classList.add('modal__post_all_coments')


    const footerComments = create.footerComments()
    const btnFooterComments = footerComments.querySelector('.modal__post_button')
    const divUserToComment = footerComments.querySelector('.modal__container_commentToComment')
    const textarea = footerComments.querySelector('.modal__post_textarea')

    if (commentData) {
        commentData.forEach((elem) => {
            //create main comment
            const mainComment = create.comment(elem.userUrl, elem.user, elem._id, elem.comment, elem.userID)
            const divCommentsForComment = mainComment.querySelector('.modal__wrapper_comments_for_comment')
            const buttonAnswer = mainComment.querySelector('.modal__div_answer')
            const buttonDelete = mainComment.querySelector('.modal__span_delete')

            //create comment for comment
            if(elem.commentsThisComment) {
                elem.commentsThisComment.forEach((elem) => {
                const secondComment = create.comment(elem.userUrl, elem.user, elem._id, elem.comment, elem.userID)  
                divCommentsForComment.append(secondComment)
                })
                
            }

            //add events
            buttonDelete.addEventListener('click', async (event) => {
                const user = getSessionStorage('whoAuthorized')
                const userWantDeleteID = event.target.dataset.userId
               
                if (user._id === userWantDeleteID) {
                    const commentID = event.target.dataset.commentId
                    const url = `http://localhost:3000/posts/${commentID}/comments`
                    sendFetch.DELETERequest(url)
                    mainComment.remove()
                    divCommentsForComment.remove()
                }
            })  

            buttonAnswer.addEventListener('click', () => {
                divUserToComment.innerText = elem.user
                btnFooterComments.dataset.commentTo = elem._id
            })

            //display comments
            headerComments.append(mainComment)
            headerComments.append(divCommentsForComment)
        })
    }

    btnFooterComments.addEventListener('click', async (event) => {
        if (event.target.dataset.commentTo) {

            const commentID = event.target.dataset.commentTo
            const user = JSON.parse(sessionStorage.whoAuthorized)
            const comment = textarea.value
            const url = `${port}/posts/${commentID}/commentTocomment`

            const data = createDataForRequest(user.email, user.url, user._id, comment)
            const res = await sendFetch.POSTRequest(url, data)
            
            // create comment HTML
            const allComments = Array.prototype.slice.call(document.querySelectorAll('.modal__wrapper_comment'))
            const findCommentToComment = allComments.find(elem => elem.dataset.idComment === event.target.dataset.commentTo)
            const commentTocomment = create.comment(user.url, user.email, undefined, comment, user._id)

            findCommentToComment.nextSibling.append(commentTocomment)
            textarea.value = ''

        } else {

            const postID = idPost
            const user = JSON.parse(sessionStorage.whoAuthorized)
            const comment = textarea.value
            const url = `${port}/posts/${postID}/comments`
            
            const data = createDataForRequest(user.email, user.url, user._id, comment)
            const res = await sendFetch.POSTRequest(url, data)

            // create comment HTML
            const newComment = create.comment(res.userUrl, res.user, res._id, res.comment, res.userID)

            headerComments.append(newComment)
            textarea.value = ''
        }
    })

    sectionComments.append(headerComments)
    sectionComments.append(footerComments)
    wrapper.append(sectionComments)
}

const displayModalPost = async (postID) => {

    const urlComment = `${port}/posts/${postID}/comments`
    const urlPost = `${port}/posts/id${postID}`
    const commentData = await sendFetch.GETRequest(urlComment)
    const postData = await sendFetch.GETRequest(urlPost)

    const modal = document.createElement('div')
    modal.classList.add('modal')

    const modalContent = document.createElement('div')
    modalContent.classList.add('modal__content')

    createPost(modalContent, postData)
    createComments(modalContent, commentData, postData._id)

    modal.append(modalContent)
    document.body.prepend(modal)

    modal.addEventListener('click', (event)=> {
        if (event.target === modal) { 
            modal.remove()
        }
    })
}

const displayPosts = async (wrapper, obj) => {
    const postData = obj

    const htmlElem = document.createElement('div')
    htmlElem.classList.add('user__post')

    const divImg = document.createElement('div')
    divImg.insertAdjacentHTML('afterbegin', `
        <img class="user__img_post" src="${postData.url}" alt="${postData.description}" data-postId="${postData._id}">
    `)

    divImg.addEventListener('click', () => {
        displayModalPost(postData._id)
    })

    htmlElem.append(divImg)
    wrapper.append(htmlElem)
}





//--------------------------------------Signin / #------------------------------------
const callbackFirstPage = async () => {

    displayPage(create.Page(create.loginPage()))

    //-------form------
    const imputsFormSignin =  [
        new Control('inputEmailSignin', [checks.includesAt, checks.minLengthEight]),
        new Control('inputPassSignin', [checks.minLengthEight])
    ]
    const formSignin = new Form (imputsFormSignin, 'inputSubmitSignin')

    formSignin.submitButton.addEventListener('click', async (event) => {
        event.preventDefault()

        const isValid = formSignin.isValidForm()
        const formData = formSignin.getFormData()
    
        if (isValid) {
            const response = await sendFetch.POSTRequest(urls.login, formData)

            if (response.check) {
                setSessionStorage('whoAuthorized', response.user)
                changeLocation('#feeds')
            } else {
                formSignin.showError()
            }
        }

    })
}

//--------------------------------------------Signup--------------------------------------------
const callbackSignupForm = async () => {
    
    displayPage(create.Page(create.registrationPage()))

    //-------form------
    const imputsFormSignup = [
        new Control('inputEmailSignup', [checks.includesAt, checks.minLengthEight]),
        new Control('inputPassSignup', [checks.minLengthEight]),
        new Control('inputPhoneSignup', [checks.minLengthEight, checks.firstLetterPlus]),
        new Control('inputCountrySignup', [checks.minLengthEight])
    ]
    const formSignup = new Form(imputsFormSignup, 'inputSubmitSignup')
 
    
    formSignup.submitButton.addEventListener('click', async (event) => {
        event.preventDefault()
        const isValid = formSignup.isValidForm()
        const formData = formSignup.getFormData()
        
        if (isValid) {
            const response = await sendFetch.POSTRequest(urls.users, formData)
            if (response) {
                changeLocation('#')
            } else {
                formSignup.showError()
            }
        }

    })
}   

//-------------------------------------------Feeds-----------------------------------------------
const callbackFeeds = async () => {
    
    displayPage(create.Page(create.Wrapper(create.Header(), create.AllPosts())))
    displayUserAvatar('div-user-profile')
    
    //pagination 
    let currentPart = 1
    let sizeOfScroll = 350
    
    const paginationPosts = async (currentNum) => {
        const allPostsEl = document.getElementById('all-posts')
        const partOfPosts = await sendFetch.GETRequest(`http://localhost:3000/posts/part${currentNum}`)

        if (partOfPosts) { partOfPosts.forEach((post) => displayPosts(allPostsEl, post)) } 
    }
    paginationPosts(currentPart)

    window.addEventListener('scroll', () => {
       if (window.scrollY >= sizeOfScroll) {
        currentPart++
        sizeOfScroll = sizeOfScroll + 1000
        paginationPosts(currentPart)
       }
    })

}

//-------------------------------------------Main-----------------------------------------------
const callbackMainPage = async () => {

}

//------------------------------------------Profile---------------------------------------------
const callbackProfile = async () => {

    const header = create.Header()
    const profile = create.UserProfile(create.UserData(), create.UserContent())
    const wrapper = create.Wrapper(header, profile)
    displayPage(create.Page(wrapper))
    displayUserAvatar('div-user-avatar', 'div-user-profile')

    //posts creating
    const user = getSessionStorage('whoAuthorized')
    const userContentEl = document.getElementById('user-content')

    const userPosts = await sendFetch.GETRequest(`http://localhost:3000/posts/user${user._id}`)
    if (userPosts) { userPosts.forEach( post => displayPosts(userContentEl, post)) }
}

//-------------------------------------------Create Post-------------------------------------
const callbackCreatePost = async () => {

    const header = create.Header()
    const profile = create.UserProfile(create.UserData(), create.PostCreating())
    const wrapper = create.Wrapper(header, profile)
    displayPage(create.Page(wrapper))
    displayUserAvatar('div-user-avatar', 'div-user-profile')
    
    //post creating
    const user = getSessionStorage('whoAuthorized')
    const inpunFileCreatepost = document.getElementById('inpun-file-createpost')
    const inpunTextCreatepost = document.getElementById('inpun-text-createpost')
    const inpunButtonCreatepost = document.getElementById('inpun-button-createpost')
    const url = `http://localhost:3000/posts/${user._id}`

    inpunButtonCreatepost.addEventListener('click', async () => {
        await sendFetch.POSTImage(inpunFileCreatepost, inpunTextCreatepost, url)
        changeLocation('#profile')
    })

}

//-------------------------------------------Edit-Table-------------------------------------
const callbackEditTable = async () => {
    const header = create.Header()
    const profile = create.UserProfile(create.UserData(), create.EditProfile())
    const wrapper = create.Wrapper(header, profile)
    displayPage(create.Page(wrapper))
    displayUserAvatar('div-user-avatar', 'div-user-profile')


    const upFile = document.getElementById('up-file')
    const formOptionEditTadle = [
        new Control('inputEmailEdit', [checks.includesAt, checks.minLengthEight]),
        new Control('inputPassEdit', [checks.minLengthEight]),
        new Control('inputPhoneEdit', [checks.firstLetterPlus, checks.minLengthEight]),
        new Control('inputCountryEdit', [checks.minLengthEight]),
        new Control('radio-marital-status', 'not checks'),
        new Control('gender-select', 'not checks'),
        new Control('color-mail', 'not checks'),
        new Control('description', 'not checks'),
        new Control('age-user', 'not checks'),
        new Control('checkbox-interests', 'not checks')
    ]
    const formEditTable = new Form(formOptionEditTadle, 'table-button-edit')
    

    upFile.addEventListener('change', async () => {
        const user = getSessionStorage('whoAuthorized')
        const url = `http://localhost:3000/users/${user._id}/avatar`
        await sendFetch.PUTImage(upFile, url)

        await updateUserAvatar()
        displayUserAvatar('div-user-avatar', 'div-user-profile')
    })
    

    formEditTable.submitButton.addEventListener('click', async (event) => {
        event.preventDefault()
        const isValid = formEditTable.isValidForm()
        const formData = formEditTable.getFormData()
        const user = getSessionStorage('whoAuthorized')
        console.log(isValid)
        console.log(formData)
        if (isValid) {
            const url = `http://localhost:3000/users/${user._id}`
            await sendFetch.PUTRequest(url, 'update', formData)
            changeLocation('#profile')
        } else {
            formEditTable.showError()
        }

    })
 }

 //-------------------------------------------Search-------------------------------------
const callbackSearch = async () => {
 

}





 //---------------------------routing-------------
const routes = {
    404: {
        title: "404",
    },

    "#": {
        title: 'Signin',
        script: callbackFirstPage
    },
    
    signup: {
        title: 'Signup',
        script: callbackSignupForm
    },

    main: {
        title: 'Signup',
        script: callbackMainPage
    },

    search: {
        title: 'Search',
        script: callbackSearch
    },

    profile: {
        title: 'Signup',
        script: callbackProfile
    },

    feeds: {
        title: 'Table',
        script: callbackFeeds
    },

    edittable: {
        title: 'Edit Table',
        script: callbackEditTable
    },

    createpost: {
        title: 'Create post',
        script: callbackCreatePost
    }

}; 


const locationHandle = async () => {

    let location = window.location.hash.replace('#', '')

    if (location.length === 0) { location = '#' }
    
    const route = routes[location] || routes[404]
    route.script()
}
window.addEventListener('hashchange', locationHandle)
locationHandle()