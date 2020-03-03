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
import { pipe, map, switchMap, take, delay } from "rxjs/operators";
import { useSoulsGames } from "../api/speedsouls";

export default {
  name: "Home",
  data: () => ({
    data: undefined,
    error: null,
    source: null
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
    this.source = useSoulsGames().subscribe(this.onSuccess, this.onError);
  },
  unmounted() {
    this.source.unsubscribe();
  }
};
</script>
