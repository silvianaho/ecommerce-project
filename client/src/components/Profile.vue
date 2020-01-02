<template>
  <div class="profile">
    <div class="row m-0">
      <div id="profile" class="col-3 border-right">
        <img
          :src="userinfo.profile_pic_url"
          class="mt-4 rounded-circle img-fluid"
          width="200px"
          height="200px"
          alt="profile picture"
        />
        <p class="font-weight-bolder h4 mt-2">@{{userinfo.username}}</p>
      </div>
      <div class="col-9 mt-5 pt-5">
        <button class="btn btn-dark editprofile">Edit Profile</button>
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
                    <!-- <img class="card-img-top" src=".../100px200/" alt="Card image cap"> -->
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
                      <p class="card-subtitle font-weight-light text-muted">{{ listing.item_condition }}</p>
                    </div>
                    <!-- card footer -->
                  </div>
                </div>
              </div>
            </b-tab>
            <!-- Likes Tab -->
            <b-tab title="Likes">
              <p>I'm the second tab</p>
            </b-tab>
          </b-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Profile",
  data() {
    return {
      userinfo: null,
      userlisting: [],
      itemsLiked: []
    };
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      axios
        .get("http://localhost:3000/users/" + localStorage.userid)
        .then(result => {
          this.userinfo = result.data[0];
          this.getListingsByUser(this.userinfo.userid);
          this.getLikedPosts();
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    },
    getListingsByUser(id) {
      axios
        .get("http://localhost:3000/users/" + id + "/listings")
        .then(result => {
          // eslint-disable-next-line no-console
          console.log(result.data);

          this.userlisting = result.data;
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    },
    getLikedPosts() {
      axios
        .get("http://localhost:3000/users/" + this.userid + "/likes")
        .then(result => {
          this.itemsLiked = result.data;
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
#profile {
  height: 92vh;
}

.editprofile{
  position: absolute;
  right: 15px;
}

.tabs {
  outline: 0;
  .row {
    &:focus {
      outline: 0;
    }
  }
}
</style>