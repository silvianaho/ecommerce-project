<template>
  <div class="container mt-4 mb-5">
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

    <button
      v-if="lastListing() == false"
      class="btn btn-outline-dark my-4"
      @click="seeMore(limits)"
    >See More</button>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";

export default {
  name: "HomepageListings",
  data() {
    return {
      listings: [],
      likeForm: {
        userid: null
      },
      limits: {
        lowerlimit: 0,
        count: 12
      }
    };
  },
  created() {
    this.getListings(this.limits);
  },
  methods: {
    getListings(limits) {
      if (localStorage.userid) {
        let config = {
          headers: {
            authorization: "Bearer " + localStorage.usertoken
          },
          params: limits
        };

        axios
          .get(
            "http://localhost:3000/fe/" + localStorage.userid + "/listings/",
            config
          )
          .then(result => {
            if (result.data.length == 0) {
              alert("No more post");
              return;
            }
            result.data.forEach(listing => {
              this.listings.push(listing);
            });

            // map the likecounts to this.listings
            this.listings.map((listing, index) => {
              axios
                .get(
                  "http://localhost:3000/listings/" +
                    listing.listingsid +
                    "/likes"
                )
                .then(lc_result => {
                  // eslint-disable-next-line no-console
                  console.log(lc_result)
                  listing.likeCount = parseInt(lc_result.data.likeCount);
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
            alert("Your session has expired, please log in again!");
            localStorage.removeItem("usertoken");
            localStorage.removeItem("userid");
            this.auth = "";
            this.userid = null;
            this.token = null;
            router.push({ name: "login" });
          });
      } else {
        axios
          .get("http://localhost:3000/fe/listings/", {
            params: limits
          })
          .then(result => {
            if (result.data.length == 0) {
              alert("No more post");
              return;
            }

            result.data.forEach(listing => {
              this.listings.push(listing);
            });
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
      let config = {
        headers: {
          authorization: "Bearer " + localStorage.usertoken
        }
      };
      // this.validateToken();
      this.likeForm.userid = parseInt(localStorage.userid);
      axios
        .post(
          "http://localhost:3000/listings/" + listing.listingsid + "/likes",
          this.likeForm,
          config
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
          router.push({ name: "login" });
        });
    },
    unlikeListing(listing) {
      this.likeForm.userid = parseInt(localStorage.userid);
      axios
        .delete(
          "http://localhost:3000/listings/" + listing.listingsid + "/likes",
          {
            data: this.likeForm,
            headers: {
              authorization: "Bearer " + localStorage.usertoken
            }
          }
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
    },
    seeMore(limits) {
      limits.lowerlimit = this.listings.length;
      // eslint-disable-next-line no-console
      console.log(
        "lowerlimit" + limits.lowerlimit + "\n" + JSON.stringify(limits)
      );
      this.getListings(limits);
    },
    lastListing(){
      if (this.listings[this.listings.length - 1].eol == true) {
        return true
      }
      else{
        return false
      }
    }
  }
};
</script>

<style>
</style>