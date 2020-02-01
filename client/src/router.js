/*
Name: Silviana
Student ID: p1939213
Course: DIT/FT/1B/14
*/

import Vue from 'vue'
import Router from 'vue-router'
// @ts-ignore
// import Listings from './components/Listings';
// @ts-ignore
import HomepageListings from './pages/HomepageListings';
// @ts-ignore
import AddListing from './components/AddListing';
// @ts-ignore
import LogIn from './components/LogIn';
// @ts-ignore
import Profile from './components/Profile';
// @ts-ignore
import SearchResult from './pages/SearchResult';
// @ts-ignore
import NotFound from './components/NotFound';


Vue.use(Router)

const routes = [
    {
        name: 'listings',
        path: '/',
        component: HomepageListings
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
        name: 'search-listings',
        path: '/search/listings',
        component: SearchResult,
        props: (route) => {
            // eslint-disable-next-line no-console
            console.log(route.query)
            return route.query || {}
        }
    },
    {
        name: 'search-user',
        path: '/search/users',
        component: SearchResult
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