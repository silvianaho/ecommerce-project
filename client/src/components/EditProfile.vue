<template>
  <form @submit.prevent="handleSubmit(userinfo)">
    <h1>Edit Profile</h1>
    <!-- profile_pic_url -->
    <div class="row d-flex align-items-end my-3">
      <div class="col-md-3">
        <img
          v-if="userinfo != null"
          :src="userinfo.profile_pic_url"
          class="rounded-circle img-fluid"
          width="150px"
          height="150px"
          alt="profile picture"
        />
      </div>
      <div class="col-md-9">
        <div class="form-group">
          <label class="font-weight-bold ml-2" for="profile_pic_url">Profile Picture URL</label>
          <input
            type="text"
            class="form-control"
            aria-label="Profile Picture URL"
            name="profile_pic_url"
            id="profile_pic_url"
            placeholder="Profile Picture URL"
            v-model="userinfo.profile_pic_url"
            @change=" disableButton = false "
            required
          />
        </div>
      </div>
    </div>

    <!-- username -->
    <div class="form-group my-3">
      <label class="font-weight-bold ml-2" for="username">Username</label>
      <input
        type="text"
        class="form-control"
        aria-label="Username"
        name="username"
        id="username"
        placeholder="Username"
        v-model="userinfo.username"
        @change=" disableButton = false "
        required
      />
    </div>
    <div class="form-group my-3">
      <label class="font-weight-bold ml-2" for="email">Email</label>
      <input
        type="text"
        class="form-control"
        aria-label="Email"
        name="email"
        id="email"
        placeholder="Email"
        v-model="userinfo.email"
        @change=" disableButton = false "
        required
      />
    </div>

    <button
      class="btn btn-dark float-right mt-5"
      v-bind:class="{disabled: disableButton}"
      type="submit"
    >Save Changes</button>
  </form>
</template>

<script>
import EventBus from "./EventBus.vue";

export default {
  name: "EditProfile",
  props: ["userinfo"],
  data() {
    return {
      disableButton: true
    };
  },
  methods: {
    handleSubmit(userinfo) {
      EventBus.$emit("edit-profile", userinfo);
    }
  }
};
</script>

<style>
</style>