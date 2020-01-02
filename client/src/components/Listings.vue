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
            <h6 class="card-subtitle mb-2 text-muted">${{listing.price}}</h6>
            <!-- <p class="card-text">{{listing.description}}</p> -->
            <p class="card-text" v-if="listing.description.length < 40">{{ listing.description }}</p>
            <p class="text-small" v-if="listing.description.length >= 40">{{ listing.description.substring(0,40)+".." }}</p>
          </div>
          <!-- card footer -->
          <div class="card-footer">
            <small class="text-muted"></small>
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
      listings: []
    };
  },
  mounted() {
    this.getListings();
  },
  methods: {
    getListings() {
      axios
        .get("http://localhost:3000/listings")
        .then(result => {
          this.listings = result.data;
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
</style>