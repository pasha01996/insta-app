import {isAuthorized, isRegistered} from "./Page.js"
import {Control} from "./Control.js"
import {checks} from "./module.js"
import {Form} from "./Form.js"

export class Table {
    constructor(id, options) {
        this.id = id
        this.container = options.container
        this.btn = options.btn
        this.modal = options.modal
        this.nameOfStorage = options.nameOfStorage
        this.localStorage = JSON.parse(localStorage.getItem(this.nameOfStorage) || '[]')
        this.users
    }

    createModal(text) {
        this.modal.container.style.display = 'block'
        this.modal.text.innerText = text
    }

    closeModal() {
        this.modal.container.classList.remove('table-active')
        this.modal.container.style.display = "none"
        
    }

    createCell(userEmail) {
        if (userEmail) {
            return this.container.insertAdjacentHTML('afterbegin', `
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
    

    createTable(localStorage) {
        if (localStorage) {
            for(let i = 0; i < localStorage.length; i++) {
                this.createCell(localStorage[i].email)
            }
        }  
    }


    async sendGETRequest(url) {
        return await fetch(url).then(response => { return response.json() })
    }

    

    async viewTableItem(userWhoView, check) {
        if (check) {
            await this.sendGETRequest('http://localhost:3000/getusers')
                .then(data => this.users = data)

            const userEmail = userWhoView
            const findUser = this.users.find(user => user.email === userEmail)
            this.createModal(Object.entries(findUser).join('\n').replaceAll(',', ': '))
        } else {
            this.createModal('Please login for using this interface')
        }
    }

    // deleteTableItem(event, isAuthorized) {
    //     if (isAuthorized) {
    //         const storage = this.getLocalStorage(this.nameOfStorage)
    //         const userEmail = event.target.dataset.tableBtnDelete
    //         const user = storage.findIndex(e => e.email === userEmail)
    //         storage.splice(user, 1)
    //         this.updateStorage(this.nameOfStorage, storage)
    //         location.reload()
    //     } else {
    //         this.createModal('Please login for using this interface')
    //     }
    // }

    editTableItem (userWhoEdit, check) {
        if (check) {
            this.createModal('')
            this.modal.forEditTable.append(this.createEditForm(userWhoEdit))
            return true
        } else {
            this.createModal('Please login for using this interface')
            return false
        }
    }


    createEditForm(userEmail) {
        const htmlElem = document.createElement('div')
        htmlElem.classList.add('modal__table')
        htmlElem.setAttribute('id','form-container-edit')
        htmlElem.insertAdjacentHTML('afterbegin', `
        <div class="modal__table_inputs">
            <form class="modal_table_form" id="modal-table-form" action="#">  
                <div class="table_div"> 
                    <span class="table__span">avatar:</span>
                    <input class="table__button button_avatar" id="up-file" type="file">
                </div>

                <div class="table_div">
                    <span class="table__span">email:</span>
                    <input class="table__input table__input_email" id="inputEmailEdit" name="email" type="email" placeholder="Email">
                </div>
                <div class="table_div">
                    <span class="table__span">pass:</span>
                    <input class="table__input table__input_password" id="inputPassEdit" name="password" type="text"  placeholder="Password">
                </div>
                <div class="table_div">
                    <span class="table__span">phone:</span>
                    <input class="table__input table__input_phone" id="inputPhoneEdit" name="phone" type="text" placeholder="Phone">
                </div>
                <div class="table_div">
                    <span class="table__span">country:</span>
                    <input class="table__input table__input_country" id="inputCountryEdit" name="country" type="text" placeholder="Country">
                </div>
                <div class="table_div">
                    <span class="table__span">gender:</span>
                    <select class="table__input" name="gender" id="gender-select">
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
                    <input class="input__color" type="color" name="color" id="color-mail">
                </div>

                <div class="table_div">
                    <span class="table__span">About you:</span>
                    <textarea class="table__input id="description" name="description" placeholder="Tell about yourself:" rows="5" cols="33"></textarea>
                </div>
                <div class="table_div">
                    <span class="table__span">Age:</span>
                    <input class="table__input" type="number" name="age" id="age-user">
                </div>
            </form>

            <button class="table__button" data-table-btn-confirmedit="${userEmail}">edit</button>
        </div>

        `)
    
        return htmlElem
    }
}