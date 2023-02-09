export const radio = function () {
    const radioConteiner = document.querySelectorAll('[data-radio-container]')

    const clickRadio = function () {
        const container = this
        const inputs = this.children
        container.name = 'radio'
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].checked) {
                container.value = inputs[i].value
                console.log(container.value)
                break
                
            }
        }
    }

    for (let i = 0; i < radioConteiner.length; i++) {
        let element = radioConteiner[i]
        element.addEventListener('click', clickRadio)
    }

}



