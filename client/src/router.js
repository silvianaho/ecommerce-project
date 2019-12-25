import Vue from 'vue'
import Router from 'vue-router'
import Listings from './components/Listings';
import AddListing from './components/AddListing';
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
        path: '/signup',
        component: SignUp
    },
]

export default
    new Router({
        mode: 'history',
        routes: routes
    })