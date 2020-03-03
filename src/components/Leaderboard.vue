<template>
  <div v-if="leaderboardError">{{ gameError }}</div>
  <div v-else-if="!leaderboard">Loading...</div>
  <div v-else>
    <ul>
      <li v-for="entry in leaderboard.runs" :key="entry.run.id">
        <a :href="entry.run.weblink">{{ entry.run.weblink }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import { useLeaderboard } from "../api/speedsouls";
import { startWith, pluck, switchMap, delay } from "rxjs/operators";

export default {
  props: {
    game: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    }
  },
  data: () => ({
    leaderboard: undefined,
    leaderboardError: null
  }),
  methods: {
    onLeaderboardSuccess(data) {
      this.error = null;
      this.leaderboard = data;
    },
    onLeaderboardError(error) {
      this.leaderboardError = error;
    }
  },
  mounted() {
    this.$subscribeTo(
      this.$watchAsObservable("game", { immediate: true }).pipe(
        pluck("newValue"),
        switchMap(game =>
          useLeaderboard(game, this.category).pipe(startWith(undefined))
        )
      ),
      this.onLeaderboardSuccess,
      this.onLeaderboardError
    );

    this.$subscribeTo(
      this.$watchAsObservable("category", { immediate: true }).pipe(
        pluck("newValue"),
        switchMap(category =>
          useLeaderboard(this.game, category).pipe(startWith(undefined))
        )
      ),
      this.onLeaderboardSuccess,
      this.onLeaderboardError
    );
  }
};
</script>