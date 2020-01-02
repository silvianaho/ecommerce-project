<template>
  <div id="app" v-cloak>
    <NavBar />
    <router-view></router-view>
  </div>
</template>

<script>
import NavBar from "./components/NavBar";
import router from "./router";

export default {
  name: "app",
  components: {
    NavBar
  },
  data () {
    return{
    // eslint-disable-next-line no-console
    routeName: router.currentRoute.name
    }
  }
};
</script>

<style>
[v-cloak] {
  display: none;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
