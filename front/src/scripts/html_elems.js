
export const create = {
    Page: (content) => {
        const page = document.createElement('div')
        page.classList.add('wrapper_body')
        page.setAttribute('id', 'wrapper_body')
        page.append(content)
        return page
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

    UserData: (userEmail) => {
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
        return userData
    },

    PostCreating: (userEmail) => {
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
    }
}

