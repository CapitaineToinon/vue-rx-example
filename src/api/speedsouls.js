import { ajax } from "rxjs/ajax";
import { map, startWith, flatMap, find, delay } from "rxjs/operators";
import CACHE from './cache'

const API_ENDPOINT = "https://www.speedrun.com/api/v1";
const SERIE = "souls"

function getSoulsGames() {
  return ajax.getJSON(`${API_ENDPOINT}/series/${SERIE}/games?embed=categories,variables`).pipe(
    map(response => response.data)
  )
}

function getLeaderboard(gameid, categoryid) {
  return ajax.getJSON(`${API_ENDPOINT}/leaderboards/${gameid}/category/${categoryid}`).pipe(
    map(response => response.data)
  )
}

export function useSoulsGames() {
  return CACHE.get('getSoulsGames', getSoulsGames())
}

export function useSoulsGame(lookFor) {
  return useSoulsGames().pipe(
    startWith([]),
    flatMap(data => data),
    find(game => game.id === lookFor),
    map(game => {
      if (!game) {
        throw new Error("Game not found");
      }

      return game;
    })
  )
}

export function useSoulsCategory(gameid, categoryid) {
  return useSoulsGame(gameid).pipe(
    flatMap(game => game.categories.data),
    find(category => category.id === categoryid),
    map(category => {
      if (!category) {
        throw new Error("Category not found");
      }

      return category;
    })
  )
}

export function useLeaderboard(gameid, categoryid) {
  return CACHE.get(`getSoulsGames/${gameid}/${categoryid}`, getLeaderboard(gameid, categoryid))
}
