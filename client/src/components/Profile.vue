<!--
Name: Silviana
Student ID = p1939213
Course : DIT/FT/1B/14
-->

<template>
  <div class="profile">
    <div class="row m-0">
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
          <span v-if="getCreatedAt(userinfo.created_at) > 1">s</span> ago
        </p>
      </div>
      <div class="col-9 mt-5 pt-5">
        <button v-if="isUser" class="btn btn-dark editprofile">Edit Profile</button>
        <div class="user-tabs">
          <!-- tabs -->
          <b-tabs content-class="mt-3" fill>
            <!-- Listings Tab -->
            <b-tab title="Listings" class="tabs" active>
              <div class="row">
                <div
                  class="col-md-6 col-lg-3 mb-3"
                  v-for="listing in userlisting"
                  :key="listing.listingsid"
                >
                  <div class="card h-100">
                    <div class="thumbnail">
                      <img
                        class="mx-auto card-img-top listingimg"
                        :src="getImage(listing.listingsid)"
                        alt="Card image cap"
                      />
                    </div>
                    <!-- card body -->
                    <div class="card-body text-left text-dark">
                      <p class="card-title font-weight-bold">{{listing.title}}</p>
                      <p class="card-subtitle">S${{listing.price}}</p>
                      <p
                        class="card-subtitle"
                        v-if="listing.description.length < 26"
                      >{{ listing.description }}</p>
                      <p
                        v-if="listing.description.length >= 26"
                      >{{ listing.description.substring(0,26)+".." }}</p>
                      <p
                        class="card-subtitle font-weight-light text-muted"
                      >{{ listing.item_condition }}</p>
                    </div>
                    <!-- card footer -->
                  </div>
                </div>
              </div>
            </b-tab>
            <!-- Likes Tab -->
            <b-tab title="Likes">
              <div class="row">
                <div
                  class="col-md-6 col-lg-3 mb-3"
                  v-for="liked in itemsLiked"
                  :key="liked.fk_listing_id"
                >
                  <div class="card h-100">
                    <!-- <img class="card-img-top" src=".../100px200/" alt="Card image cap"> -->
                    <!-- card body -->
                    <div class="card-body text-left text-dark">
                      <p class="card-title font-weight-bold">{{liked.title}}</p>
                      <p class="card-subtitle">S${{liked.price}}</p>
                      <p
                        class="card-subtitle"
                        v-if="liked.description.length < 26"
                      >{{ liked.description }}</p>
                      <p
                        v-if="liked.description.length >= 26"
                      >{{ liked.description.substring(0,26)+".." }}</p>
                      <p
                        class="card-subtitle font-weight-light text-muted"
                      >{{ liked.item_condition }}</p>
                    </div>
                    <!-- card footer -->
                  </div>
                </div>
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
      userinfo: null,
      userlisting: [],
      itemsLiked: [],
      isUser: false
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      axios
        .get("http://localhost:3000/profile/" + this.$route.params.username)
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
          this.userlisting = result.data;
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
          this.itemsLiked = result.data;
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