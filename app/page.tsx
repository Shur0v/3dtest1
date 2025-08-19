"use client"
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

const RotatingBall = ({ color, emissiveIntensity, textureUrl }: { color: string, emissiveIntensity: number, textureUrl: string | null }) => {

  const meshRef = useRef<Mesh>(null)
  
  // Always call useLoader, but with a fallback URL when textureUrl is null
  const texture = useLoader(TextureLoader, textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');

  useFrame( () => {

    if( meshRef.current ) {
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.01
    }

  } )

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial 
        color={textureUrl ? "#ffffff" : color} 
        emissive={textureUrl ? "#000000" : color} 
        emissiveIntensity={textureUrl ? 0 : emissiveIntensity}
        map={textureUrl ? texture : null}
      />
    </mesh>
  )
}

export default function Home() {
  // Default/Standard values
  const defaultValues = {
    objectColor: "#F8F8FF", // Ghost white for marble look
    emissiveIntensity: 0,
    lightIntensity: 5,
    lightColor: "#ffffff",
    isLightOn: true,
    textureUrl: null
  };

  const [objectColor, setObjectColor] = useState(defaultValues.objectColor);
  const [emissiveIntensity, setEmissiveIntensity] = useState(defaultValues.emissiveIntensity);
  const [lightIntensity, setLightIntensity] = useState(defaultValues.lightIntensity);
  const [lightColor, setLightColor] = useState(defaultValues.lightColor);
  const [isLightOn, setIsLightOn] = useState(defaultValues.isLightOn);
  const [textureUrl, setTextureUrl] = useState<string | null>(defaultValues.textureUrl);

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTextureUrl(url);
    }
  };

  // Reset all values to default
  const resetToDefault = () => {
    setObjectColor(defaultValues.objectColor);
    setEmissiveIntensity(defaultValues.emissiveIntensity);
    setLightIntensity(defaultValues.lightIntensity);
    setLightColor(defaultValues.lightColor);
    setIsLightOn(defaultValues.isLightOn);
    setTextureUrl(defaultValues.textureUrl);
  };

  return (
    <div className="relative w-screen h-screen">
      <Canvas className="w-full h-full"> 
        
        <OrbitControls enableZoom enablePan enableRotate />
        <directionalLight 
          position={[1, 1, 1]} 
          intensity={isLightOn ? lightIntensity : 0} 
          color={lightColor} 
        />
        <color attach="background" args={["#f0f0f0"]} />

        <RotatingBall color={objectColor} emissiveIntensity={emissiveIntensity} textureUrl={textureUrl} />
        
      </Canvas>

      {/* Control Panel */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg w-80 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Controls</h3>
          <button
            onClick={resetToDefault}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Image Upload */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Upload Texture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {textureUrl && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-green-600">✓ Texture applied</span>
              <button
                onClick={() => setTextureUrl(null)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          )}
        </div>
        
        {/* Object Color Control */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Ball Color {textureUrl && "(Hidden when texture is applied)"}
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={objectColor}
              onChange={(e) => setObjectColor(e.target.value)}
              className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
              disabled={!!textureUrl}
            />
            <span className="text-sm text-gray-600">{objectColor}</span>
          </div>
        </div>

        {/* Emissive Intensity Control */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Glow Intensity {textureUrl && "(Disabled when texture is applied)"}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={emissiveIntensity}
            onChange={(e) => setEmissiveIntensity(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            disabled={!!textureUrl}
          />
          <span className="text-sm text-gray-600">{emissiveIntensity.toFixed(1)}</span>
        </div>

        {/* Light Controls */}
        <div className="space-y-4 border-t pt-4">
          <h4 className="text-md font-medium text-gray-800">Light Effects</h4>
          
          {/* Light On/Off Switch */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Light Power</label>
            <button
              onClick={() => setIsLightOn(!isLightOn)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isLightOn ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isLightOn ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Light Color Control */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Light Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={lightColor}
                onChange={(e) => setLightColor(e.target.value)}
                className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-600">{lightColor}</span>
            </div>
          </div>

          {/* Light Intensity Control */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Light Intensity</label>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={lightIntensity}
              onChange={(e) => setLightIntensity(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-600">{lightIntensity}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
