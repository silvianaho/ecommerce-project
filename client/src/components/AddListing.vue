<template>
  <div class="container mt-5">
    <h2 class="font-weight-bold text-left">What are you listing today?</h2>
    <p class="text-left">Upload photos of your item or choose a category to get started.</p>
    <form @submit.prevent="addListing()">
      <div class="row">
        <div class="col-md-4">
          <!-- Upload a pict -->
          <div class="card p-5">
            <label class="btn btn-dark"> Select File
              <input class="d-none" type="file" accept="image/jpeg" @change="onFileUpload"/>
            </label>
          </div>
        </div>
        <!-- form -->
        <div class="col-md-8">
          <div class="card py-4 px-3 text-left">
            <!-- categories -->
            <div class="form-group">
              <label class="h5 font-weight-bold ml-2" for="selectCategory">Category</label>
              <select
                class="form-control"
                id="selectCategory"
                name="selectCategory"
                v-model="newListing.fk_category_id"
                required
                @click="validateToken();"
              >
                <option value="-1" disabled selected>Select a category...</option>
                <option
                  v-for="category in categories"
                  :key="category.categoriesid"
                  :value="category.categoriesid"
                >{{category.categoriestxt}}</option>
              </select>
            </div>
            <div v-if="newListing.fk_category_id != -1">
              <!-- title -->
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
                  required
                />
              </div>
              <!-- condition -->
              <div class="form-group">
                <label class="h5 font-weight-bold ml-2" for="condition">Item Condition</label>
                <div class="row">
                  <div v-for="condition in conditions" :key="condition.id" class="col-3">
                    <div class="custom-control custom-radio">
                      <input
                        type="radio"
                        :id="condition.text"
                        :name="condition.text"
                        :value="condition.text"
                        v-model="newListing.item_condition"
                        class="custom-control-input"
                      />
                      <label class="custom-control-label" :for="condition.text">{{condition.text}}</label>
                    </div>
                  </div>
                </div>
              </div>
              <!-- price -->
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
                    min="0"
                  />
                </div>
              </div>
              <!-- description -->
              <div class="form-group">
                <label class="h5 font-weight-bold ml-2" for="description">Description</label>
                <textarea cols="5" rows="5" class="form-control" v-model="newListing.description"></textarea>
              </div>

              <button class="btn btn-dark">Add Listing</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";

export default {
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
      newListing: {
        title: "",
        description: "",
        price: 0,
        fk_category_id: -1,
        fk_poster_id: parseInt(localStorage.userid),
        item_condition: 0,
        picture: null
      }
    };
  },
  mounted() {
    this.getCategories();
    this.validateToken();
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
    },
    onFileUpload(event) {
      this.newListing.picture = event.target.files[0];
    },
    addListing() {
      const formData = new FormData();
      formData.append(this.newListing);
      axios
        .post("http://localhost:3000/listings", this.newListing, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(router.push({ name: "profile" }))
        .catch(function(error) {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    }
  }
};
</script>

<style scoped>
textarea {
  resize: none;
}
</style>