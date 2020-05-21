Name        : Silviana
Student ID  : p1939213
Class       : DIT/FT/1B/14

---

# Snapsell

## A. Environment Setup + Running Back End Server:
1. Open '.env_sample'
2. Fill in the required credentials according to your local system
3. Rename '.env_sample' to '.env'
4. Go to command prompt
5. Cd into /server
6. run 
```
npm install
```
7. run 
```
npm run start-dev
```

## B. To run the client server:
1. Open command prompt
2. cd into /client
3. run 
```
npm install
```
4. To run the client server, you can choose from these 2 options 
 
a. For development (compile and hot-reload), run:
```
npm run serve
```
b. For production (compile and minify), run:
```
npm run build
```
cd into /client/dist/, then run:
```
npm run serve
```

Parts that are working fine: Login/register, logout, homepage, profile, viewing other user's profile, adding a new listing, like/unlike, user not found page (type an unknown username on the url bar)


## C. To view image
First method (1 image): 
1. Go to any browser
2. Enter 'http://localhost:3000/listings/:listingid/picture' into the location bar
3. Change ":listingid" to any listingid available

Second method (all images):
1. Run the client server (refer to B)

---

# Endpoints

1. Get all users                                (http://localhost:3000/users)
2. Create a new user                            (http://localhost:3000/users)
3. Get user by id                               (http://localhost:3000/users/:userid)
4. Update user                                  (http://localhost:3000/users/:userid/profile)
5. Update password                              (http://localhost:3000/users/:userid/pwd)
6. Get all listings by user                     (http://localhost:3000/users/:userid/listings)
7. Get all listings                             (http://localhost:3000/listings)
8. Get listings by listing id                   (http://localhost:3000/listings/:listingsid)
9. Add new listing                              (http://localhost:3000/listings)
10. Delete listing                              (http://localhost:3000/listings:listingsid)
11. Update a listing                            (http://localhost:3000/listings:listingsid)
12. Get all offers for a listing                (http://localhost:3000/listings:listingsid/offers)
13. Add a new offer to a listing                (http://localhost:3000/listings:listingsid/offers)
14. Get all Categories                          (http://localhost:3000/categories)
15. Login                                       (http://localhost:3000/login)
16. Get users that liked this item              (http://localhost:3000/listings/:listingsid/likes)
17. Get items liked by user                     (http://localhost:3000/users/:userid/likes)
18. Like a listing                              (http://localhost:3000/listings/:listingid/likes)
19. Unlike a listing                            (http://localhost:3000/listings/:listingid/likes)
20. Get user by username                        (http://localhost:3000/profile/username)
21. Get a picture                               (http://localhost:3000/listings/:listingid/picture)
22. Listings for Front End (Logged in user)     (http://localhost:3000/:userid/fe/listings)
23. Listings for Front End (Logged out user)    (http://localhost:3000/fe/listings)
24. Find listings by category                   (http://localhost:3000/listings/category/:listingsid)
25. Search by all listing criterias             (http://localhost:3000/search/listings)

---

# Additional features
|No |   Feature                          |  Endpoints   |
|---|------------------------------------|--------------|
|1. |Like and Unlike                     |  (18 & 19)   |
|2. |Pagination in search place          |  (22 & 23)   |
|3. |Showing Like Counts                 |     (16)     |
|4. |Image Uploading                     |   (9 & 11)   |
|5. |Modify Profile Info                 |   (4 & 5)    |