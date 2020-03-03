<template>
  <div v-if="gameError">{{ gameError }}</div>
  <div v-else-if="!game">Loading...</div>
  <div v-else>
    <pre>{{ $route.params }}</pre>
    <ul>
      <li v-for="category in game.categories.data" :key="category.id">
        <router-link :to="`/games/${game.id}/${category.id}`">{{ category.name }}</router-link>
      </li>
    </ul>
    <div>
      <div v-if="categoryError">
        <pre>{{ categoryError }}</pre>
      </div>
      <div v-else-if="!category">Loading...</div>
      <div v-else>
        <Leaderboard :game="game.id" :category="category.id" />
      </div>
    </div>
  </div>
</template>

<script>
import { pipe, map, switchMap, take, delay, pluck } from "rxjs/operators";
import { useSoulsGame, useSoulsCategory } from "../api/speedsouls";
import Leaderboard from "../components/Leaderboard";

export default {
  name: "Home",
  components: { Leaderboard },
  data: () => ({
    game: undefined,
    gameError: null,
    category: undefined,
    categoryError: null,
  }),
  methods: {
    onGameSuccess(data) {
      this.gameError = null;

      if (!this.$route.params.category && data.categories.data.length) {
        this.$router.replace({
          name: "game",
          params: {
            game: this.$route.params.game,
            category: data.categories.data[0].id
          }
        });
      }

      this.game = data;
    },
    onGameError(error) {
      this.gameError = error;
    },
    onCategorySuccess(category) {
      this.categoryError = null;
      this.category = category;
    },
    onCategoryError(error) {
      this.categoryError = error;
    }
  },
  mounted() {
    this.$subscribeTo(
      this.$watchAsObservable("$route.params.game", { immediate: true }).pipe(
        pluck("newValue"),
        switchMap(game => useSoulsGame(game))
      ),
      this.onGameSuccess,
      this.onGameError
    );

    this.$subscribeTo(
      this.$watchAsObservable("$route.params.category", { immediate: true }).pipe(
        pluck("newValue"),
        switchMap(category => useSoulsCategory(this.$route.params.game, category))
      ),
      this.onCategorySuccess,
      this.onCategoryError
    );
  },
};
</script>