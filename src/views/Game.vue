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
import { pipe, map, switchMap, take, delay } from "rxjs/operators";
import { useSoulsGame, useSoulsCategory } from "../api/speedsouls";
import Leaderboard from "../components/Leaderboard";

export default {
  name: "Home",
  components: { Leaderboard },
  data: () => ({
    game: undefined,
    gameError: null,
    gameSource: null,
    category: undefined,
    categoryError: null,
    categorySource: null
  }),
  watch: {
    ["$route.params.game"]: {
      immediate: true,
      handler(val, oldVal) {
        if (val === oldVal) return;

        const { game } = this.$route.params;
        this.gameSub(game);
      }
    },
    ["$route.params.category"]: {
      immediate: true,
      handler(val, oldVal) {
        if (val === oldVal) return;

        const { game, category } = this.$route.params;
        if (category) {
          this.categorySub(
            this.$route.params.game,
            this.$route.params.category
          );
        }
      }
    }
  },
  methods: {
    gameSub(game) {
      this.gameUnsub();
      this.gameSource = useSoulsGame(game).subscribe(
        this.onGameSuccess,
        this.onGameError
      );
    },
    gameUnsub() {
      if (this.gameSource) this.gameSource.source.unsubscribe();
    },
    onGameSuccess(data) {
      this.error = null;

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
    categorySub(game, category) {
      this.categoryUnsub();
      this.categorySource = useSoulsCategory(game, category).subscribe(
        this.onCategorySuccess,
        this.onCategoryError,
      );
    },
    categoryUnsub() {
      if (this.categorySource) this.categorySource.unsubscribe();
    },
    onCategorySuccess(category) {
      this.categoryError = null;
      this.category = category;
    },
    onCategoryError(error) {
      this.categoryError = error;
    }
  },
  mounted() {},
  unmounted() {
    this.gameUnsub();
    this.categoryUnsub();
  }
};
</script>