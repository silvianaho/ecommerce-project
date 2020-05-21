<!--
Name: Silviana
Student ID = p1939213
Course : DIT/FT/1B/14
-->

<template>
  <div class="col-md-6 col-lg-3 mb-3">
    <div class="card h-100">
      <div class="thumbnail">
        <img
          class="mx-auto card-img-top listingimg"
          :src="`http://localhost:3000/listings/${listing.listingsid}/picture`"
          alt="Card image cap"
        />
      </div>
      <!-- card body -->
      <div class="card-body">
        <h5 class="card-title" v-if="listing.title.length < 14">{{ listing.title }}</h5>
        <h5 class="card-title" v-if="listing.title.length >= 14">{{ listing.title.substring(0,14)+".." }}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${{ listing.price }}</h6>
        <p class="small" v-if="listing.description.length < 60">{{ listing.description }}</p>
        <p class="small" v-if="listing.description.length >= 60">{{ listing.description.substring(0,60)+".." }}</p>
      </div>
      <!-- card footer -->
      <div class="card-footer text-left">
        <button
          class="hidedefaultbtn"
          v-if="listing.liked == true"
          type="button"
          @click="$emit('unlike-listing', listing)"
        >
          <small>
            <font-awesome-icon class="text-danger" :icon="['fas', 'heart']" />
          </small>
        </button>
        <button class="hidedefaultbtn" v-else type="button" @click="$emit('like-listing', listing)">
          <small>
            <font-awesome-icon :icon="['far', 'heart']" />
          </small>
        </button>
        <small class="ml-1">{{listing.likeCount}}</small>
        <small class="ml-1">
          Posted by:
          <router-link :to="'/user/' + listing.username" @click="$emit('toUserProfile', listing.username)">{{listing.username}}</router-link>
        </small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "listings",
  props: ['listing', 'imgurl'],
  data() {
    return {
      likeForm: {
        userid: null
      }
    };
  },
  method: {
    getImage(listingsid) {
      // eslint-disable-next-line no-console
      console.log("comp "+ listingsid)
      return "http://localhost:3000/listings/" + listingsid + "/picture";
    }
  }
};
</script>
<style lang="scss" scoped>
.card {
  height: 20vh;
}

.hidedefaultbtn {
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
}

.thumbnail {
  position: relative;
  height: 200px;
  width: 100%;
  overflow: hidden;
  img {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100%;
    transform: translate(-50%, -50%);
    .listingimg {
      width: 100%;
      height: auto;
    }
  }
}
</style>