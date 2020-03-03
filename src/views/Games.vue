<template>
  <div v-if="error">{{ error }}</div>
  <div v-else-if="!data">Loading...</div>
  <div v-else>
    <ul>
      <li v-for="game in data" :key="game.id">
        <router-link :to="`/games/${game.id}`">{{ game.names.international }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { pipe, map, switchMap, take, delay, catchError } from "rxjs/operators";
import { useSoulsGames } from "../api/speedsouls";
import { Observable, Subject, of } from "rxjs";

export default {
  name: "Home",
  data: () => ({
    data: undefined,
    error: null,
  }),
  methods: {
    onSuccess(data) {
      this.error = null;
      this.data = data;
    },
    onError(error) {
      this.error = error;
    }
  },
  mounted() {
    this.$subscribeTo(useSoulsGames(), this.onSuccess, this.onError);
  }
};
</script>
