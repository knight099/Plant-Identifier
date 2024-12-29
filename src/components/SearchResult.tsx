import Image from "next/image";

interface SearchResult {
  name: string;
  description: string;
  image: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  onCardClick: (result: SearchResult) => void;
}

export default function SearchResults({ results, onCardClick }: SearchResultsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((result, index) => (
        <div
          key={index}
          onClick={() => onCardClick(result)}
          className="flex flex-col items-center rounded-lg shadow-md p-4 bg-gradient-to-r from-green-100 via-white to-green-100 dark:from-gray-800 dark:to-gray-900 transform transition-transform hover:scale-105 cursor-pointer"
        >
          <Image
            src={result.image}
            alt={result.name}
            width={300}
            height={300}
            className="w-full h-48 object-cover rounded-md"
          />
          <h3 className="text-green-800 dark:text-green-300 text-lg font-bold mt-4">
            {result.name}
          </h3>
          <p className="text-gray-700 dark:text-gray-400 text-sm">
            {result.description}
          </p>
        </div>
      ))}
    </div>
  );
}
