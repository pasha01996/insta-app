import signupPage from './signupPage.html'
import {renderPage, changeLocation} from '../../helper/helper.js'
import { METHOD_POST, URL_FOR_USERS } from '../../helper/constants.js'
import Control from '../../../core/Control.js'
import Form from '../../../core/Form.js'
import Adapter from '../../../adapters/Adapter.js'
import {minLengthEight, includesAt, firstLetterPlus} from '../../helper/validators.js'



export default function SignupPage()  {
    const adapter = new Adapter()
    renderPage(signupPage)

    const imputsFormSignup = [
        new Control('inputEmailSignup', [includesAt, minLengthEight]),
        new Control('inputPassSignup', [minLengthEight]),
        new Control('inputPhoneSignup', [minLengthEight, firstLetterPlus]),
        new Control('inputCountrySignup', [minLengthEight])
    ]
    const formSignup = new Form(imputsFormSignup, 'inputSubmitSignup')
 
    
    formSignup.submitButton.addEventListener('click', async (event) => {
        event.preventDefault()
        const isValid = formSignup.isValidForm()
        const formData = formSignup.getFormData()
        
        if (isValid) {
            
            const response = await adapter.sendDataToServer(URL_FOR_USERS, formData, METHOD_POST)
            if (response) {
                changeLocation('#') 
            } else {
                formSignup.showError()
            }
        }

    })
}   