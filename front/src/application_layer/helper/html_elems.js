
export const create = {
    Page: (content) => {
        const page = document.createElement('div')
        page.classList.add('wrapper_body')
        page.setAttribute('id', 'wrapper_body')
        page.append(content)
        return page
    },
    
    loginPage: () => {
        const loginPage = document.createElement('div')
        loginPage.classList.add('wrapper')
        loginPage.insertAdjacentHTML('afterbegin', `
        <div class="wrapper_main">

            <div class="side_img"></div>

            <div class="form__container form__signin" id="form-container-signin">

                <div class="form_header">
                    <h2 class="form__title">Instagram</h2>
                    <form class="form__signin" id="form-signin" action="#">
                        <input class="form__input input__signin_email" id="inputEmailSignin" type="email" name="email" placeholder="Email" id="email">
                        <input class="form__input input__signin_password" id="inputPassSignin" type="password" name="password" placeholder="Password">
                        <input class="form__button input__signin_submit" id="inputSubmitSignin" type="button" value="Log in">
                    </form>
                    <span class="form__border">Or</span>
                    <span class="form__span_facebook">Login with Facebook</span>
                </div>

                <div class="form__footer">
                    <span class="form__text">Have no account yet?</span>
                    <a href="#signup" class="form__link_switch" id="switch-signin">Sign up</a>
                </div>

            </div>

        </div>

        <div class="footer_img"></div>
        `)
        return loginPage
    },



    
    registrationPage: () => {
        const registrationPage = document.createElement('div')
        registrationPage.classList.add('wrapper')
        registrationPage.insertAdjacentHTML('afterbegin', `
            <div class="form__container form__signup" id="form-container-signin">

                <div class="form_header">
                    <h2 class="form__title">Instagram</h2>
                    <span class="form__title_description">Register to see photos and videos of your friends.</span>
                    <button class="form__button"><span class="form__span_facebook">Login with Facebook</span></button>
                    <span class="form__border">Or</span>
                    <form class="form__signin" id="form-signin" action="#">
                        <input class="form__input" id="inputEmailSignup" type="email" name="email" placeholder="Email" id="email">
                        <input class="form__input" id="inputPassSignup" type="password" name="password" placeholder="Password">
                        <input class="form__input" id="inputPhoneSignup" type="tel" name="phone" placeholder="Phone">
                        <input class="form__input" id="inputCountrySignup" type="text" name="country" placeholder="Country">
                        <input class="form__button" id="inputSubmitSignup" type="submit" value="Registration">
                    </form>
                    <span class="form__span_facebook">Login with Facebook</span>
                </div>

                <div class="form__footer">
                    <span class="form__text">Have an account?</span>
                    <a href="#" class="form__link_switch">Sign in</a>
                </div>

            </div>
        `)

        return registrationPage
    },

    Header: () => {
        const header = document.createElement('div')
        header.classList.add('wrapper_header')
        header.insertAdjacentHTML('afterbegin', `
        <header class="header">
            <h1 class="header__title">Instagram</h1>
            <nav class="header__nav">
                <button class="header__button" id="header-button-main"><span class="nav__span nav__span_main">Main</span></button>
                <button class="header__button" id="header-button-search"><span class="nav__span nav__span_search">Search</span></button>
                <button class="header__button" id="header-button-feeds"><span class="nav__span nav__span_interesting">Feeds</span></button>
                <button class="header__button" id="header-button-messages"><span class="nav__span nav__span_messages">Messages</span></button>
                <button class="header__button" id="header-button-reels"><span class="nav__span nav__span_reels">Reels</span></button>
                <button class="header__button" id="header-button-notification"><span class="nav__span nav__span_notification">Notification</span></button>
                <button class="header__button" id="header-button-create"><span class="nav__span nav__span_create">Create</span></button>
                <button class="header__button" id="header-button-profile"><div class="header_user_avatar" id="div-user-profile"></div><span class="nav__span nav__span_profile" >Profile</span></button>
                <button class="header__button header__button_last" id="header-button-more"><span class="nav__span nav__span_more">More</span></button>
            </nav>
        </header>
        `)
        
        const allButtons = Array.prototype.slice.call(header.querySelectorAll('.header__button'))
        allButtons.forEach( elem => {
            const stringToArray = elem.id.split('-')
            const hash = `#${stringToArray[stringToArray.length - 1]}`

            elem.addEventListener('click', () => location.hash = hash)
        })
    
        return header
    },

    Wrapper: (header, content) => {
        const wrapper = document.createElement('div')
        wrapper.classList.add('wrapper')
        const divWrap = document.createElement('div')
        divWrap.classList.add('div_wrap')
        divWrap.append(header)
        divWrap.append(content)
        wrapper.append(divWrap)
        return(wrapper)
    },

    AllPosts: () => {
        const wrapper = document.createElement('div')
        const posts = document.createElement('div')
        wrapper.classList.add('wrapper__posts')
        posts.classList.add('posts__list')
        posts.setAttribute('id', 'all-posts')
        wrapper.append(posts)
        return wrapper
    },

    UserProfile: (data, content) => {
        const profile = document.createElement('div')
        profile.classList.add('user__profile')
        profile.append(data)
        profile.append(content)
        return profile
    },

    UserContent: () => {
        const content = document.createElement('div')
        content.classList.add('user__content')
        content.setAttribute('id', 'user-content')
        return content
    },

    UserData: () => {
        const userEmail = JSON.parse(sessionStorage.getItem('whoAuthorized')).email
        
        const userData = document.createElement('div')
        userData.classList.add('user__data')
        userData.insertAdjacentHTML('afterbegin', `
            <div class="div_user_avatar" id="div-user-avatar"></div>
            <div class="wrap_data">
                <span class="data__user_email">${userEmail}</span>
                <button class="data__user_button" id="user-button-edit">Edit profile</button>
                <button class="data__user_button">Advertising Tools</button>
                <button class="data__user_create" id="user-button-create">Create post</button>
            </div>
        `)

        const userButtonEdit = userData.querySelector('#user-button-edit')
        const userButtonCreate = userData.querySelector('#user-button-create')
        userButtonCreate.addEventListener('click', () => location.hash = '#createpost')
        userButtonEdit.addEventListener('click', () => location.hash = '#edittable')
        return userData
    },

    PostCreating: () => {
        
        const postCreating = document.createElement('div')
        postCreating.classList.add('wrap_create__post')
        postCreating.setAttribute('id', 'wrap-create-post')
        postCreating.insertAdjacentHTML('afterbegin', `
            <h2>Create post</h2>
            <input class="table__button button_avatar create_input" id="inpun-file-createpost" name="${userEmail}" type="file">
            <input class="create__post_text" id="inpun-text-createpost" type="text" placeholder="Edd some text..">
            <button class="table__button create__post_button" id="inpun-button-createpost">post</button>
        `)
        return postCreating
    },

    EditProfile: () => {
        const userEmail = JSON.parse(sessionStorage.getItem('whoAuthorized')).email
        const editProfile = document.createElement('div')
        editProfile.classList.add('modal__table_inputs')
        editProfile.insertAdjacentHTML('afterbegin', `
            <form class="modal_table_form" id="modal-table-form" action="#">  
                <div class="table_div"> 
                    <span class="table__span">avatar:</span>
                    <input class="table__button button_avatar" id="up-file" name="${userEmail}" type="file">
                </div>

                <div class="table_div">
                    <span class="table__span">email:</span>
                    <input class="table__input table__input_email input" id="inputEmailEdit" name="email" type="email" placeholder="Email">
                </div>
                <div class="table_div">
                    <span class="table__span">pass:</span>
                    <input class="table__input table__input_password input" id="inputPassEdit" name="password" type="text"  placeholder="Password">
                </div>
                <div class="table_div">
                    <span class="table__span">phone:</span>
                    <input class="table__input table__input_phone input" id="inputPhoneEdit" name="phone" type="text" placeholder="Phone">
                </div>
                <div class="table_div">
                    <span class="table__span">country:</span>
                    <input class="table__input table__input_country input" id="inputCountryEdit" name="country" type="text" placeholder="Country">
                </div>
                <div class="table_div">
                    <span class="table__span">gender:</span>
                    <select class="table__input input" name="gender" id="gender-select">
                        <option value="male">male</option>
                        <option value="woman">woman</option>
                    </select>
                </div>


                <div class="table_div" name="checkbox" id="checkbox-interests">
                    <span class="table__span">Interests:</span>
                    <div>
                        <div class="table__input">
                            <input type="checkbox" id="first-checkbox" value="first checkbox">
                            <label for="first-checkbox">first checkbox</label>
                        </div>
                        <div class="table__input">
                            <input type="checkbox" id="second-checkbox" value="second checkbox">
                            <label for="second-checkbox">second checkbox</label>
                        </div>
                        <div class="table__input">
                            <input type="checkbox" id="third-checkbox" value="third checkbox">
                            <label for="third-checkbox">third checkbox</label>
                        </div>
                    </div>
                </div>

                <div class="table_div">
                    <span class="table__span">Marital status:</span>
                    <div class="table__input  radio_container" name="status" id="radio-marital-status" data-radio-container>
                        <input class="radio_married" type="radio" name="marital-status" value="married">
                        <input class="radio_single" type="radio" name="marital-status" value="single">
                    </div>
                </div>
                
                <div class="table_div">
                    <span class="table__span">color:</span>
                    <input class="input__color input" type="color" name="color" id="color-mail">
                </div>

                <div class="table_div">
                    <span class="table__span">About you:</span>
                    <textarea class="table__input input" id="description" name="description" placeholder="Tell about yourself:" rows="5" cols="33"></textarea>
                </div>
                <div class="table_div">
                    <span class="table__span">Age:</span>
                    <input class="table__input input" type="number" name="age" id="age-user">
                </div>
            </form>

            <button class="table__button" id="table-button-edit" data-table-btn-confirmedit="${userEmail}">edit</button>
        `)
        return editProfile
    },

    footerComments: () => {
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
    },

    comment:  (userUrl, user, commentID, comment, userID) => {
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
    },
    

}

