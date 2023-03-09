import firstPage from './firstPage.html'
import {renderPage, changeLocation} from '../../helper/helper.js'
import Adapter from '../../../adapters/Adapter.js'
import { METHOD_POST, URL_FOR_LOGIN } from '../../helper/constants.js'
import Control from '../../../core/Control.js'
import Form from '../../../core/Form.js'
import {minLengthEight, includesAt} from '../../helper/validators.js'



export default function FirstPage() {
    const adapter = new Adapter()
    renderPage(firstPage)

    const imputsFormSignin =  [
        new Control('inputEmailSignin', [includesAt, minLengthEight]),
        new Control('inputPassSignin', [minLengthEight])
    ]
    const formSignin = new Form (imputsFormSignin, 'inputSubmitSignin')
    
    formSignin.submitButton.addEventListener('click', async (event) => {
        event.preventDefault()
    
        const isValid = formSignin.isValidForm()
        const formData = formSignin.getFormData()
    
        if (isValid) {
            const response = await (await adapter.sendDataToServer(URL_FOR_LOGIN, formData, METHOD_POST)).json()
            
            if (response.check) {
                adapter.setSessionStorage('whoAuthorized', response.user)
                changeLocation('#feeds')
            } else {
                formSignin.showError()
            }
        }
    
    })

}
