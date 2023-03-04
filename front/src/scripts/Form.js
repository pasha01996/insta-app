
export class Form {
    constructor(id, imputs, submitButton) {
        this.id = id
        this.container = document.getElementById(id)
        this.inputs = imputs
        this.submitButton = document.getElementById(submitButton)
    }

    getValues() {
        let controlsValues = []
        for (let i = 0; i <this.inputs.length; i++) {
            if (this.inputs[i].startChecks()) {
                controlsValues.push(this.inputs[i].getValue())
            } else {this.inputs[i].showError()}
        }
        return controlsValues
    }

    getAttributes() {
        const controlsAttributes = this.inputs.map(input => input.getAttribute())
        return controlsAttributes
    }

    getFormData() {
        const formData = {}
        for (let i = 0; i < this.inputs.length; i++) { 
            formData[this.getAttributes()[i]] = this.getValues()[i]
        }
        return formData
    }

    showError() {
        this.inputs.forEach( input => input.showError())
    }

    isValidForm() {
       return (this.inputs.length === this.getValues().length)  
    }
}



