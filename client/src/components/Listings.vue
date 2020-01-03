<template>
  <div class="container mt-4">
    <!-- <div class="card-deck"> -->
    <div class="row">
      <div class="col-md-6 col-lg-3 mb-3" v-for="listing in listings" :key="listing.listingsid">
        <div class="card h-100">
          <!-- <img class="card-img-top" src=".../100px200/" alt="Card image cap"> -->
          <!-- card body -->
          <div class="card-body">
            <h5 class="card-title">{{listing.title}}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${{ listing.price }}</h6>
            <!-- <p class="card-text">{{listing.description}}</p> -->
            <p class="card-text" v-if="listing.description.length < 40">{{ listing.description }}</p>
            <p
              class="text-small"
              v-if="listing.description.length >= 40"
            >{{ listing.description.substring(0,40)+".." }}</p>
          </div>
          <!-- card footer -->
          <div class="card-footer text-left">
            <button class="hidedefbtn" type="button" @click="likeUnlike(listing.listingsid)">
              <small>
                <font-awesome-icon
                  v-if="listing.liked == 1"
                  class="text-danger"
                  :icon="['fas', 'heart']"
                />
                <font-awesome-icon v-else :icon="['far', 'heart']" />
              </small>
            </button>
            <small class="ml-1">{{ listing.likeCount }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "listings",
  data() {
    return {
      listings: [],
      likeForm: {
        fk_listing_id: null,
        fk_liker_id: null
      }
    };
  },
  mounted() {
    this.getListings();
  },
  methods: {
    getListings() {
      axios.get("http://localhost:3000/listings").then(result => {
        this.listings = result.data;
        /* get listings liked by current user */
        // have to use Vue.set because of JS limitations
        this.listings.map((listings, listingsid) => {
          axios
            .get(
              "http://localhost:3000/users/" +
                localStorage.userid +
                "/likes"
            )
            .then(resultUL => {
              for (let i = 0; i < this.listings.length; i++) {
                for (let j = 0; j < resultUL.data.length; j++) {
                  if (
                    resultUL.data[j].listingsid === this.listings[i].listingsid
                  ) {
                    this.listings[i].liked = 1;
                  } else {
                    this.listings[i].liked = 0;
                  }
                }

                /* get the number of likes for each listing */
                this.listings.map((listings, listingsid) => {
                  axios
                    .get(
                      "http://localhost:3000/listings/" +
                        this.listings[i].listingsid +
                        "/likes"
                    )
                    .then(resultNL => {
                      // eslint-disable-next-line no-console
                      this.listings[i].likers = resultNL.data.likers;
                      this.listings[i].likeCount = resultNL.data.likeCount;
                      this.$set(
                        this.listings,
                        listingsid,
                        JSON.parse(JSON.stringify(listings))
                      );
                    });
                });
              }
              this.$set(
                this.listings,
                listingsid,
                JSON.parse(JSON.stringify(listings))
              );
            });
        });
      });
    },
    likeUnlike(id) {
      // eslint-disable-next-line no-console
      console.log(id);
      this.likeForm.fk_listing_id = id;
      this.likeForm.fk_liker_id = localStorage.userid;
      axios
        .post("http://localhost:3000/listings/" + id + "/likes", this.likeForm)
        .then(result => {
          // eslint-disable-next-line no-console
          console.log(result);
          // this.listings.liked = true;
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    }
  }
};
</script>

<style scoped>
.card {
  height: 20vh;
}

.hidedefbtn {
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
}
</style>