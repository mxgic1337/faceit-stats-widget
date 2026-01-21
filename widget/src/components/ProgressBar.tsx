export const ProgressBar = ({
  level,
  elo,
  currentEloDistribution,
}: {
  level: number;
  elo: number;
  currentEloDistribution: [number, (string | number)[]];
}) => {
  return (
    <div className={'progress-bar'}>
      <div
        className={'progress'}
        style={{
          width:
            level === 10
              ? '100%'
              : `${((elo - (currentEloDistribution[1][1] as number)) / ((currentEloDistribution[1][2] as number) - (currentEloDistribution[1][1] as number))) * 100}%`,
        }}
      ></div>
    </div>
  );
};
