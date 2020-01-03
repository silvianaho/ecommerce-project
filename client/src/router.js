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
        path: '/:username',
        component: Profile
    },
]

export default
    new Router({
        mode: 'history',
        routes: routes
    })