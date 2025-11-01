export default function GameCard({ game, onSelect }) {
  return (
    <div
      onClick={() => onSelect(game)}
      className="cursor-pointer bg-white shadow-md hover:shadow-lg rounded-2xl overflow-hidden transition-transform hover:scale-105"
    >
      <img src={game.image} alt={game.title} className="w-full h-48 object-cover" />
      <div className="p-2">
        <h2 className="font-semibold text-lg">{game.title}</h2>
        <p className="text-sm text-gray-500">{game.length} hours • {game.year}</p>
      </div>
    </div>
  );
}
