import Image from 'next/image';

interface PlantInfoProps {
  info: {
    name: string;
    description: string;
    careInstructions: string[];
    image?: string; // Optional to allow for cases without an image
  };
}

export default function PlantInfo({ info }: PlantInfoProps) {
  return (
    <div className="items-center w-full max-w-xl bg-gradient-to-r from-green-100 via-white to-green-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-xl">
      {/* Plant Image */}
      {info.image && (
        <div className="mb-4">
          <Image
            src={info.image}
            alt={info.name}
            width={400}
            height={400}
            className="items-center rounded-full border border-gray-300 dark:border-gray-600"
          />
        </div>
      )}

      {/* Plant Name */}
      <h2 className="text-3xl font-extrabold text-green-800 dark:text-green-300 mb-4">
        {info.name}
      </h2>

      {/* Plant Description */}
      <p className="text-gray-700 dark:text-gray-400 mb-6 leading-relaxed">
        {info.description}
      </p>

      {/* Care Instructions Header */}
      <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-3">
        Care Instructions 🌱
      </h3>

      {/* Care Instructions List */}
      <ul className="list-inside list-disc space-y-2">
        {info.careInstructions.map((instruction, index) => (
          <li
            key={index}
            className="text-gray-700 dark:text-gray-300 bg-green-50 dark:bg-gray-700 p-3 rounded-lg shadow-sm"
          >
            {instruction}
          </li>
        ))}
      </ul>
    </div>
  );
}
