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
import { startWith } from "rxjs/operators";

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
    leaderboardError: null,
    leaderboardSource: null
  }),
  watch: {
    game: {
      immediate: true,
      handler(val, oldVal) {
        if (val === oldVal) return;
        this.leaderboardSub(this.game, this.category);
      }
    },
    category: {
      immediate: true,
      handler(val, oldVal) {
        if (val === oldVal) return;
        this.leaderboardSub(this.game, this.category);
      }
    }
  },
  methods: {
    leaderboardSub(game, category) {
      this.leaderboardUnsub();
      this.leaderboardSource = useLeaderboard(game, category)
        .pipe(startWith(undefined))
        .subscribe(this.onLeaderboardSuccess, this.onLeaderboardError);
    },
    leaderboardUnsub() {
      if (this.leaderboardSource) this.leaderboardSource.unsubscribe();
    },
    onLeaderboardSuccess(data) {
      console.log(data);
      this.error = null;
      this.leaderboard = data;
    },
    onLeaderboardError(error) {
      this.leaderboardError = error;
    }
  }
};
</script>