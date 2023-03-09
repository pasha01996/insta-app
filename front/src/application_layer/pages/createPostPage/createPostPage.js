import createPostPage from './createPostPage.html'
import {renderPage, displayUserAvatar, displayUserEmail, changeLocation, createDataForImg} from '../../helper/helper.js'
import Adapter from '../../../adapters/Adapter.js'
import { URL_FOR_POSTS, METHOD_POST } from '../../helper/constants.js'





export default async function CreatePostPage () {
    renderPage(createPostPage)
    displayUserAvatar('div-user-avatar', 'div-user-profile')
    displayUserEmail('data-user-email')
    const adapter = new Adapter()
    
    const user = adapter.getSessionStorage('whoAuthorized')
    const inputUserAvatar = document.getElementById('inpun-file-createpost')
    inputUserAvatar.setAttribute('name', user.email)

    //post creating
    const inpunFileCreatepost = document.getElementById('inpun-file-createpost')
    const inpunTextCreatepost = document.getElementById('inpun-text-createpost')
    const inpunButtonCreatepost = document.getElementById('inpun-button-createpost')

    inpunButtonCreatepost.addEventListener('click', async () => {
        const data = createDataForImg(inpunFileCreatepost, 'post', inpunTextCreatepost)
        await adapter.sendImgToServer(`${URL_FOR_POSTS}/${user._id}`, data, METHOD_POST)
    
        changeLocation('#profile')
    })

}