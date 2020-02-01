<template>
  <div class="container-fluid mt-4 mb-5">
    <h2 class="my-3">Result for "{{$attrs.title}}"</h2>
    <div class="row px-5">
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
        <button class="btn btn-dark" @click="search()">Search</button>
      </div>
      <div class="container-fluid col-md-9 border h-100 w-100">
        <div class="row py-3">
          <listings-component
            v-for="listing in listings"
            :key="listing.listingsid"
            :listing="listing"
            :imgurl="getImage(listing.listingsid)"
            @like-listing="likeListing(listing)"
            @unlike-listing="unlikeListing(listing)"
          ></listings-component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from "../components/EventBus";
import axios from "axios";
import router from "../router";

export default {
  name: "SearchResult",
  //   props: ["searchForm"],
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
        lowerlimit: 0,
        count: 12
      }
    };
  },
  created() {
    this.search();
    EventBus.$on("searchtitle", result => {
      this.searchForm.title = result;
    });
    EventBus.$on("searchresult", result => {
      this.listings = result.data;

      if (localStorage.userid) {
        // this.listings.forEach(listing => {
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
        // });
      }
    });
    this.getCategories();
  },
  methods: {
    search() {
      axios
        .get("http://localhost:3000/search/listings", {
          params: this.searchForm
        })
        .then(result => {
          EventBus.$emit("searchresult", result);
          this.$router.push({
            query: Object.assign({}, this.$route.query, this.searchForm)
          });

          // params: this.searchForm
          // eslint-disable-next-line no-console
          //   console.log(router.query)
          // eslint-disable-next-line no-console
          console.log(this.searchForm);
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
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
    }
  }
};
</script>

<style>
</style>