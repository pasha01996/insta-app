import {isRegistered} from "./scripts/Page.js"
import {isAuthorized} from "./scripts/Page.js"
import {Form} from "./scripts/Form.js"
import {Control} from "./scripts/Control.js"
import {checks} from "./scripts/module.js"
import {Table} from "./scripts/Table.js"
import {Page} from "./scripts/Page.js"
import {radio} from "./scripts/radio.js"

import "./styles/header.css" 
import "./styles/style.css" 
import "./styles/modal.css" 
import "./styles/form.css" 
import "./styles/table.css"
import "./styles/edit_form_table.css"
import "./styles/user_profile.css"


//-------------------------------------Modal-----------------------------------------




const creatingHTML = async (wrapper, htmlElem) => {
    await new Promise((res, rej) => res(document.getElementById(wrapper).replaceWith(htmlElem)))
}

//--------------------------------------Signin / #------------------------------------
const callbackFirstPage = async () => {

    const htmlElem = document.createElement('div')
    htmlElem.classList.add('wrapper_body')
    htmlElem.setAttribute('id', 'wrapper_body')
    htmlElem.insertAdjacentHTML('afterbegin', `
    <div class="wrapper">
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
    </div>
    `)

    creatingHTML('wrapper_body', htmlElem)

    

    //-----for form work
    const inputSubmitSignin = document.getElementById('inputSubmitSignin')

    const formOptionSignin = {
        inputs: [new Control('inputEmailSignin', [checks.includesAt, checks.minLengthEight]),
                new Control('inputPassSignin', [checks.minLengthEight])],
    }

    const pageOptions = {
        elements: {formSignin: new Form('form-container-signin', formOptionSignin)},
        btn: {submitSignin: inputSubmitSignin},             
    }

    const page = new Page(pageOptions)

    page.btn.submitSignin.addEventListener('click', async (event) => {

        await page.authorization(event)
        if(isAuthorized) {
            location.hash = '#main'
        }
    })

}

//--------------------------------------------Signup--------------------------------------------
const callbackSignupForm = async () => {

    const htmlElem = document.createElement('div')
    htmlElem.classList.add('wrapper_body')
    htmlElem.setAttribute('id', 'wrapper_body')
    htmlElem.insertAdjacentHTML('afterbegin', `
    <div class="wrapper">
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
    </div>
    `)

    creatingHTML('wrapper_body', htmlElem)
    
    
    const inputSubmitSignup = document.getElementById('inputSubmitSignup')
    
    const formOptionSignup = {
        inputs:[new Control('inputEmailSignup', [checks.includesAt, checks.minLengthEight]),
                new Control('inputPassSignup', [checks.minLengthEight]),
                new Control('inputPhoneSignup', [checks.minLengthEight, checks.firstLetterPlus]),
                new Control('inputCountrySignup', [checks.minLengthEight])],
    }
    
    const pageOptions = {
        elements: {formSignup: new Form('form-container-signup', formOptionSignup)},
        btn: { submitSignup: inputSubmitSignup},             
        nameOfStorage: 'registration'
    }

    const page = new Page(pageOptions)
    
    page.btn.submitSignup.addEventListener('click', async (event) => {
        page.registration(event)
        if (isRegistered) {location.hash = '#'}
    })
}   

//-------------------------------------------Main-----------------------------------------------
const callbackMainPage = async () => {

    const htmlElem = document.createElement('div')
    htmlElem.classList.add('wrapper_body')
    htmlElem.setAttribute('id', 'wrapper_body')
    htmlElem.insertAdjacentHTML('afterbegin', `
    <div class="wrapper">
        <div class="div_wrap">
            <div class="wrapper_header">
                <header class="header">
                    <h1 class="header__title">Instagram</h1>
                    <nav class="header__nav">
                        <button class="header__button" id="header-button-main"><span class="nav__span nav__span_main">Main</span></button>
                        <button class="header__button" id="header-button-search"><span class="nav__span nav__span_search">Search</span></button>
                        <button class="header__button" id="header-button-interesting"><span class="nav__span nav__span_interesting">Interesting</span></button>
                        <button class="header__button" id="header-button-messages"><span class="nav__span nav__span_messages">Messages</span></button>
                        <button class="header__button" id="header-button-reels"><span class="nav__span nav__span_reels">Reels</span></button>
                        <button class="header__button" id="header-button-notification"><span class="nav__span nav__span_notification">Notification</span></button>
                        <button class="header__button" id="header-button-create"><span class="nav__span nav__span_create">Create</span></button>
                        <button class="header__button" id="header-button-profile"><span class="nav__span nav__span_profile">Profile</span></button>
                        <button class="header__button header__button_last" id="header-button-more"><span class="nav__span nav__span_more">More</span></button>
                    </nav>
                </header>
            </div> 

            <div class="content"></div>
        </div>
    </div>
    `)

    creatingHTML('wrapper_body', htmlElem)

    const headerButtonProfile = document.getElementById('header-button-profile')
    headerButtonProfile.addEventListener('click', () => {location.href = '#profile'})


}

//------------------------------------------Profile---------------------------------------------
const callbackProfile = async () => {

    const check = sessionStorage.getItem('isAuthorized')
    const user = sessionStorage.getItem('whoAuthorized')

    const htmlElem = document.createElement('div')
    htmlElem.classList.add('wrapper_body')
    htmlElem.setAttribute('id', 'wrapper_body')
    htmlElem.insertAdjacentHTML('afterbegin', `
    <div class="div_wrap">
        <div class="wrapper_header">
            <header class="header">
                <h1 class="header__title">Instagram</h1>
                <nav class="header__nav">
                    <button class="header__button"><span class="nav__span nav__span_main">Main</span></button>
                    <button class="header__button"><span class="nav__span nav__span_search">Search</span></button>
                    <button class="header__button"><span class="nav__span nav__span_interesting">Interesting</span></button>
                    <button class="header__button"><span class="nav__span nav__span_messages">Messages</span></button>
                    <button class="header__button"><span class="nav__span nav__span_reels">Reels</span></button>
                    <button class="header__button"><span class="nav__span nav__span_notification">Notification</span></button>
                    <button class="header__button"><span class="nav__span nav__span_create">Create</span></button>
                    <button class="header__button"><span class="nav__span nav__span_profile">Profile</span></button>
                    <button class="header__button header__button_last"><span class="nav__span nav__span_more">More</span></button>
                </nav>
            </header>
        </div> 

        <div class="user__profile">

            <div class="user__data">
                <img src="" alt="unknown_user">
                <div class="wrap_data">
                    <span class="data__user_email">${user}</span>
                    <button class="data__user_button" id="user-button-edit">Edit profile</button>
                    <button class="data__user_button">Advertising Tools</button>
                    <button class="data__user_create" id="user-button-create">Create post</button>
                </div>
            </div>

            <div class="user__content"></div>

        </div>
    </div>

    `)
    creatingHTML('wrapper_body', htmlElem)

    const userButtonEdit = document.getElementById('user-button-edit')
    const userButtonCreate = document.getElementById('user-button-create')

    userButtonEdit.addEventListener('click', () => location.hash = '#edittable')

}

//-----------------------------------------Table----------------------------------------------
const callbackTable = async () => {

    const check = sessionStorage.getItem('isAuthorized')

    async function sendGETRequest(url) {
        return await fetch(url).then(response => { return response.json() })
    }

    function createTable(users, container) {
        if (users) {
            for(let i = 0; i < users.length; i++) {
                createCell(users[i].email, container)
            }
        }  
    }

    function createCell(userEmail, container) {
        const elem = document.getElementById(container)
        if (userEmail) { 
            return elem.insertAdjacentHTML('afterbegin', `
            <div class="table__user">
                <div class="table__conteiner">
                    <span class="item__description">user:</span>
                    <span class="item__name">${userEmail}</span>
                    <div class="item__buttons">
                        <button class="table_btn_edit" data-table-btn-edit="${userEmail}">edit</button>
                        <button class="table_btn_delete" data-table-btn-delete="${userEmail}">delete</button>
                        <button class="table_btn_view" data-table-btn-view="${userEmail}">view</button>
                    </div>
                </div>
            </div>
            `)  
        }
    }

    await sendGETRequest('http://localhost:3000/getusers')
        .then(data => createTable(data, 'table-users'))



    const tableBtnEditEl = document.querySelector('#tableBody')
    const tableBtnDeleteEl = document.querySelector('#tableBtnDelete')
    const tableBtnViewEl = document.querySelector('.table_btn_view')
    const tableUsers = document.querySelector('#table-users')

    const modalConteiner = document.querySelector('#modalConteiner')
    const modalText = document.querySelector('#modalText')
    const modalContent = document.querySelector('#modalContent')
    const modalBtn = document.querySelector('#modalBnt')
    const forEditTable = document.querySelector('#for-edit-table')
 
    const tableOption = {
        container: tableUsers,
        btn: {edit: tableBtnEditEl, delete: tableBtnDeleteEl, view: tableBtnViewEl},
        modal: {container: modalConteiner, forEditTable: forEditTable,content: modalContent, text: modalText, btn: modalBtn, textValue: ''},
    }

    const pageOptions = { elements: {table: new Table('table-users', tableOption)} }

    const page = new Page(pageOptions)

    page.sendGETRequest('http://localhost:3000/getusers')
        .then(data => page.users = data)


//------????????????????
    page.elements.table.container.addEventListener('click', (event) => {
        if (event.target.dataset.tableBtnView) {
            sessionStorage.setItem('userWhoView', event.target.dataset.tableBtnView)
            location.hash = '#viewtable'
        }
    })
    
//------???????????????? (???? ?????????? ????????????????????)
    page.elements.table.container.addEventListener('click', event => {
        if (event.target.dataset.tableBtnEdit) {
            sessionStorage.setItem('userWhoEdit', event.target.dataset.tableBtnEdit)
            location.hash = '#edittable'
            radio()
        }
    })
    
}

//-------------------------------------------Edit-Table-------------------------------------
const callbackEditTable = async () => {

    const check = sessionStorage.getItem('isAuthorized')
    const user = sessionStorage.getItem('whoAuthorized')
    

    const htmlElem = document.createElement('div')
    htmlElem.classList.add('wrapper_body')
    htmlElem.setAttribute('id', 'wrapper_body')
    htmlElem.insertAdjacentHTML('afterbegin', `
    <div class="div_wrap">
        <div class="wrapper_header">
            <header class="header">
                <h1 class="header__title">Instagram</h1>
                <nav class="header__nav">
                    <button class="header__button"><span class="nav__span nav__span_main">Main</span></button>
                    <button class="header__button"><span class="nav__span nav__span_search">Search</span></button>
                    <button class="header__button"><span class="nav__span nav__span_interesting">Interesting</span></button>
                    <button class="header__button"><span class="nav__span nav__span_messages">Messages</span></button>
                    <button class="header__button"><span class="nav__span nav__span_reels">Reels</span></button>
                    <button class="header__button"><span class="nav__span nav__span_notification">Notification</span></button>
                    <button class="header__button"><span class="nav__span nav__span_create">Create</span></button>
                    <button class="header__button"><span class="nav__span nav__span_profile">Profile</span></button>
                    <button class="header__button header__button_last"><span class="nav__span nav__span_more">More</span></button>
                </nav>
            </header>
        </div> 

        <div class="user__profile">

            <div class="user__data">
                <div class="user__avatar" id="user-avatar"></div>
                <div class="wrap_data">
                    <span class="data__user_email">${user}</span>
                    <button class="data__user_button" id="user-button-edit">Edit profile</button>
                    <button class="data__user_button">Advertising Tools</button>
                    <button class="data__user_create" id="user-button-create">Create post</button>
                </div>
            </div>

            <div class="modal__table_inputs">
                <form class="modal_table_form" id="modal-table-form" action="#">  
                    <div class="table_div"> 
                        <span class="table__span">avatar:</span>
                        <input class="table__button button_avatar" id="up-file" name="${user}" type="file">
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

                <button class="table__button" data-table-btn-confirmedit="${user}">edit</button>
                <button class="table__button button_close" id="table-button-close">close</button>
            </div>

        </div>
    </div>

    `)
    creatingHTML('wrapper_body', htmlElem)

    const userAvatar = document.getElementById('user-avatar')
    const upFile = document.getElementById('up-file')

    const tableButtonClose = document.getElementById('table-button-close')
    const modalConteiner = document.querySelector('#modalConteiner')
    const modalText = document.querySelector('#modalText')
    const modalContent = document.querySelector('#modalContent')
    const modalBtn = document.querySelector('#modalBnt')
    const forEditTable = document.querySelector('#for-edit-table')

    const tableOption = {
        modal: {container: modalConteiner, forEditTable: forEditTable,content: modalContent, text: modalText, btn: modalBtn, textValue: ''},
    }
    const pageOptions = { elements: {table: new Table('table-users', tableOption)} }
    const page = new Page(pageOptions)
    
    const formOptionEditTadle = {
        inputs: [new Control('inputEmailEdit', [checks.includesAt, checks.minLengthEight]),
                new Control('inputPassEdit', [checks.minLengthEight]),
                new Control('inputPhoneEdit', [checks.minLengthEight, checks.firstLetterPlus]),
                new Control('inputCountryEdit', [checks.minLengthEight]),
                new Control('radio-marital-status', 'not checks'),
                new Control('gender-select', 'not checks'),
                new Control('color-mail', 'not checks'),
                new Control('description', 'not checks'),
                new Control('age-user', 'not checks'),
                new Control('checkbox-interests', 'not checks')
            ]
    }
    page.elements.formEditTable = new Form('form-container-edit', formOptionEditTadle)
    
    upFile.addEventListener('change', async () => {
        const img = upFile.files[0]
        
        const reader = new FileReader()
        reader.readAsDataURL(img)
        reader.onload = () => {
            const url = reader.result
            const img = new Image()
            img.src = url
            userAvatar.appendChild(img)
        }
        
        await page.sendImage(upFile)
    })
    

//-------?????? ???????? ?????? ???????????? ???????????????????? ???????? 
    page.elements.table.modal.btn.addEventListener('click', () => {
        page.elements.table.closeModal()
        location.hash = '#profile'
    })

    page.elements.table.modal.container.addEventListener('click', async (event) => {
        if(event.target.dataset.tableBtnConfirmedit) {
            await page.onclickEditTable()
            page.elements.table.closeModal()
            location.hash = '#profile'
        }
    })

    tableButtonClose.addEventListener('click', () => location.hash = '#profile')
 }

 //-------------------------------------------View-Table-------------------------------------
 const callbackViewTable = async () => {

    const check = sessionStorage.getItem('isAuthorized')
    const userWhoView = sessionStorage.getItem('userWhoView')
    cleanPage('form-wrapper')
    cleanPage('table-users')

//----?????? ???????? ?????????????? ???????????????? ?????? ???????????????? ???????????????????? ???? ?????? ???? ????????????????
if(check) {
    async function sendGETRequest(url) {
        return await fetch(url).then(response => { return response.json() })
    }

    function createTable(users, container) {
        if (users) {
            for(let i = 0; i < users.length; i++) {
                createCell(users[i].email, container)
            }
        }  
    }

    function createCell(userEmail, container) {
        const elem = document.getElementById(container)
        if (userEmail) { 
            return elem.insertAdjacentHTML('afterbegin', `
            <div class="table__user">
                <span class="item__description">user:</span>
                <span class="item__name">${userEmail}</span>
                <div class="item__buttons">
                    <button class="table_btn_edit" data-table-btn-edit="${userEmail}">edit</button>
                    <button class="table_btn_delete" data-table-btn-delete="${userEmail}">delete</button>
                    <button class="table_btn_view" data-table-btn-view="${userEmail}">view</button>
                </div>
            </div>
            `)  
        }
    }

    await sendGETRequest('http://localhost:3000/getusers')
        .then(data => createTable(data, 'table-users'))
}  

    const tableBtnEditEl = document.querySelector('#tableBody')
    const tableBtnDeleteEl = document.querySelector('#tableBtnDelete')
    const tableBtnViewEl = document.querySelector('.table_btn_view')
    const tableUsers = document.querySelector('#table-users')

    const modalConteiner = document.querySelector('#modalConteiner')
    const modalText = document.querySelector('#modalText')
    const modalContent = document.querySelector('#modalContent')
    const modalBtn = document.querySelector('#modalBnt')
    const forEditTable = document.querySelector('#for-edit-table')

    const tableOption = {
        container: tableUsers,
        btn: {edit: tableBtnEditEl, delete: tableBtnDeleteEl, view: tableBtnViewEl},
        modal: {container: modalConteiner, forEditTable: forEditTable,content: modalContent, text: modalText, btn: modalBtn, textValue: ''},
    }

    const pageOptions = { elements: {table: new Table('table-users', tableOption)} }

    const page = new Page(pageOptions)

    page.elements.table.viewTableItem(userWhoView, check)


//-------?????? ???????? ?????? ???????????? ???????????????????? ???????? 
    
    //------????????????????
    page.elements.table.modal.btn.addEventListener('click', (event) => {
        page.deleteEditForm()
        page.elements.table.closeModal()
        location.hash = '#table'
    })
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

    profile: {
        title: 'Signup',
        script: callbackProfile
    },
    
    table: {
        title: 'Table',
        script: callbackTable
    },

    edittable: {
        title: 'Edit Table',
        script: callbackEditTable
    },

    viewtable: {
        title: 'View Table',
        script: callbackViewTable
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