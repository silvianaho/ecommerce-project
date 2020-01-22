<!--
Name: Silviana
Student ID = p1939213
Course : DIT/FT/1B/14
-->

<template>
  <div class="bg" id="large-header">
    <canvas id="demo-canvas"></canvas>
    <div id="login" class="loginpan w-100 d-flex justify-content-center align-items-center">
      <div class="container overflow-hidden" v-bind:class="{'sign-up-active' : signUp}">
        <!-- overlays -->
        <div class="overlay-container w-50 h-100 overflow-hidden">
          <div class="overlay h-100">
            <!-- login overlay -->
            <div
              class="overlay-left h-100 w-50 p-5 text-center d-flex justify-content-center flex-column align-items-center"
            >
              <h2 class="m-0">Welcome Back!</h2>
              <p>Please login with your personal info</p>
              <button class="invert px-4 py-1" id="signIn" @click="signUp = !signUp">Log In</button>
            </div>
            <!-- singup overlay -->
            <div
              class="overlay-right h-100 w-50 p-5 text-center d-flex justify-content-center flex-column align-items-center"
            >
              <h2 class="m-0">Hello, Friend!</h2>
              <p>Please enter your personal details</p>
              <button class="invert px-4 py-1" id="signUp" @click="signUp = !signUp">Sign Up</button>
            </div>
          </div>
        </div>
        <!-- Signup form -->
        <form
          class="sign-up w-50 py-5 px-md-5 px-3 text-center d-flex justify-content-around flex-column align-items-center"
          action="/"
          v-on:submit.prevent="handleSignup()"
        >
          <h2>Create Your Account</h2>
          <div>Use your email for registration</div>
          <input
            type="text"
            id="su-name"
            placeholder="Username"
            class="mt-2 w-100"
            v-model="signup.username"
            @change="errors = []"
            required
          />
          <input
            type="email"
            id="su-email"
            class="mt-2 w-100"
            placeholder="Email"
            v-model="signup.email"
            @change="errors = []"
            required
          />
          <input
            type="password"
            id="su-password"
            class="mt-2 mb-1 w-100"
            placeholder="Password"
            v-model="signup.password"
            required
          />
          <p class="text-danger mb-0" v-if="errors.length">{{errors[0]}}</p>
          <button class="px-4 py-1 mb-3" type="submit">
            Sign
            Up
          </button>
          <p class="mobile-switch" id="su-mobile-switch">
            Already have an account?
            <a href="#" class="text-dark" @click="signUp = !signUp">Login</a>
          </p>
        </form>
        <!-- login form -->
        <form
          class="sign-in w-50 py-5 px-md-5 px-3 text-center d-flex justify-content-around flex-column align-items-center"
          action="/"
          v-on:submit.prevent="handleLogin()"
        >
          <h2>Log In</h2>
          <div>Use your account</div>
          <input
            type="text"
            id="si-email"
            class="mt-2 w-100"
            placeholder="Username"
            v-model="signin.username"
            name="si_email"
            required
          />
          <input
            type="password"
            id="si-password"
            class="mt-2 mb-1 w-100"
            placeholder="Password"
            v-model="signin.password"
            required
          />
          <p class="text-danger" v-if="errors.length">{{errors[0]}}</p>
          <a class="text-dark" href="#">Forgot your password?</a>
          <button class="px-4 py-1 my-3" type="submit">
            Log
            In
          </button>
          <p class="mobile-switch" id="si-mobile-switch">
            Don't have an account?
            <a href="#" class="text-dark" @click="signUp = !signUp">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";
import EventBus from "./EventBus";

export default {
  name: "SignUp",
  data() {
    return {
      signup: {
        username: "",
        email: null,
        password: null
      },
      signin: {
        username: null,
        password: null
      },
      userid: null,
      signUp: false,
      errors: []
    };
  },
  // I want to add fancy background animation
  created() {
    let TweenLite = document.createElement("script");
    TweenLite.setAttribute(
      "src",
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/499416/TweenLite.min.js"
    );
    document.body.appendChild(TweenLite);

    let EasePack = document.createElement("script");
    EasePack.setAttribute(
      "src",
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/499416/EasePack.min.js"
    );
    document.body.appendChild(EasePack);

    let demo = document.createElement("script");
    demo.setAttribute(
      "src",
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/499416/demo.js"
    );
    document.body.appendChild(demo);
  },

  methods: {
    handleLogin() {
      axios
        .post("http://localhost:3000/login", this.signin)
        .then(result => {
          localStorage.setItem("usertoken", result.data.token);
          localStorage.setItem("userid", result.data.userid);
          router.push({ name: "listings" });
          this.emitMethod();
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error(error);
          // eslint-disable-next-line no-console
          console.log(error.response.data.error);
          this.errors = [];
          this.errors.push(error.response.data.error);
        });
    },
    emitMethod() {
      EventBus.$emit("logged-in", "loggedin");
    },
    handleSignup() {
      axios
        .post("http://localhost:3000/users", this.signup)
        .then(result => {
          // eslint-disable-next-line no-console
          console.log(result);
          location.reload();
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error(error);
          this.errors = [];
          this.errors.push(error.response.data.error);
        });
    }
  }
};
</script>


<style lang="scss" scoped>
@mixin overlays($property) {
  position: absolute;
  top: 0;
  transform: translateX($property);
  transition: transform 0.5s ease-in-out;
}

.bg {
  height: 92vh !important;
  overflow: hidden;
  background-color: rgba(5, 13, 31, 0.959);
  background-size: contain;
}

.canvas {
  height: 90vh !important;
  width: 100vh !important;
}

.loginpan {
  position: absolute;
  margin: 0;
  padding: 0;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
}

.container {
  position: relative;
  border-radius: 10px;
  width: 55vw;
  height: 65vh;
  background-color: rgb(241, 241, 241);
  .overlay-container {
    position: absolute;
    top: 0;
    left: 50%;
    transition: transform 0.5s ease-in-out;
    z-index: 100;
  }
  .overlay {
    position: relative;
    left: -100%;
    width: 200%;
    background: linear-gradient(
      to bottom right,
      rgb(0, 18, 83),
      rgb(4, 91, 179)
    );
    color: #fff;
    transform: translateX(0);
    transition: transform 0.5s ease-in-out;
  }
  .overlay-left {
    @include overlays(-20%);
  }
  .overlay-right {
    @include overlays(0);
    right: 0;
  }
}

button {
  border-radius: 20px;
  border: 1px solid rgba(0, 18, 83, 1);
  background-color: rgb(23, 48, 138);
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
  transition: transform 0.1s ease-in;
  &:active {
    transform: scale(0.9);
  }
  &:focus {
    outline: none;
  }
  &.invert {
    background-color: transparent;
    border-color: #fff;
  }
  &.mobile-switcher {
    background-color: transparent;
    color: #000;
    text-transform: none;
    font-weight: normal;
    letter-spacing: 0;
    border: none;
  }
}

form {
  // color: #000;
  position: absolute;
  top: 0;
  transition: all 0.5s ease-in-out;
  margin-top: 7%;
  background-color: rgb(241, 241, 241);
  div {
    font-size: 1rem;
  }
  input {
    border: none;
    border-bottom: 2px solid #0000008a;
    padding: 10px;
    // margin: 10px;
    background-color: transparent;
    overflow: hidden;
    &:focus {
      outline: none;
    }
  }
}

.sign-in {
  left: 0;
  z-index: 2;
}

.sign-up {
  left: 0;
  z-index: 1;
  opacity: 0;
}

.sign-up-active {
  .sign-in {
    transform: translateX(100%);
    display: none;
  }
  .sign-up {
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
    animation: show 0.5s;
  }
  .overlay-container {
    transform: translateX(-100%);
  }
  .overlay {
    transform: translateX(50%);
  }
  .overlay-left {
    transform: translateX(0);
  }
  .overlay-right {
    transform: translateX(20%);
  }
}

@keyframes show {
  0% {
    opacity: 0;
    z-index: 1;
  }
  49% {
    opacity: 0;
    z-index: 1;
  }
  50% {
    opacity: 1;
    z-index: 10;
  }
}

@media (min-width: 450px) {
  .mobile-switch {
    display: none;
  }
}

@media (max-width: 800px) {
  .container {
    width: 90vw;
  }
}

@media (max-width: 450px) {
  .overlay-container {
    display: none;
  }
  form {
    width: 100% !important;
  }

  .sign-up-active {
    .sign-in {
      transform: translateX(100%);
      display: none;
    }
    .sign-up {
      transform: translateX(0%);
      opacity: 1;
      z-index: 5;
      animation: show 0.5s;
    }
  }
}
</style>