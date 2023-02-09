
export class Form {
    constructor(id, options) {
        this.id = id
        this.container = document.getElementById(id)
        this.inputs = options.inputs
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
    
//------------------------------------------------------------------------------------------

    isValidForm() {
       return (this.inputs.length === this.getValues().length)  
    }
}


