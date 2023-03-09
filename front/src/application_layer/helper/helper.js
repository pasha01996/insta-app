import Adapter from '../../adapters/Adapter.js'
import { URL_FOR_POSTS, URL_FOR_COMMENTS, URL_FOR_COMMENTS_TO_COMMENT, URL_FOR_USERS, METHOD_PUT, METHOD_POST } from './constants.js'



const adapter = new Adapter()

export const changeLocation = (hash) => {
    location.hash = `${hash}`
}

export const renderPage = async (htmlElem) => {
    await new Promise((res, rej) => res(document.body.innerHTML = htmlElem))
}

export const displayUserAvatar = async (...args) => {
    const user = adapter.getSessionStorage('whoAuthorized')
    args.forEach( elem => {
        const userImg = document.getElementById(elem)
        userImg.style.backgroundImage = `url(${user.url})`
    })
}

export const displayUserEmail = (...args) => {
    const user = adapter.getSessionStorage('whoAuthorized')
    args.forEach( elem => {
        const userEmail = document.getElementById(elem)
        userEmail.textContent = `${user.email}`
    })

}

export const updateUserAvatar = async () => {
    const user = adapter.getSessionStorage('whoAuthorized')
    const res = await adapter.sendGetRequest(`${URL_FOR_USERS}/${user._id}`)
    adapter.setSessionStorage('whoAuthorized', res)
}

export const createDataForImg = (input, name, inputText) => {
    const formData = new FormData()
    formData.append(name, input.files[0])
    formData.append('filename', input.name)
    formData.append('description', inputText.value)
    return formData
}

const createDataForRequest = (userEmail, userUrl, userId, comment) => {
    const body = {}
    body['user'] = userEmail
    body['userUrl'] = userUrl
    body['userID'] = userId
    body['comment'] = comment
    return body
}




const footerComments = () => {
    const footerComments = document.createElement('div')
    footerComments.classList.add('modal__container_comment')
    footerComments.insertAdjacentHTML('afterbegin', `
        <div class="modal__container_commentToComment"></div>
        <div class="modal__container_textarea">
            <textarea class="modal__post_textarea" placeholder="Add comments..."></textarea>
            <button class="modal__post_button">Post</button>
        </div>
    `)
    return footerComments
}

const comment = (userUrl, user, commentID, comment, userID) => {
    const mainComment = document.createElement('div')
    mainComment.classList.add('modal__wrapper_comment')
    mainComment.dataset.idComment = commentID
    mainComment.insertAdjacentHTML('afterbegin', `
        <img src=${userUrl} class="modal__img_user">
        <div>
            <div class="modal__div_user">${user}</div>
            <div class="modal__div_comment">${comment}</div>
            <div class="modal__div_answer" data-email=${user}>Answer</div>
        </div>
        <span class="modal__span_delete" data-comment-id=${commentID} data-user-id=${userID}>&times;</span>
    `)
    const divCommentsForComment = document.createElement('div')
    divCommentsForComment.classList.add('modal__wrapper_comments_for_comment')
    mainComment.append(divCommentsForComment)
    return mainComment
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
        const user = adapter.getSessionStorage('whoAuthorized')
        const data = {like: user._id}
        await adapter.sendDataToServer(`${URL_FOR_POSTS}/like${postData._id}`, data, METHOD_PUT)
    
        const req = await adapter.sendGetRequest(`${URL_FOR_POSTS}/id${postData._id}`).json()
        if(req.like) span1.innerText = req.like.length
        if (req.unlike) span2.innerText = req.unlike.length
    })

    unlikeBtn.addEventListener('click', async () => {
        const user = adapter.getSessionStorage('whoAuthorized') 
        const data = {unlike: user._id}
        await adapter.sendDataToServer(`${URL_FOR_POSTS}/like${postData._id}`, data, METHOD_PUT)

        const req = await adapter.sendGetRequest(`${URL_FOR_POSTS}/id${postData._id}`).json()
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


    const footerComments = footerComments()
    const btnFooterComments = footerComments.querySelector('.modal__post_button')
    const divUserToComment = footerComments.querySelector('.modal__container_commentToComment')
    const textarea = footerComments.querySelector('.modal__post_textarea')

    if (commentData) {
        commentData.forEach((elem) => {
            //create main comment
            const mainComment = comment(elem.userUrl, elem.user, elem._id, elem.comment, elem.userID)
            const divCommentsForComment = mainComment.querySelector('.modal__wrapper_comments_for_comment')
            const buttonAnswer = mainComment.querySelector('.modal__div_answer')
            const buttonDelete = mainComment.querySelector('.modal__span_delete')

            //create comment for comment
            if(elem.commentsThisComment) {
                elem.commentsThisComment.forEach((elem) => {
                const secondComment = comment(elem.userUrl, elem.user, elem._id, elem.comment, elem.userID)  
                divCommentsForComment.append(secondComment)
                })
                
            }

            //add events
            buttonDelete.addEventListener('click', async (event) => {
                const user = adapter.getSessionStorage('whoAuthorized')
                const userWantDeleteID = event.target.dataset.userId
               
                if (user._id === userWantDeleteID) {
                    const commentID = event.target.dataset.commentId
                    await adapter.sendDeleteRequest(`${URL_FOR_COMMENTS}/${commentID}`)
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
            const user = adapter.getSessionStorage('whoAuthorized')
            const comment = textarea.value
            const data = createDataForRequest(user.email, user.url, user._id, comment)
            await adapter.sendDataToServer(`${URL_FOR_COMMENTS_TO_COMMENT}/${commentID}`, data, METHOD_POST)
            
            // create comment HTML
            const allComments = Array.prototype.slice.call(document.querySelectorAll('.modal__wrapper_comment'))
            const findCommentToComment = allComments.find(elem => elem.dataset.idComment === event.target.dataset.commentTo)
            const commentTocomment = comment(user.url, user.email, undefined, comment, user._id)

            findCommentToComment.nextSibling.append(commentTocomment)
            textarea.value = ''

        } else {

            const postID = idPost
            const user = adapter.getSessionStorage('whoAuthorized')
            const comment = textarea.value
            
            const data = createDataForRequest(user.email, user.url, user._id, comment)
            const res = await (await adapter.sendDataToServer(`${URL_FOR_COMMENTS}/${postID}`, data, METHOD_POST)).json()

            // create comment HTML
            const newComment = comment(res.userUrl, res.user, res._id, res.comment, res.userID)

            headerComments.append(newComment)
            textarea.value = ''
        }
    })

    sectionComments.append(headerComments)
    sectionComments.append(footerComments)
    wrapper.append(sectionComments)
}

const displayModalPost = async (postID) => {

    const commentData = await adapter.sendGetRequest(`${URL_FOR_COMMENTS}/${postID}`).json()
    const postData = await sendFetch.GETRequest(`${URL_FOR_POSTS}/id${postID}`).json()

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

export const displayPosts = async (wrapper, obj) => {
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