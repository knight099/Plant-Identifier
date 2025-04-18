# Plant Identifier using Gemini API and Next.js

This project is a Plant Identifier application built with Next.js and powered by the Gemini API. The application allows users to identify plants by uploading images, and it provides detailed information about the identified plants.

## Features

- Upload plant images for identification
- Retrieve detailed information about identified plants
- User-friendly interface built with Next.js
- Integration with Gemini API for plant identification

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Gemini API key

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/plant-ai-assistant.git
    cd plant-ai-assistant
    ```

2. Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3. Create a `.env.local` file in the root directory and add your Gemini API key:
    ```env
    NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
    ```

### Running the Application

To start the development server, run:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

To build the application for production, run:
```bash
npm run build
npm run start
# or
yarn build
yarn start
```

## Usage

1. Open the application in your browser.
2. Upload an image of the plant you want to identify.
3. View the identification results and detailed information about the plant.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Gemini API](https://gemini.com/api)
