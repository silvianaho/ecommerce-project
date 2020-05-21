<template>
  <div id="editprofile">
    <div class="container my-5">
      <div class="row">
        <div class="col-md-3">
          <div id="settings-nav" class="list-group border-0">
            <a
              class="list-group-item list-group-item-action border-top-0 border-bottom-0 border-right-0"
              :class="[component === 'EditProfile' ? activeClass : '']"
              @click="component = 'EditProfile'"
            >Profile</a>
            <a
              class="list-group-item list-group-item-action border-top-0 border-bottom-0 border-right-0"
              :class="[component === 'EditPassword' ? activeClass : '']"
              @click="component = 'EditPassword'"
            >Password</a>
          </div>
        </div>
        <div class="col-md-9">
          <div class="card text-left p-5">
            <component v-bind:is="component" v-bind="currentProperties" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";
import EventBus from "../components/EventBus.vue";
import EditProfile from "../components/EditProfile";
import EditPassword from "../components/EditPassword";

export default {
  name: "Settings",
  components: {
    EditProfile,
    EditPassword
  },
  data() {
    return {
      userinfo: null,
      component: "EditProfile",
      activeClass: "bg-light text-primary border border-primary border-left",
      password: {
        password: null,
        confirmPassword: null
      },
      passwordForm: {
        password: null,
        userid: localStorage.userid
      }
    };
  },

  beforeRouteEnter(to, from, next) {
    const token = localStorage.getItem("usertoken");
    return token ? next() : next("/login");
  },

  created() {
    this.getUserInfo();
    EventBus.$on("edit-profile", result => {
      axios
        .put(
          "http://localhost:3000/users/" + localStorage.userid + "/profile",
          result,
          {
            headers: {
              authorization: "Bearer " + localStorage.usertoken
            }
          }
        )
        .then(alert("Changes successfully Saved!"), location.reload())
        // eslint-disable-next-line no-console
        .catch(err => {
          if (err.message == "Request failed with status code 401") {
            alert("Your session has expired, please log in again");
            router.push({ name: "login" });
          }
        });
    });
    EventBus.$on("edit-password", result => {
      this.passwordForm.password = result;
      axios
        .put(
          "http://localhost:3000/users/" + localStorage.userid + "/pwd",
          this.passwordForm,
          {
            headers: {
              authorization: "Bearer " + localStorage.usertoken
            }
          }
        )
        .then(alert("Changes successfully Saved!"), location.reload())
        .catch(err => {
          if (err.message == "Request failed with status code 401") {
            alert("Your session has expired, please log in again");
            router.push({ name: "login" });
          }
        });
    });
  },
  methods: {
    getUserInfo() {
      axios
        .get("http://localhost:3000/users/" + localStorage.userid)
        .then(result => {
          this.userinfo = result.data;
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
    },
    editProfile(userinfo) {
      // eslint-disable-next-line no-console
      console.log(userinfo);
      // eslint-disable-next-line no-console
      console.log("hello");
    }
  },
  computed: {
    currentProperties: function() {
      return this.component === "EditProfile"
        ? { userinfo: this.userinfo }
        : { password: this.password };
    }
  }
};
</script>

<style>
</style>