
export default class Control {
    constructor(id, checks){
        this.id = id
        this.checks = checks
        this.elementLink = document.getElementById(id)
        // this.attribute = this.elementLink.getAttribute("name")
        this.inputsCheck = this.elementLink.querySelectorAll('.input')
    }

    startChecks() {
        if (this.checks === 'not checks') {
            return true
        } else {return this.checks.every(check => check(this.elementLink.value))}     
    }

    getAttribute() {
        return this.elementLink.getAttribute("name")
    }
    
    getValue() {
        if (this.attribute === 'checkbox') {
            return this.getValuesCheckbox()
        } else {return this.elementLink.value}
    }

    showError() {
        this.elementLink.value = ''
        this.elementLink.classList.add('form__input_error')
        this.elementLink.placeholder = 'Enter correct' + ' ' + this.getAttribute()
    }

    getValuesCheckbox() {
        const inputs = this.elementLink.querySelectorAll('input')
        const checkedInputs = []
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].checked) {
                checkedInputs.push(inputs[i].value)
            } else {false}
        }
        return checkedInputs
    }
}   

