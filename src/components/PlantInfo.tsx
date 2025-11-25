import Image from 'next/image';

interface PlantInfoProps {
  info: {
    name: string;
    description: string;
    careInstructions: string[];
    image?: string; // Optional to allow for cases without an image
    similarPlants?: { name: string; image: string }[];
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
      <ul className="list-inside list-disc space-y-2 mb-8">
        {info.careInstructions.map((instruction, index) => (
          <li
            key={index}
            className="text-gray-700 dark:text-gray-300 bg-green-50 dark:bg-gray-700 p-3 rounded-lg shadow-sm"
          >
            {instruction}
          </li>
        ))}
      </ul>

      {/* Similar Plants Section */}
      {info.similarPlants && info.similarPlants.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-4">
            Similar Plants 🌿
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {info.similarPlants.map((plant, index) => (
              <div key={index} className="flex flex-col items-center group">
                <div className="relative w-full aspect-square mb-2 overflow-hidden rounded-xl shadow-md">
                  <Image
                    src={plant.image}
                    alt={plant.name}
                    fill
                    className="object-cover transform transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
                <p className="text-sm font-medium text-center text-gray-800 dark:text-gray-200">
                  {plant.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
