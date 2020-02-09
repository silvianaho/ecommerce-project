<template>
  <div class="container-fluid mt-4 mb-5">
    <h2 class="my-3">Result for "{{$attrs.title}}"</h2>
    <div class="row px-5">
      <div class="col-md-3">
        <div class="card py-4 px-3 text-left">
          <!-- categories -->
          <div class="form-group">
            <label class="h5 font-weight-bold ml-2" for="selectCategory">Category</label>
            <select
              class="form-control"
              id="selectCategory"
              name="category"
              v-model="searchForm.category"
              required
            >
              <option value selected>Select a category...</option>
              <option
                v-for="category in categories"
                :key="category.categoriesid"
                :value="category.categoriesid"
              >{{category.categoriestxt}}</option>
            </select>
          </div>
          <!-- condition -->
          <div class="form-group">
            <label class="h5 font-weight-bold ml-2" for="condition">Item Condition</label>
            <div class="row">
              <div v-for="condition in conditions" :key="condition.id" class="col-6">
                <div class="custom-control custom-radio">
                  <input
                    type="radio"
                    :id="condition.text"
                    :name="condition.text"
                    :value="condition.text"
                    v-model="searchForm.cond"
                    class="custom-control-input"
                  />
                  <label class="custom-control-label" :for="condition.text">{{condition.text}}</label>
                </div>
              </div>
            </div>
          </div>
          <!-- minprice -->
          <div class="form-group">
            <label class="h5 font-weight-bold ml-2" for="minprice">Minimum Price</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <!-- <p><span>S$</span></p> -->
                <span class="input-group-text">S$</span>
              </div>
              <input
                type="Number"
                class="form-control"
                aria-label="Price"
                name="minprice"
                id="price"
                placeholder="Price"
                v-model="searchForm.minprice"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <!-- maxprice -->
          <div class="form-group">
            <label class="h5 font-weight-bold ml-2" for="maxprice">Maximum Price</label>
            <div class="input-group">
              <div class="input-group-prepend">
                <!-- <p><span>S$</span></p> -->
                <span class="input-group-text">S$</span>
              </div>
              <input
                type="Number"
                class="form-control"
                aria-label="Price"
                name="maxprice"
                id="price"
                placeholder="Price"
                v-model="searchForm.maxprice"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <button class="btn btn-dark" @click="searchForm.lowerlimit = 0; listings = []; search(searchForm)">Search</button>
          <button class="btn btn-outline-dark my-3" @click="resetsearch()">Reset</button>
        </div>
      </div>
      <div class="container-fluid col-md-9 border h-100 w-100">
        <div class="row py-3">
          <div class="w-100 text-center" v-if="searchSuccess === false">
            <not-found />
          </div>
          <listings-component
            v-else
            v-for="listing in listings"
            :key="listing.listingsid"
            :listing="listing"
            :imgurl="getImage(listing.listingsid)"
            @like-listing="likeListing(listing)"
            @unlike-listing="unlikeListing(listing)"
          ></listings-component>
        </div>
        <button
          class="btn btn-outline-dark my-4"
          v-if="lastListing() == false"
          @click="seeMore(searchForm)"
        >See More</button>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from "../components/EventBus";
import axios from "axios";
import router from "../router";
import NotFound from "../components/NotFound";

export default {
  name: "SearchResult",
  components: {
    "not-found": NotFound
  },
  data() {
    return {
      categories: [],
      conditions: [
        {
          id: 0,
          text: "Used"
        },
        {
          id: 1,
          text: "New"
        }
      ],
      listings: [],
      likeForm: {
        userid: null
      },
      searchForm: {
        title: this.$attrs.title,
        minprice: "",
        maxprice: "",
        cond: "",
        category: "",
        userid: localStorage.userid,
        lowerlimit: 0,
        count: 12
      },
      searchSuccess: true
    };
  },
  created() {
    this.search(this.searchForm);
    EventBus.$on("searchtitle", result => {
      this.resetsearch()
      this.searchForm.title = result[0];
      this.searchForm.userid = result[1];
    });
    EventBus.$on("searchresult", result => {
      this.listings = []
      if (result.length == null) {
        this.searchSuccess = true;
      }
      this.listings = result.data
      if (localStorage.userid) {
        this.listings.map((listing, index) => {
          axios
            .get(`http://localhost:3000/listings/${listing.listingsid}/likes`)
            .then(result => {
              listing.likeCount = result.data.likers.length;
              result.data.likers.forEach(liker => {
                if (liker.userid == localStorage.userid) {
                  listing.liked = true;
                }
              });
              this.$set(
                this.listings,
                index,
                JSON.parse(JSON.stringify(listing))
              );
            })
            .catch(error => {
              // eslint-disable-next-line no-console
              console.error(error);
            });
        });
      } else {
        this.listings.map((listing, index) => {
          axios
            .get(
              "http://localhost:3000/listings/" + listing.listingsid + "/likes"
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
      }
    });
    EventBus.$on("no-searchresult", result => {
      this.searchSuccess = result;
    });
    this.getCategories();
  },
  methods: {
    search(searchForm) {
      axios
        .get("http://localhost:3000/search/listings", {
          params: searchForm
        })
        .then(result => {
          if (result.length == null) {
            this.searchSuccess = true;
          }

          result.data.forEach(listing => {
            this.listings.push(listing);
          });
          // this.listings = result.data
          if (localStorage.userid) {
            this.listings.map((listing, index) => {
              axios
                .get(
                  `http://localhost:3000/listings/${listing.listingsid}/likes`
                )
                .then(result => {
                  listing.likeCount = result.data.likers.length;
                  result.data.likers.forEach(liker => {
                    if (liker.userid == localStorage.userid) {
                      listing.liked = true;
                    }
                  });
                  this.$set(
                    this.listings,
                    index,
                    JSON.parse(JSON.stringify(listing))
                  );
                })
                .catch(error => {
                  // eslint-disable-next-line no-console
                  console.error(error);
                });
            });
          } else {
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
          }
          this.$router.push({
            query: Object.assign({}, this.$route.query, searchForm)
          });
          this.searchSuccess = true;
        })
        .catch(error => {
          EventBus.$emit("no-searchresult", this.searchSuccess);
          if (error.message == "Request failed with status code 404") {
            this.searchSuccess = false;
          }
        });
    },
    resetsearch() {
      this.searchForm.minprice = "";
      this.searchForm.maxprice = "";
      this.searchForm.cond = "";
      this.searchForm.category = "";
      this.searchForm.lowerlimit = 0;
      this.searchForm.count = 12;
      this.search(this.searchForm);
    },
    getCategories() {
      axios
        .get("http://localhost:3000/categories")
        .then(result => {
          this.categories = result.data;
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    },
    likeListing(listing) {
      let config = {
        headers: {
          authorization: "Bearer " + localStorage.usertoken
        }
      };

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
          alert("Your session has ended, please log in again!");
          EventBus.$emit("notlogged-in");
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
    seeMore(searchForm) {
      searchForm.lowerlimit = this.listings.length;
      this.search(searchForm);
    },
    lastListing(){
      if (this.listings[this.listings.length - 1].eol == true) {
        return true
      }
      else{
        return false
      }
    }
  },
  watch:{
    $route(to) {
      // eslint-disable-next-line no-console
      console.log(to)
      this.listings = []
      // this.getUserInfo(to.params.username);
    }
  }
};
</script>

<style>
</style>