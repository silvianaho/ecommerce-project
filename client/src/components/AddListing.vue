<template>
  <div class="container mt-5">
    <h2 class="font-weight-bold text-left">What are you listing today?</h2>
    <p class="text-left">Upload photos of your item or choose a category to get started.</p>
    <div class="row">
      <div class="col-md-4">
        <!-- Upload a pict -->
        <div class="card p-5">
          <label>
            <input class="d-none" type="file" accept="image/jpeg" />
            <div></div>
            <button class="btn btn-dark" type="button">Select photo</button>
          </label>
        </div>
      </div>
      <!-- form -->
      <div class="col-md-8">
        <div class="card py-4 px-3 text-left">
          <div class="form-group">
            <label class="h5 font-weight-bold ml-2" for="selectCategory">Category</label>
            <select
              class="form-control"
              id="selectCategory"
              name="selectCategory"
              v-model="newListing.chosenCategory"
            >
              <option value disabled selected>Select a category...</option>
              <option
                v-for="category in categories"
                :key="category.categoriesid"
                :value="category.categoriesid"
              >{{category.categoriestxt}}</option>
            </select>
          </div>
          <div v-if="chosenCategory != ''">
            <div class="form-group">
              <label class="h5 font-weight-bold ml-2" for="listingTitle">Listing Title</label>
              <input
                type="text"
                class="form-control"
                aria-label="Listing Title"
                name="listingTitle"
                id="listingTitle"
                placeholder="Listing Title"
                v-model="newListing.title"
              />
            </div>
            <div class="form-group">
              <label class="h5 font-weight-bold ml-2" for="condition">Item Condition</label>
              <!-- Should I make a new table for conditions???? But it's only used and new..... -->
              <div class="custom-control custom-radio">
                <input type="radio" id="used" name="used" class="custom-control-input" />
                <label class="custom-control-label" for="used">Used</label>
              </div>
            </div>

            <div class="form-group">
              <label class="h5 font-weight-bold ml-2" for="price">Price</label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <!-- <p><span>S$</span></p> -->
                  <span class="input-group-text">S$</span>
                </div>
                <input
                  type="Number"
                  class="form-control"
                  aria-label="Price"
                  name="price"
                  id="price"
                  placeholder="Price"
                  v-model="newListing.price"
                />
              </div>
            </div>
            <div class="form-group">
              <label class="h5 font-weight-bold ml-2" for="description">Description</label>
              <textarea cols="5" rows="5" class="form-control" v-model="newListing.description"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      categories: [],
      newListing: {
        title: "",
        description: "",
        price: 0,
        chosenCategory: "",
        condition: "",
        fk_poster_id: null
      }
    };
  },
  mounted() {
    this.getCategories();
  },
  methods: {
    getCategories() {
      axios
        .get("http://localhost:3000/categories")
        .then(result => {
          //   console.log(result.data);

          this.categories = result.data;
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
</style>