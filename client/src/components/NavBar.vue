<template>
  <nav
    class="navbar navbar-expand-md navbar-light bg-white border-bottom"
    v-bind:class="{ 'navbarOpen': showNav }"
  >
    <a class="navbar-brand ml-2"><router-link to="/" class="navbar-brand">SnapSell</router-link></a>
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
    <div class="collapse navbar-collapse bg-white" id="NavBar" v-bind:class="{ 'show': showNav }">
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
        <li class="nav-item active">
          <a class="nav-link" href="#">
            <router-link to="/login" class="nav-link">Login/Register</router-link>
          </a>
        </li>
        <!-- <li class="nav-item">
          <a class="nav-link" href="#">
            <router-link to="/signup" class="nav-link">Register</router-link>
          </a>
        </li> -->
        <li class="nav-item">
          <button class="btn btn-dark" v-bind:class="{ 'w-50': showNav }">
            <router-link to="/sell" class="nav-link text-white">Sell</router-link>
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      showNav: false,
      searchOption: [{ id: 1, text: "Items" }, { id: 2, text: "People" }],
      selectedsearch: "Items"
    };
  },
  methods: {
    toggleNavbar() {
      this.showNav = !this.showNav;
    }
  }
};
</script>

<style scoped>
nav {
  height: 8vh;
  position: sticky;
  z-index: 10;
}
</style>