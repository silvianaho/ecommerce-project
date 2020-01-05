<template>
  <nav
    class="navbar navbar-expand-md navbar-light bg-white border-bottom"
    v-bind:class="{ 'navbarOpen': showNav }"
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
        <input type="text" class="form-control" aria-label="Text input with dropdown button" />
      </div>

      <ul class="navbar-nav ml-auto mr-2">
        <!-- if not logged in -->
        <li v-if="auth=='' && (token==null || token==undefined)" class="nav-item">
          <a class="nav-link" href="#">
            <router-link to="/login" class="nav-link">Login/Register</router-link>
          </a>
        </li>

        <!-- if logged in -->
        <li v-if="auth=='loggedin' || token!=null || token!=undefined" class="nav-item">
          <div class="nav-link mr-4">
            <div class="row">
              <div class="col-6 p-0 m-0">
                <img
                  v-if="userinfo[0] != undefined"
                  :src="userinfo[0].profile_pic_url"
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
                      v-if="userinfo[0] != undefined"
                      :to="'/user/'+userinfo[0].username"
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

        <li v-if="auth=='loggedin' || token!=null || token!=undefined" class="nav-item">
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
// import router from "../router";

export default {
  name: "NavBar",
  data() {
    return {
      auth: "",
      token: localStorage.usertoken,
      userid: localStorage.userid,
      showNav: false,
      searchOption: [{ id: 1, text: "Items" }, { id: 2, text: "People" }],
      selectedsearch: "Items",
      userinfo: []
    };
  },
  created() {
    this.validateToken();
    EventBus.$on("logged-in", status => {
      this.auth = status;
      this.token = localStorage.usertoken;
      this.userid = localStorage.userid;
      axios
        .get("http://localhost:3000/users/" + this.userid)
        .then(result => {
          this.userinfo = result.data;
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    });
  },
  methods: {
    logout() {
      localStorage.removeItem("usertoken");
      localStorage.removeItem("userid");
      this.auth = "";
      this.userid = null;
      this.token = null;
    },
    reload(){
      location.reload()
    },
    toggleNavbar() {
      this.showNav = !this.showNav;
    },
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
          this.emitMethod();
        })
        .catch(error => {
          if (error.response.status === 401) {
            this.logout();
          }
        });
    },
    emitMethod() {
      EventBus.$emit("logged-in", "loggedin");
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