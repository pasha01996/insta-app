import feedsPage from './feedsPage.html'
import {renderPage, changeLocation, displayUserAvatar, displayPosts} from '../../helper/helper.js'
import Adapter from '../../../adapters/Adapter.js'
import { URL_FOR_POSTS } from '../../helper/constants.js'



export default function FeedsPage() {
    const adapter = new Adapter()
    renderPage(feedsPage)
    displayUserAvatar('div-user-profile')
    
    //pagination 
    let currentPart = 1
    let sizeOfScroll = 350
    
    const paginationPosts = async (currentNum) => {
        const allPostsEl = document.getElementById('all-posts')
        const partOfPosts = await (await adapter.sendGetRequest(`${URL_FOR_POSTS}/part${currentNum}`)).json()

        if (partOfPosts) { partOfPosts.forEach((post) => displayPosts(allPostsEl, post)) } 
    }
    paginationPosts(currentPart)

    window.addEventListener('scroll', () => {
       if (window.scrollY >= sizeOfScroll) {
        currentPart++
        sizeOfScroll = sizeOfScroll + 1000
        paginationPosts(currentPart)
       }
    })


    // header listener
    const allButtons = Array.prototype.slice.call(document.querySelectorAll('.header__button'))
    allButtons.forEach( elem => {
        const stringToArray = elem.id.split('-')
        const hash = `#${stringToArray[stringToArray.length - 1]}`

        elem.addEventListener('click', () => changeLocation(hash))
    })

}