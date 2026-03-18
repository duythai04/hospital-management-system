const Card = ({ title, value, color }) => {
  return (
    <div className={`p-5 rounded-xl text-white ${color}`}>
      <h3>{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default Card;