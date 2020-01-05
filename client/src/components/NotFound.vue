<!--
Name: Silviana
Student ID = p1939213
Course : DIT/FT/1B/14
-->

<template>
    <div class="container notfoundpage w-100">
      <div class="flex-column row h-100 justify-content-center align-items-center">
          <h1 class="d-block">Sorry, we couldn't find what you were looking for...</h1>
          <span>
            <router-link class="d-block" to="/">Home</router-link>
          </span>
      </div>
    </div>
</template>

<script>
export default {
    name:"NotFound"
};
</script>

<style>
.notfoundpage {
  height: 92vh;
}
</style>