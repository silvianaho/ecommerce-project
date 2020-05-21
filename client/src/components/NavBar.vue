<!--
Name: Silviana
Student ID = p1939213
Course : DIT/FT/1B/14
-->

<template>
  <nav
    class="navbar navbar-expand-md navbar-light bg-white border-bottom"
    v-bind:class="{ 'navbarOpen': showNav }"
    @notlogged-in="logout(); reload()"
  >
    <a class="navbar-brand ml-2">
      <router-link to="/" class="navbar-brand">SnapSell</router-link>
    </a>
    <!-- toggle navbar on mobile -->
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#NavBar"
      aria-controls="NavBar"
      aria-expanded="false"
      aria-label="Toggle navigation"
      @click.stop="toggleNavbar()"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <!-- navbar -->
    <div class="collapse navbar-collapse" id="NavBar" v-bind:class="{ 'show': showNav }">
      <!-- search -->
      <div class="input-group my-2 w-75 mx-auto">
        <div class="input-group-prepend">
          <select class="custom-select">
            <option
              v-for="option in searchOption"
              :value="option.id"
              :key="option.id"
            >{{ option.text }}</option>
          </select>
        </div>
        <input
          type="text"
          @change="search(selectedsearch, searchForm)"
          v-model="searchForm.title"
          class="form-control"
          aria-label="Text input with dropdown button"
        />
        <button class="btn btn-outline-secondary" @click="search(selectedsearch, searchForm)">search</button>
      </div>

      <ul class="navbar-nav ml-auto mr-2">
        <!-- if not logged in -->
        <li v-if="auth=='' && (token==null || token==undefined)" class="nav-item">
          <a class="nav-link" href="#">
            <router-link to="/login" class="nav-link">Login/Register</router-link>
          </a>
        </li>

        <!-- if logged in -->
        <li v-if="auth==true || token!=null || token!=undefined" class="nav-item">
          <div class="nav-link mr-4">
            <div class="row">
              <div class="col-6 p-0 m-0">
                <img
                  v-if="userinfo != undefined"
                  :src="userinfo.profile_pic_url"
                  class="rounded-circle img-fluid"
                  width="40px"
                  height="40px"
                  alt="profile picture"
                />
              </div>
              <div class="col-2 p-0 m-0">
                <b-dropdown
                  id="user-dropdown"
                  variant="none"
                  class="p-0 m-0 vue-dropdown nav-link"
                  right
                >
                  <b-dropdown-item>
                    <router-link
                      class="text-dark text-decoration-none"
                      v-if="userinfo != undefined"
                      :to="'/user/'+userinfo.username"
                    >Profile</router-link>
                  </b-dropdown-item>
                  <b-dropdown-item v-on:click="logout(); reload()">
                    <router-link class="text-dark text-decoration-none" to="/">Log Out</router-link>
                  </b-dropdown-item>
                </b-dropdown>
              </div>
            </div>
          </div>
        </li>

        <li v-if="auth==true || token!=null || token!=undefined" class="nav-item">
          <button class="btn btn-dark" v-bind:class="{ 'w-50': showNav }">
            <router-link to="/sell" class="nav-link text-white">Sell</router-link>
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import EventBus from "./EventBus";
import axios from "axios";
import router from "../router";

export default {
  name: "NavBar",
  data() {
    return {
      auth: this.checkIfIsLogged(),
      token: localStorage.usertoken,
      userid: localStorage.userid,
      showNav: false,
      searchOption: [
        { id: 1, text: "Items" },
        { id: 2, text: "People" }
      ],
      selectedsearch: 1,
      userinfo: [],
      searchForm: {
        title: "",
        minprice: "",
        maxprice: "",
        cond: "",
        category: "",
        userid: localStorage.userid,
        lowerlimit: "",
        count: ""
      },
      searchSuccess: false
    };
  },
  created() {
    EventBus.$on("logged-in", () => {
      // eslint-disable-next-line no-console
      this.auth = this.checkIfIsLogged();
      this.token = localStorage.usertoken;
      this.userid = localStorage.userid;

      let config = {
        headers: {
          authorization: "Bearer " + localStorage.usertoken
        }
      };
      axios
        .get("http://localhost:3000/users/" + this.userid, config)
        .then(result => {
          this.userinfo = result.data;
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
      // });
    });
  },
  mounted() {
    let token = localStorage.usertoken;
    if (token) {
      this.auth = true;
      EventBus.$emit("logged-in", "loggedin");
    } else {
      this.auth = false;
    }
  },
  methods: {
    checkIfIsLogged() {
      let token = localStorage.usertoken;
      if (token) {
        return true;
      } else {
        return false;
      }
    },
    logout() {
      localStorage.removeItem("usertoken");
      localStorage.removeItem("userid");
      this.auth = "";
      this.userid = null;
      this.token = null;
      EventBus.$emit("notlogged-in");
    },
    reload() {
      location.reload();
    },
    toggleNavbar() {
      this.showNav = !this.showNav;
    },
    search(selectedsearch, searchForm) {
      switch (selectedsearch) {
        case 1:
          axios
            .get("http://localhost:3000/search/listings", {
              params: this.searchForm
            })
            .then(result => {
              // eslint-disable-next-line no-console
              console.log(searchForm.title);
              EventBus.$emit("searchtitle", [searchForm.title, searchForm.userid]);
              EventBus.$emit("searchresult", result);
              router.push(`/search/listings?title=${searchForm.title}`, {
                query: { title: this.searchForm.title }
              });
            })
            .catch(error => {
              EventBus.$emit("no-searchresult", this.searchSuccess = false);
              // eslint-disable-next-line no-console
              console.error(error);
              router.push(`/search/listings?title=${searchForm.title}`, {
                query: { title: this.searchForm.title }
              });
            });
          break;
        case 2:
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
nav {
  height: 8vh;
  position: sticky;
  z-index: 10;
  .btn,
  .custom-select {
    &:focus {
      -webkit-box-shadow: 0 0 0 0 rgba(0, 0, 0, 0) !important;
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0) !important;
    }
  }
}

.b-dropdown-item {
  &:active {
    background-color: #fff;
  }
}
.vue-dropdown {
  .btn {
    padding: 0;
    &:focus {
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0) !important;
    }
  }
  button {
    padding: 0 0 0 0 !important;
  }
}
</style>