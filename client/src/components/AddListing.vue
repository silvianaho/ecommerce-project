<template>
  <div class="container mt-5">
    <h2 class="font-weight-bold text-left">What are you listing today?</h2>
    <p class="text-left">Upload photos of your item or choose a category to get started.</p>
    <form @submit.prevent="addListing()" enctype="multipart/form-data">
      <div class="row">
        <div class="col-md-4">
          <!-- Upload a pict -->
          <div class="card p-5">
            <label class="btn btn-dark" v-if="newListing.file == null">
              Select File
              <input
                class="d-none"
                type="file"
                accept="image/jpeg"
                @change="onFileSelect"
                required
              />
            </label>
            <img v-if="picurl" :src="picurl" class="w-100" :alt="newListing.file.name" />
            <p v-if="picurl" class="w-100">{{newListing.file.name}}</p>
            <p class="card-title text-danger" v-if="errors.pic != undefined">{{ errors.pic }}</p>
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
                <option value="0" disabled selected>Select a category...</option>
                <option
                  v-for="category in categories"
                  :key="category.categoriesid"
                  :value="category.categoriesid"
                >{{category.categoriestxt}}</option>
              </select>
            </div>
            <div v-if="newListing.fk_category_id != 0 || newListing.file != null">
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
                    step="0.01"
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
        fk_category_id: 0,
        fk_poster_id: parseInt(localStorage.userid),
        item_condition: 0,
        file: null
      },
      errors: {},
      picurl: null
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
    onFileSelect(event) {
      var jpgExtension = new RegExp(/(.*)\.jpg/i);
      var file = event.target.files[0];

      if (file.size > 1000000 || !jpgExtension.test(file.name)) {
        this.errors.pic = "Please attach a .jpg file below 1MB";
      } else {
        // eslint-disable-next-line no-console
        console.log(event);
        // eslint-disable-next-line no-console
        console.log(event.target.files[0]);
        // eslint-disable-next-line no-console
        console.log(URL.createObjectURL(event.target.files[0]));
        this.picurl = URL.createObjectURL(event.target.files[0]);
        this.errors.pic = null;
        this.newListing.file = event.target.files[0];
      }
    },
    async addListing() {
      const formData = new FormData();
      formData.append("title", this.newListing.title);
      formData.append("description", this.newListing.description);
      formData.append("price", this.newListing.price);
      formData.append("fk_category_id", this.newListing.fk_category_id);
      formData.append("fk_poster_id", this.newListing.fk_poster_id);
      formData.append("item_condition", this.newListing.item_condition);
      formData.append("file", this.newListing.file);
      axios
        .post("http://localhost:3000/listings", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(result => {
          // eslint-disable-next-line no-console
          console.log(result)
          this.$nextTick(router.push({ name: "listings" }));
        })
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