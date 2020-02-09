<template>
  <form @submit.prevent="handleSubmit(password)">
    <h1>Change Password</h1>

    <div class="form-group my-3">
      <label class="font-weight-bold ml-2" for="newPassword">New Password</label>
      <input
        type="password"
        class="form-control"
        aria-label="New Password"
        name="password"
        id="password"
        placeholder="New Password"
        v-model="password.password"
        required
      />
    </div>
    <div class="form-group my-3">
      <label class="font-weight-bold ml-2" for="confirmPassword">Confirm Password</label>
      <input
        type="password"
        class="form-control"
        aria-label="Confirm Password"
        name="confirmPassword"
        id="confirmPassword"
        placeholder="Confirm Password"
        v-model="password.confirmPassword"
        required
      />
    </div>

    <button
      class="btn btn-dark float-right mt-5"
      v-bind:disabled="disableButton"
      type="submit"
    >Save Changes</button>
  </form>
</template>

<script>
import EventBus from "./EventBus.vue";

export default {
  name: "EditPassword",
  props: ["password"],
  data() {
    return {};
  },
  methods: {
    handleSubmit(password) {
      EventBus.$emit("edit-password", password.password);
    }
  },
  computed: {
    disableButton: function() {
      return (this.password.password !== this.password.confirmPassword);
    }
  }
};
</script>

<style>
</style>