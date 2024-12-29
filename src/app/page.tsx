'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Upload, RotateCcw } from 'lucide-react';
import PlantInfo from '@/components/PlantInfo';
import ChatInterface from '@/components/ChatInterface';
import { identifyPlant } from '@/lib/gemini';
import Navbar from '@/components/NavBar';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [plantInfo, setPlantInfo] = useState<{
    name: string;
    description: string;
    careInstructions: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isUsingFrontCamera, setIsUsingFrontCamera] = useState(false); // Camera toggle state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleImageUpload = async (file: File) => {
    try {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string;
        setImage(base64Image);
        const plantData = await identifyPlant(base64Image) as {
          name: string;
          description: string;
          careInstructions: string[];
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

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
  };

  const toggleCamera = () => {
    setIsUsingFrontCamera((prev) => !prev);
  };

  useEffect(() => {
    if (showCamera) {
      stopCamera();
      startCamera();
    }
  }, [isUsingFrontCamera, showCamera, startCamera]); // Restart camera when state changes

  const captureImage = async () => {
    if (videoRef.current) {
      setIsLoading(true);
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

  return (
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
                <ChatInterface plantInfo={plantInfo} />
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
  );
}


