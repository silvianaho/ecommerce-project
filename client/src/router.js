import Vue from 'vue'
import Router from 'vue-router'
// @ts-ignore
import Listings from './components/Listings';
// @ts-ignore
import AddListing from './components/AddListing';
// @ts-ignore
import SignUp from './components/SignUp';

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
        path: '/login',
        component: SignUp
    },
]

export default
    new Router({
        mode: 'history',
        routes: routes
    })