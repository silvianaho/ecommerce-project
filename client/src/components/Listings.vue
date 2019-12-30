<template>
  <div class="container mt-4">
    <div class="row">
        <div class="card-deck">
            <div class="card" v-for="listing in listings" :key="listing.listingsid">
              <div class="card-body">
                <h5 class="card-title">{{listing.title}}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${{listing.price}}</h6>
                <p class="card-text">{{listing.description}}</p>
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
.card{
    height: 20vh;
}
</style>