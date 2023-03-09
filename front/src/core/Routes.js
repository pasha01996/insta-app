import FirstPage from '../application_layer/pages/firstPage/firstPage'
import signupPage from '../application_layer/pages/signupPage/signupPage.js'
import profilePage from '../application_layer/pages/profilePage/profilePage.js'
import feedsPage from '../application_layer/pages/feedsPage/feedsPage.js'
import createPostPage from '../application_layer/pages/createPostPage/createPostPage.js'
// import editTablePage from '../application layer/pages/editTablePage/editTablePage.js'


export const routes = {
    404: "404",
    "#": FirstPage,
    signup: signupPage,
    profile: profilePage,
    feeds: feedsPage,
    createpost: createPostPage,
    // edittable: editTablePage
}