export const Statistic = ({
  color,
  value,
  text,
}: {
  color: 'green' | 'red';
  value: string;
  text: string;
}) => {
  return (
    <div className={`stat ${color}`}>
      <p>{value}</p>
      <small>{text}</small>
    </div>
  );
};
