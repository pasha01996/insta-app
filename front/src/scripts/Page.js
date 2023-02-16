import { checks } from "./module"

export let isAuthorized = false
export let isRegistered = false


export class Page {
    constructor(options) {
        this.elements = options.elements
        this.btn = options.btn
        this.users
    }  
    
    async sendPOSTRequest(url, body) {
        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            cache: 'default'
        }).then(response => { return response.json() })
    }

    async sendPUTRequest(url, body) {
        return await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
            mode: 'cors',
            cache: 'default'
        }).then(response => { return response.json() })
    }

    async sendGETRequest(url) {
        return await fetch(url).then(response => { return response.json() })
    }


    async sendImage(input, url) {
        const formData = new FormData()
        formData.append('avatar', input.files[0])
        formData.append('filename', input.name)
        return await fetch(url, {
            method: 'POST',
            body: formData
        })
    }
    
    async registration(event) {
        event.preventDefault()

        const userData = {}
        for (let i = 0; i < this.elements.formSignup.inputs.length; i++) { 
            userData[this.elements.formSignup.getAttributes()[i]] = this.elements.formSignup.getValues()[i]
        }

        if (this.elements.formSignup.isValidForm()) {
            this.sendPOSTRequest('http://localhost:3000/users', userData)
            console.log('isRegistered = true')
            isRegistered = true
        } else {
            console.log('isRegistered = false')
            isRegistered = false 
        }
    }

    async authorization(event) {
        event.preventDefault()
        const userData = {}
        for (let i = 0; i < this.elements.formSignin.inputs.length; i++) { 
            userData[this.elements.formSignin.getAttributes()[i]] = this.elements.formSignin.getValues()[i]
        }   

        if (this.elements.formSignin.isValidForm()) {
            const response = await this.sendPOSTRequest('http://localhost:3000/login', userData)
            if (response) { 
                isAuthorized = true 
                sessionStorage.setItem('whoAuthorized', JSON.stringify(response))
                sessionStorage.setItem('isAuthorized', isAuthorized)
            } else { 
                isAuthorized = false 
            }
            console.log('isAuthorization =',  isAuthorized) 
        } else {
            console.log('isAuthorization =', isAuthorized) 
        }
}

    
//------------------------------TABLE-----------------------------------
    createTable(users, container) {
        if (users) {
            for(let i = 0; i < users.length; i++) {
                this.createCell(users[i].email, container)
            }
        }  
    }

    createCell(userEmail, container) {
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

    createModalTable(userEmail, check) {
        if (check) {
            this.emailUserToFind = userEmail
            this.elements.table.createModal("")

            this.createEditForm(this.emailUserToFind)

            this.elements.table.modal.container.classList.add('table-active')
           
        } else {
            this.elements.table.createModal('Please login for using this interface')
        }
    }

    async onclickEditTable() {

        const user = JSON.parse(sessionStorage.getItem('whoAuthorized')) 
        console.log(user)
        const userData = {}
        for (let i = 0; i < this.elements.formEditTable.inputs.length; i++) { 
            userData[this.elements.formEditTable.getAttributes()[i]] = this.elements.formEditTable.getValues()[i]
        }
        console.log(userData)
        this.sendPUTRequest(`http://localhost:3000/users/${user.id}`, userData)
        sessionStorage.setItem('whoAuthorized', JSON.stringify(userData))
    }

    
    createEditForm(userEmail) {
        const htmlElem = document.createElement('div')
        htmlElem.classList.add('modal__table')
        htmlElem.setAttribute('id','form-container-edit')
        htmlElem.insertAdjacentHTML('afterbegin', `
        <span class="modal__table_title">Edit data:</span>
        <div class="modal__table_inputs">
            <form class="modal_table_form" id="modal-table-form" action="#">
                <input class="table__input_email" id="inputEmailEdit" name="email" type="email" placeholder="Email">
                <input class="table__input_password" id="inputPassEdit" name="password" type="text"  placeholder="Password">
                <input class="table__input_phone" id="inputPhoneEdit" name="phone" type="text" placeholder="Phone">
                <input class="table__input_country" id="inputCountryEdit" name="country" type="text" placeholder="Country">
                <p>And more:</p>
                <div>
                    <label for="gender-select">Gender:</label>
                    <select name="gender" id="gender-select">
                        <option value="male">male</option>
                        <option value="woman">woman</option>
                    </select>
                </div>
                <div name="checkbox" id="checkbox-interests">
                    <p>Interests:</p>
                    <div>
                        <input type="checkbox" id="first-checkbox" value="first checkbox">
                        <label for="first-checkbox">first checkbox</label>
                    </div>
                    <div>
                        <input type="checkbox" id="second-checkbox" value="second checkbox">
                        <label for="second-checkbox">second checkbox</label>
                    </div>
                    <div>
                        <input type="checkbox" id="third-checkbox" value="third checkbox">
                        <label for="third-checkbox">third checkbox</label>
                    </div>
                </div>
                <p>Marital status:</p>
                <div class="radio_container" name="status" id="radio-marital-status" data-radio-container>
                    <input class="radio_married" type="radio" name="marital-status" value="married">
                    <input class="radio_single" type="radio" name="marital-status" value="single">
                </div>
                <div>
                    <p>Choose color of your mail:</p>
                    <input type="color" name="color" id="color-mail">
                </div>
                <br>
                <div>
                    <textarea id="description" name="description" placeholder="Tell about yourself:" rows="5" cols="33"></textarea>
                </div>
                <div>
                    <p>Age:</p>
                    <input type="number" name="age" id="age-user">
                </div>
            </form>

            <button class="table__button" data-table-btn-confirmedit="${userEmail}">edit</button>
        </div>

        `)
    
        this.elements.table.modal.forEditTable.append(htmlElem)
    }

    deleteEditForm() {
        const htmlElem = document.getElementById('for-edit-table')
        htmlElem.innerHTML = ''
    }
}