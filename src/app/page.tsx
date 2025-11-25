/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import Head from 'next/head';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Upload, RotateCcw } from 'lucide-react';
import PlantInfo from '@/components/PlantInfo';
import ChatInterface from '@/components/ChatInterface';
import { identifyPlant, searchPlants } from '@/lib/gemini';
import Navbar from '@/components/NavBar';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResult';
import { SearchResult } from '@/components/SearchResult';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [plantInfo, setPlantInfo] = useState<{
    name: string;
    description: string;
    careInstructions: string[];
    image?: string;
    similarPlants?: { name: string; image: string }[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isUsingFrontCamera, setIsUsingFrontCamera] = useState(false); // Camera toggle state
  // const [searchResults, setSearchResults] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedPlantInfo, setSelectedPlantInfo] = useState<any>(null);
  const [initialMessage, setInitialMessage] = useState<string>('');

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setPlantInfo(null); // Clear previous plant info
    setSelectedPlantInfo(null); // Clear selected plant info
    try {
      console.log('Searching for:', query);
      const results = await searchPlants(query);
      console.log('Search results:', results);
      setSearchResults(results);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setIsLoading(true);
      setSearchResults([]); // Clear search results
      setSelectedPlantInfo(null); // Clear selected plant info
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string;
        setImage(base64Image);
        const plantData = await identifyPlant(base64Image) as {
          name: string;
          description: string;
          careInstructions: string[];
          similarPlants?: { name: string; image: string }[];
        };
        setPlantInfo(plantData);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: isUsingFrontCamera ? 'user' : 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  }, [isUsingFrontCamera]);

  const stopCamera = useCallback(() => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
  }, []);

  const toggleCamera = () => {
    setIsUsingFrontCamera((prev) => !prev);
  };

  useEffect(() => {
    if (showCamera) {
      stopCamera();
      startCamera();
    }
  }, [isUsingFrontCamera, showCamera, startCamera, stopCamera]); // Restart camera when state changes

  const captureImage = async () => {
    if (videoRef.current) {
      setIsLoading(true);
      setSearchResults([]); // Clear search results
      setSelectedPlantInfo(null); // Clear selected plant info
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setImage(imageData);

        const plantData = await identifyPlant(imageData) as {
          name: string;
          description: string;
          careInstructions: string[];
          similarPlants?: { name: string; image: string }[];
        };
        setPlantInfo(plantData);

        setShowCamera(false);
        stopCamera();
      } catch (error) {
        console.error('Error capturing image:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCardClick = (result: SearchResult) => {
    console.log('Clicked card:', result);
    setPlantInfo({
      name: result.name,
      description: result.description,
      careInstructions: result.careInstructions || [],
      image: result.image,
      similarPlants: result.similarPlants
    });
    setSelectedPlantInfo(result); // Set the selected plant info
    setInitialMessage(`You selected ${result.name}. How can I assist you with this plant?`);
  };

  return (
    <div>
      <Head>
        <title>Plant AI Assistant</title>
        <meta name="description" content="AI-powered assistant for plant care." />
      </Head>
      <div className="relative min-h-screen bg-gradient-to-br from-green-300 via-blue-400 to-purple-600 animate-bg-gradient">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-extrabold text-center mb-8 text-white">
            Plant AI Assistant 🌿
          </h1>

          <div className="flex flex-col items-center gap-8">
            <div className="flex gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
                disabled={isLoading}
              >
                <Upload size={20} />
                Upload Image
              </button>
              <button
                onClick={startCamera}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
                disabled={isLoading}
              >
                <Camera size={20} />
                Take Photo
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
              />
            </div>
            {/* Search Bar */}
            <div className="mb-8">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Search Results */}
            {!selectedPlantInfo ? (
              <>
                {searchResults && searchResults.length > 0 ? (
                  <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-center text-white mb-4">
                      Search Results
                    </h2>
                    {isLoading ? (
                      <p className="text-center text-gray-500">Loading results...</p>
                    ) : (
                      <SearchResults results={searchResults} onCardClick={handleCardClick} />
                    )}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 mt-8">No search results to display.</p>
                )}
              </>
            ) : null}

            {showCamera && (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  className="rounded-lg max-w-xl w-full shadow-md"
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                  <button
                    onClick={captureImage}
                    className="px-6 py-2 bg-white text-black rounded-full shadow-md"
                    disabled={isLoading}
                  >
                    Capture
                  </button>
                  <button
                    onClick={toggleCamera}
                    className="px-4 py-2 bg-gray-800 text-white rounded-full shadow-md flex items-center gap-2"
                  >
                    <RotateCcw size={20} />
                    Switch
                  </button>
                </div>
              </div>
            )}

            {!showCamera && plantInfo && (
              <div className="flex flex-col md:flex-row gap-6 mt-8 w-full items-start">
                <div className="flex-1">
                  <PlantInfo info={{ ...plantInfo, image: image || undefined }} />
                </div>

                {/* Chat Interface */}
                <div className="flex-1 animate-slide-in">
                  <ChatInterface
                    key={plantInfo.name} // Force reset when plant changes
                    plantInfo={plantInfo}
                    initialMessage={initialMessage}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
        .animate-bg-gradient {
          background-size: 400% 400%;
          animation: gradientMove 15s ease infinite;
        }

        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-slide-in {
          animation: slideIn 1s ease forwards;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      </div>
    </div>
  );
}


