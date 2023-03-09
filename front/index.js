import "./src/application_layer/pages/styles/header.sass" 
import "./src/application_layer/pages/styles/style.sass" 
import "./src/application_layer/pages/styles/modal.sass" 
import "./src/application_layer/pages/styles/form.sass" 
import "./src/application_layer/pages/styles/table.sass"
import "./src/application_layer/pages/styles/edit_form_table.sass"
import "./src/application_layer/pages/styles/user_profile.sass"
import "./src/application_layer/pages/styles/create_post.sass"
import "./src/application_layer/pages/styles/interesting.sass"
import "./src/application_layer/pages/styles/paginations.sass"

import {routes} from './src/core/Routes.js'


const locationHandle = async () => {
    let location = window.location.hash.replace('#', '')
    if (location.length === 0) { location = '#' }

    const route = routes[location] || routes[404]
    route()
}

window.addEventListener('hashchange', locationHandle)
locationHandle()





// //-------------------------------------------Edit-Table-------------------------------------
// const callbackEditTable = async () => {
//     const header = create.Header()
//     const profile = create.UserProfile(create.UserData(), create.EditProfile())
//     const wrapper = create.Wrapper(header, profile)
//     displayPage(create.Page(wrapper))
//     displayUserAvatar('div-user-avatar', 'div-user-profile')


//     const upFile = document.getElementById('up-file')
//     const formOptionEditTadle = [
//         new Control('inputEmailEdit', [checks.includesAt, checks.minLengthEight]),
//         new Control('inputPassEdit', [checks.minLengthEight]),
//         new Control('inputPhoneEdit', [checks.firstLetterPlus, checks.minLengthEight]),
//         new Control('inputCountryEdit', [checks.minLengthEight]),
//         new Control('radio-marital-status', 'not checks'),
//         new Control('gender-select', 'not checks'),
//         new Control('color-mail', 'not checks'),
//         new Control('description', 'not checks'),
//         new Control('age-user', 'not checks'),
//         new Control('checkbox-interests', 'not checks')
//     ]
//     const formEditTable = new Form(formOptionEditTadle, 'table-button-edit')
    

//     upFile.addEventListener('change', async () => {
//         const user = getSessionStorage('whoAuthorized')
//         const url = `http://localhost:3000/users/${user._id}/avatar`
//         await sendFetch.PUTImage(upFile, url)

//         await updateUserAvatar()
//         displayUserAvatar('div-user-avatar', 'div-user-profile')
//     })
    

//     formEditTable.submitButton.addEventListener('click', async (event) => {
//         event.preventDefault()
//         const isValid = formEditTable.isValidForm()
//         const formData = formEditTable.getFormData()
//         const user = getSessionStorage('whoAuthorized')
//         console.log(isValid)
//         console.log(formData)
//         if (isValid) {
//             const url = `http://localhost:3000/users/${user._id}`
//             await sendFetch.PUTRequest(url, 'update', formData)
//             changeLocation('#profile')
//         } else {
//             formEditTable.showError()
//         }

//     })
//  }
