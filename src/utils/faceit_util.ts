export const API_KEY = import.meta.env.VITE_FACEIT_API_KEY;

/** Info about player returned by API v4 */
interface V4PlayersResponse {
  player_id: string,
  cover_image: string,
  nickname: string,
  games: {
    cs2?: {
      faceit_elo: number,
      skill_level: number,
      region: string,
    }
  }
}

/** Player match history returned by API v4 */
interface V4HistoryResponse {
  items: {
    competition_id: string,
    results: {
      score: {
        [team: string]: number
      },
      winner: string,
    },
    finished_at: number,
    teams: {
      [team: string]: {
        players: {
          player_id: string,
        }[]
      },
    }
  }[]
}

/** Stats returned by API v4 */
interface V4StatsResponse {
  items: {
    stats: {
      [stat: string]: string
    },
  }[]
}

/** Player ranking returned by API v4 */
interface V4RankingResponse {
  items: {
    player_id: string,
    position: number,
  }[]
}

/**
 * FACEIT player profile.
 */
interface FaceitPlayer {
  id: string;
  username: string;
  banner?: string;
  level?: number;
  elo?: number;
  wins: number;
  ranking: number;
  losses: number;
  avg: {
    kills: number;
    hspercent: number;
    deaths: number;
    matches: number;
  };
}

const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_KEY}`
};

export function getPlayerStats(id: string, startDate: Date): Promise<FaceitPlayer | undefined> {
  return new Promise<FaceitPlayer | undefined>((resolve) => {
    fetch('https://open.faceit.com/data/v4/players/' + id, {
      headers: HEADERS
    }).then(async response => {
      if (!response.ok) {
        console.error(await response.text());
        resolve(undefined);
        return
      }
      const v4PlayersResponse = (await response.json() as V4PlayersResponse);
      if (!v4PlayersResponse.games.cs2) {
        console.error("This player never played CS2 on FACEIT.");
        resolve(undefined);
        return
      }
      fetch(`https://open.faceit.com/data/v4/players/${v4PlayersResponse.player_id}/history?game=cs2`, {
        headers: HEADERS
      }).then(async response => {
        if (!response.ok) {
          console.error(await response.text());
          resolve(undefined);
          return
        }
        const v4HistoryResponse = (await response.json() as V4HistoryResponse);

        let wins = 0;
        let losses = 0;

        for (const match of v4HistoryResponse.items) {
          if (match.finished_at < startDate.getTime() / 1000) continue;
          /* Nazwa drużyny do której należy gracz */
          let playerTeam: string | undefined = undefined;
          for (const team of Object.entries(match.teams)) {
            console.log(team[0], team[1])
            if (team[1].players.find((player => player.player_id === v4PlayersResponse.player_id))) {
              playerTeam = team[0];
            }
          }
          if (match.results.winner === playerTeam) {
            wins++;
          } else {
            losses++;
          }
        }

        fetch(`https://open.faceit.com/data/v4/players/${v4PlayersResponse.player_id}/games/cs2/stats?limit=20`, {
          headers: HEADERS
        }).then(async response => {
          if (!response.ok) {
            console.error(await response.text());
            resolve(undefined);
            return
          }
          const v4StatsResponse = (await response.json() as V4StatsResponse);

          let kills = 0;
          let deaths = 0;
          let hspercent = 0;

          for (const match of v4StatsResponse.items) {
            kills += parseInt(match.stats['Kills']);
            deaths += parseInt(match.stats['Deaths']);
            hspercent += parseFloat(match.stats['Headshots %']);
          }

          fetch(`https://open.faceit.com/data/v4/rankings/games/cs2/regions/${v4PlayersResponse.games.cs2?.region}/players/${v4PlayersResponse.player_id}`, {
            headers: HEADERS
          }).then(async response => {
            if (!response.ok) {
              console.error(await response.text());
              resolve(undefined);
              return
            }
            const v4RankingResponse = (await response.json() as V4RankingResponse);
            const rankingItem = v4RankingResponse.items.find(item => item.player_id === v4PlayersResponse.player_id);
            const ranking = rankingItem ? rankingItem.position : undefined;

            resolve({
              id: v4PlayersResponse.player_id,
              banner: v4PlayersResponse.cover_image,
              username: v4PlayersResponse.nickname,
              level: v4PlayersResponse.games.cs2?.skill_level,
              elo: v4PlayersResponse.games.cs2?.faceit_elo,
              ranking: ranking || 999999,
              wins,
              losses,
              avg: {
                kills, hspercent, deaths, matches: v4StatsResponse.items.length
              }
            });
          })
        })

      })
    })
  })
}

export function getPlayerID(username: string): Promise<string | undefined> {
  return new Promise<string | undefined>((resolve) => {
    fetch('https://open.faceit.com/data/v4/players?nickname=' + username, {
      headers: HEADERS
    }).then(async response => {
      if (!response.ok) {
        console.error(await response.text());
        resolve(undefined);
        return
      }
      const v4PlayersResponse = (await response.json() as V4PlayersResponse);
      resolve(v4PlayersResponse.player_id)
    })
  })
}