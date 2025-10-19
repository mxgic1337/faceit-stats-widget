export const API_KEY = import.meta.env.VITE_FACEIT_API_KEY;

export const SAMPLE_PLAYER_ID = '24180323-d946-4bb7-a334-be3e96fcac05';

/** Competition ID of official matches */
export const OFFICIAL_COMPETITION_IDS = [
  'f4148ddd-bce8-41b8-9131-ee83afcdd6dd' /* EU Queue */,
  '3aced33b-f21c-450c-91d5-10535164e0ab' /* NA Queue */,
  '73557c8e-4b67-4ac8-bae0-e910b49a5fa0' /* SA Queue */,
];

/** Info about player returned by API v4 */
interface V4PlayersResponse {
  player_id: string;
  avatar: string;
  cover_image: string;
  nickname: string;
  games: {
    cs2?: {
      faceit_elo: number;
      skill_level: number;
      region: string;
    };
  };
}

/** Stats returned by API v4 */
interface V4StatsResponse {
  items: {
    stats: {
      [stat: string]: string | number;
    };
  }[];
}

/** Player ranking returned by API v4 */
interface V4RankingResponse {
  items: {
    player_id: string;
    position: number;
  }[];
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
    kd: number;
    wins: number;
    matches: number;
  };
  lastMatchId: string | undefined;
}

const HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${API_KEY}`,
};

export function getPlayerStats(
  id: string,
  matchCount: number,
  startDate: Date,
  onlyOfficial: boolean
): Promise<FaceitPlayer | undefined> {
  return new Promise<FaceitPlayer | undefined>((resolve) => {
    fetch('https://open.faceit.com/data/v4/players/' + id, {
      headers: HEADERS,
    }).then(async (response) => {
      if (!response.ok) {
        console.error(await response.text());
        resolve(undefined);
        return;
      }

      const v4PlayersResponse = (await response.json()) as V4PlayersResponse;
      if (!v4PlayersResponse.games.cs2) {
        console.error('This player never played CS2 on FACEIT.');
        resolve(undefined);
        return;
      }

      const playerId: string = v4PlayersResponse.player_id;
      const username: string = v4PlayersResponse.nickname;
      const banner: string | undefined = v4PlayersResponse.cover_image;
      const level: number = v4PlayersResponse.games.cs2?.skill_level || 1;
      const elo: number = v4PlayersResponse.games.cs2?.faceit_elo || 100;
      let ranking: number | undefined = undefined;
      let wins: number = 0;
      let losses: number = 0;
      let kills: number = 0;
      let hspercent: number = 0;
      let deaths: number = 0;
      let wrWins: number = 0;
      let kd: number = 0;
      let lastMatchId: string | undefined = undefined;

      let matchesLength: number = 0;

      const matchStats = await fetch(
        `https://open.faceit.com/data/v4/players/${playerId}/games/cs2/stats?limit=100`,
        {
          headers: HEADERS,
        }
      );

      if (matchStats.ok) {
        /* Average stats from last 20/30 matches */

        const v4StatsResponse = (await matchStats.json()) as V4StatsResponse;
        matchesLength = v4StatsResponse.items.length;
        matchesLength = matchesLength > matchCount ? matchCount : matchesLength;

        const lastMatch = v4StatsResponse.items[0];
        lastMatchId = lastMatch
          ? (lastMatch.stats['Match Id'] as string)
          : undefined;

        let i = 0;
        for (const match of v4StatsResponse.items) {
          const countWins = () => {
            if (
              (match.stats['Match Finished At'] as number) < startDate.getTime()
            )
              return;
            if (match.stats['Result'] === '1') {
              wins++;
            } else if (match.stats['Result'] === '0') {
              losses++;
            }
          };

          if (
            !onlyOfficial ||
            OFFICIAL_COMPETITION_IDS.includes(
              match.stats['Competition Id'] as string
            )
          ) {
            countWins();
          }

          if (i >= matchCount) continue;
          kills += parseInt(match.stats['Kills'] as string);
          deaths += parseInt(match.stats['Deaths'] as string);
          kd += parseFloat(match.stats['K/D Ratio'] as string);
          hspercent += parseFloat(match.stats['Headshots %'] as string);
          if (match.stats['Result'] === '1') {
            wrWins++;
          }
          i++;
        }
      } else {
        console.error(
          `Failed to fetch match stats: ${matchStats.status} ${await matchStats.text()}`
        );
      }

      const rankingResponse = await fetch(
        `https://open.faceit.com/data/v4/rankings/games/cs2/regions/${v4PlayersResponse.games.cs2?.region}/players/${v4PlayersResponse.player_id}`,
        {
          headers: HEADERS,
        }
      );

      if (rankingResponse.ok) {
        const v4RankingResponse =
          (await rankingResponse.json()) as V4RankingResponse;
        const rankingItem = v4RankingResponse.items.find(
          (item) => item.player_id === v4PlayersResponse.player_id
        );
        ranking = rankingItem ? rankingItem.position : undefined;
      } else {
        console.error(
          `Failed to fetch ranking: ${rankingResponse.status} ${await rankingResponse.text()}`
        );
      }

      resolve({
        id: playerId,
        banner,
        username,
        level,
        elo,
        ranking: ranking || 999999,
        wins,
        losses,
        avg: {
          kills,
          hspercent,
          deaths,
          wins: wrWins,
          matches: matchesLength,
          kd,
        },
        lastMatchId,
      });
    });
  });
}

export function getPlayerID(username: string): Promise<string | undefined> {
  return new Promise<string | undefined>((resolve) => {
    fetch('https://open.faceit.com/data/v4/players?nickname=' + username, {
      headers: HEADERS,
    }).then(async (response) => {
      if (!response.ok) {
        console.error(await response.text());
        resolve(undefined);
        return;
      }
      const v4PlayersResponse = (await response.json()) as V4PlayersResponse;
      resolve(v4PlayersResponse.player_id);
    });
  });
}

export function getPlayerProfile(
  username: string
): Promise<V4PlayersResponse | undefined> {
  return new Promise<V4PlayersResponse | undefined>((resolve) => {
    fetch(
      `https://open.faceit.com/data/v4/players${username.length > 12 ? `/${username}` : `?nickname=${username}`}`,
      {
        headers: HEADERS,
      }
    ).then(async (response) => {
      if (!response.ok) {
        console.error(await response.text());
        resolve(undefined);
        return;
      }
      const v4PlayersResponse = (await response.json()) as V4PlayersResponse;
      resolve(v4PlayersResponse);
    });
  });
}
