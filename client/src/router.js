import Vue from 'vue'
import Router from 'vue-router'
// @ts-ignore
import Listings from './components/Listings';
// @ts-ignore
import AddListing from './components/AddListing';
// @ts-ignore
import LogIn from './components/LogIn';
// @ts-ignore
import Profile from './components/Profile';
// @ts-ignore
import NotFound from './components/NotFound';


Vue.use(Router)

const routes = [
    {
        path: '/',
        name: 'listings',
        component: Listings
    },
    {
        name: 'addListings',
        path: '/sell',
        component: AddListing
    },
    {
        name: 'login',
        path: '/login',
        component: LogIn
    },
    {
        name: 'profile',
        path: '/user/:username',
        component: Profile
    },
    {
        name: 'notfound',
        path: '/notfound',
        component: NotFound
    },
]

export default
    new Router({
        mode: 'history',
        routes: routes
    })