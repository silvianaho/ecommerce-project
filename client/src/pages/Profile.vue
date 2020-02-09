<!--
Name: Silviana
Student ID = p1939213
Course : DIT/FT/1B/14
-->

<template>
  <div class="profile">
    <div class="row m-0">
      <!-- left side (profile) -->
      <div id="profile" class="col-3 border-right">
        <img
          v-if="userinfo != undefined"
          :src="userinfo.profile_pic_url"
          class="mt-4 rounded-circle img-fluid"
          width="200px"
          height="200px"
          alt="profile picture"
        />
        <p v-if="userinfo != undefined" class="font-weight-bolder h4 mt-2">@{{userinfo.username}}</p>
        <p v-if="userinfo != undefined" class="font-weight-normal mt-2">
          Joined {{getCreatedAt(userinfo.created_at)}} day
          <span
            v-if="getCreatedAt(userinfo.created_at) > 1"
          >s</span> ago
        </p>
      </div>
      <!-- right side (edit profile btn, user listings, liked listings) -->
      <div class="col-9 mt-5 pt-5">
        <router-link
          class="text-dark text-decoration-none"
          v-if="userinfo != undefined"
          :to="'/settings'"
        >
          <button v-if="isUser" class="btn btn-dark editprofile">Edit Profile</button>
        </router-link>
        <div class="user-tabs">
          <!-- tabs -->
          <b-tabs content-class="mt-3" fill>
            <!-- Listings Tab -->
            <b-tab title="Listings" class="tabs" active>
              <div class="row">
                <listings-component
                  v-for="listing in listings"
                  :key="listing.listingsid"
                  :listing="listing"
                  :imgurl="getImage(listing.listingsid)"
                  @like-listing="likeListing(listing)"
                  @unlike-listing="unlikeListing(listing)"
                ></listings-component>
              </div>
            </b-tab>
            <!-- Likes Tab -->
            <b-tab title="Likes">
              <!-- <b-tab title="Listings" class="tabs" active> -->
              <div class="row">
                <listings-component
                  v-for="item in itemsLiked"
                  :key="item.listingsid"
                  :listing="item"
                  :imgurl="getImage(item.listingsid)"
                  @like-listing="likeListing(item)"
                  @unlike-listing="unlikeListing(item)"
                ></listings-component>
              </div>
            </b-tab>
          </b-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";

export default {
  name: "Profile",
  data() {
    return {
      username: this.$route.params.username,
      userinfo: null,
      listings: [],
      itemsLiked: [],
      isUser: false
    };
  },
  created() {
    this.getUserInfo(this.username);
  },
  methods: {
    getUserInfo(username) {
      axios
        .get("http://localhost:3000/profile/" + username)
        .then(result => {
          this.userinfo = result.data[0];
          this.getListingsByUser(this.userinfo.userid);
          this.getLikedPosts();
          this.checkUser();
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error(error);
          if (error.message === "Request failed with status code 404") {
            router.push({ name: "notfound" });
          }
        });
    },
    getListingsByUser(id) {
      axios
        .get("http://localhost:3000/users/" + id + "/listings")
        .then(result => {
          result.data.forEach(listing => {
            listing.username = this.userinfo.username;
            this.listings.push(listing);
          });

          this.listings.map((listing, index) => {
            axios
              .get(
                "http://localhost:3000/listings/" +
                  listing.listingsid +
                  "/likes"
              )
              .then(lc_result => {
                listing.likeCount = lc_result.data.likeCount;
                this.$set(
                  this.listings,
                  index,
                  JSON.parse(JSON.stringify(listing))
                );
              })
              .catch(lc_error => {
                // eslint-disable-next-line no-console
                console.error(lc_error);
              });
          });
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    },
    getLikedPosts() {
      axios
        .get("http://localhost:3000/users/" + this.userinfo.userid + "/likes")
        .then(result => {
          result.data.forEach(item => {
            this.itemsLiked.push(item);
          });

          this.itemsLiked.map((item, index) => {
            axios
              .get(
                "http://localhost:3000/listings/" + item.listingsid + "/likes"
              )
              .then(lc_result => {
                item.likeCount = lc_result.data.likeCount;
                this.$set(
                  this.itemsLiked,
                  index,
                  JSON.parse(JSON.stringify(item))
                );
              })
              .catch(lc_error => {
                // eslint-disable-next-line no-console
                console.error(lc_error);
              });
          });
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    },
    getCreatedAt(date) {
      let today = new Date();
      let target = new Date(date);
      let dayDiff = Math.round((today - target) / (1000 * 3600 * 24));
      return dayDiff;
    },
    checkUser() {
      if (parseInt(localStorage.userid) === this.userinfo.userid) {
        this.isUser = true;
      } else {
        this.isUser = false;
      }
    },
    getImage(listingsid) {
      return "http://localhost:3000/listings/" + listingsid + "/picture";
    },

  },
  watch: {
    $route(to) {
      this.listings = [];
      this.itemsLiked = [];
      this.getUserInfo(to.params.username);
    }
  }
};
</script>

<style lang="scss" scoped>
#profile {
  height: 92vh;
}

.editprofile {
  position: absolute;
  right: 15px;
  margin-top: -6vh;
}

.tabs {
  outline: 0;
  .row {
    &:focus {
      outline: 0;
    }
  }
}

.thumbnail {
  position: relative;
  height: 200px;
  width: 100%;
  overflow: hidden;
  img {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100%;
    transform: translate(-50%, -50%);
    .listingimg {
      width: 100%;
      height: auto;
    }
  }
}
</style>