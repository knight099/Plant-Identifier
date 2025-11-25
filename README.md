# Plant AI Assistant 🌿

An intelligent plant identification and care companion powered by **Google's Gemini 2.5 Flash** and **Next.js**.

![Plant AI Assistant Demo](https://via.placeholder.com/800x400?text=Plant+AI+Assistant+Demo)

## 🚀 Features

- **📸 Instant Identification**: Upload an image or use your camera to instantly identify plants.
- **🧠 Advanced Analysis**: Uses `gemini-2.5-flash` for high-speed, accurate plant details and care instructions.
- **💬 Interactive Chat**: Ask follow-up questions about watering, light, soil, and propagation.
- **🔍 Smart Search**: Search for any plant to get detailed info.
    - **Variety Support**: Searching for "Rose" returns specific types like "Peace Rose" or "Red Rose".
- **🖼️ AI Image Generation**: Integrated **Pollinations.ai** to generate realistic plant images on the fly (Unlimited & Free).
- **✨ Dynamic UI**: Beautiful, responsive interface with glassmorphism effects and smooth animations.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Model**: [Google Gemini 2.5 Flash](https://deepmind.google/technologies/gemini/) (`gemini-2.5-flash`)
- **Image Gen**: [Pollinations.ai](https://pollinations.ai/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- A Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/plant-ai-assistant.git
   cd plant-ai-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

5. **Open the App**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage Guide

1. **Identify a Plant**: Click "Upload Image" or "Take Photo". The AI will analyze it and provide a detailed care card.
2. **Search**: Use the search bar to find info on any plant. Try searching for "Fern" or "Cactus".
3. **Chat**: Once a plant is selected, use the chat interface to ask specific questions like "Is this toxic to pets?" or "How often should I fertilize?".

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
