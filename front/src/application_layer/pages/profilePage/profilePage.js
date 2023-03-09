import profilePage from './profilePage.html'
import {renderPage, displayUserAvatar, displayUserEmail, displayPosts, changeLocation} from '../../helper/helper.js'
import Adapter from '../../../adapters/Adapter.js'



export default async function ProfilePage() {
    const adapter = new Adapter()
    renderPage(profilePage)
    displayUserAvatar('div-user-avatar', 'div-user-profile')
    displayUserEmail('data-user-email')

    //posts creating
    const user = adapter.getSessionStorage('whoAuthorized')
    const userContentEl = document.getElementById('user-content')

    const userPosts = await (await adapter.sendGetRequest(`http://localhost:3000/posts/user${user._id}`)).json()
    if (userPosts) { userPosts.forEach( post => displayPosts(userContentEl, post)) }
    

    // header location 
    const userButtonEdit = document.querySelector('#user-button-edit')
    const userButtonCreate = document.querySelector('#user-button-create')
    userButtonCreate.addEventListener('click', () => location.hash = '#createpost')
    userButtonEdit.addEventListener('click', () => location.hash = '#edittable')

    // header location  
    const allButtons = Array.prototype.slice.call(document.querySelectorAll('.header__button'))
    allButtons.forEach( elem => {
        const stringToArray = elem.id.split('-')
        const hash = `#${stringToArray[stringToArray.length - 1]}`
        elem.addEventListener('click', () => changeLocation(hash))
    })
}
