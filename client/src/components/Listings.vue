<!--
Name: Silviana
Student ID = p1939213
Course : DIT/FT/1B/14
-->

<template>
  <div class="container mt-4 mb-5">
    <div class="row">
      <div class="col-md-6 col-lg-3 mb-3" v-for="listing in listings" :key="listing.listingsid">
        <div class="card h-100">
          <div class="thumbnail">
            <img
              class="mx-auto card-img-top listingimg"
              :src="getImage(listing.listingsid)"
              alt="Card image cap"
            />
          </div>
          <!-- card body -->
          <div class="card-body">
            <h5 class="card-title" v-if="listing.title.length < 14">{{ listing.title }}</h5>
            <h5
              class="card-title"
              v-if="listing.title.length >= 14"
            >{{ listing.title.substring(0,14)+".." }}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${{ listing.price }}</h6>
            <p class="small" v-if="listing.description.length < 60">{{ listing.description }}</p>
            <p
              class="small"
              v-if="listing.description.length >= 60"
            >{{ listing.description.substring(0,60)+".." }}</p>
          </div>
          <!-- card footer -->
          <div class="card-footer text-left">
            <button
              class="hidedefaultbtn"
              v-if="listing.liked == true"
              type="button"
              @click="unlikeListing(listing)"
            >
              <small>
                <font-awesome-icon class="text-danger" :icon="['fas', 'heart']" />
              </small>
            </button>
            <button class="hidedefaultbtn" v-else type="button" @click="likeListing(listing)">
              <small>
                <font-awesome-icon :icon="['far', 'heart']" />
              </small>
            </button>
            <small class="ml-1">{{listing.likeCount}}</small>
            <small class="ml-1">
              Posted by:
              <router-link :to="'/user/' + listing.username">{{listing.username}}</router-link>
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";

export default {
  name: "listings",
  data() {
    return {
      listings: [],
      likeForm: {
        userid: null
      }
    };
  },
  mounted() {
    this.getListings();
  },
  methods: {
    validateToken() {
      let config = {
        headers: {
          authorization: "Bearer " + localStorage.usertoken
        }
      };
      axios
        .post("http://localhost:3000/validate", null, config)
        .then(result => {
          // eslint-disable-next-line no-console
          console.log(result);
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.error(err);
          router.push({ name: "login" });
        });
    },
    getListings() {
      if (localStorage.userid) {
        axios
          .get("http://localhost:3000/" + localStorage.userid + "/fe/listings/")
          .then(result => {
            this.listings = result.data;

            // map the likecounts to this.listings
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
      } else {
        axios
          .get("http://localhost:3000/fe/listings/")
          .then(result => {
            this.listings = result.data;
            // map the likecounts to this.listings
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
      }
    },
    likeListing(listing) {
      this.validateToken();
      this.likeForm.userid = parseInt(localStorage.userid);
      axios
        .post(
          "http://localhost:3000/listings/" + listing.listingsid + "/likes",
          this.likeForm
        )
        .then(result => {
          // eslint-disable-next-line no-console
          console.log(result);
          this.$set(listing, "liked", true);
          this.$nextTick(listing.likeCount++);
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    },
    unlikeListing(listing) {
      this.validateToken();
      this.likeForm.userid = parseInt(localStorage.userid);
      axios
        .delete(
          "http://localhost:3000/listings/" + listing.listingsid + "/likes",
          { data: this.likeForm }
        )
        .then(result => {
          // eslint-disable-next-line no-console
          console.log(result);
          this.$nextTick((listing.liked = false));
          this.$nextTick(listing.likeCount--);
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    },
    getImage(listingsid) {
      return "http://localhost:3000/listings/" + listingsid + "/picture";
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  height: 20vh;
}

.hidedefaultbtn {
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
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