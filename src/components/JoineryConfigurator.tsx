import React, { useState, Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Float, Text } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Box, 
  Settings, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Info,
  Maximize2,
  RotateCcw,
  Hammer,
  Palette,
  Layers
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- Constants & Types ---

const MATERIALS = [
  { id: 'walnut', name: 'American Walnut', color: '#4a3728', texture: 'rich grain', price: 1200 },
  { id: 'oak', name: 'Natural Oak', color: '#c19a6b', texture: 'light grain', price: 850 },
  { id: 'charcoal', name: 'Painted Charcoal', color: '#2d2d2d', texture: 'matte finish', price: 600 },
  { id: 'white', name: 'Painted Off-White', color: '#f5f5f0', texture: 'satin finish', price: 550 },
];

const HARDWARE = [
  { id: 'brass', name: 'Brushed Brass', color: '#b5a642', price: 150 },
  { id: 'black', name: 'Matte Black', color: '#1a1a1a', price: 80 },
  { id: 'chrome', name: 'Polished Chrome', color: '#e5e5e5', price: 100 },
];

const LAYOUTS = [
  { id: 'shelves', name: 'Full Shelving', description: 'Maximum storage for folded items', price: 200 },
  { id: 'drawers', name: 'Drawer Base', description: 'Internal soft-close drawers', price: 450 },
  { id: 'hanging', name: 'Double Hanging', description: 'Two rails for shirts and jackets', price: 150 },
];

// --- 3D Components ---

const CabinetModel = ({ material, hardware, layout }: { material: any, hardware: any, layout: any }) => {
  const group = useRef<THREE.Group>(null);

  // Simple parametric cabinet
  return (
    <group ref={group} position={[0, -1, 0]}>
      {/* Main Body */}
      <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 2.5, 0.6]} />
        <meshStandardMaterial color={material.color} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Doors (Left) */}
      <mesh position={[-0.38, 1.25, 0.31]} castShadow>
        <boxGeometry args={[0.72, 2.45, 0.02]} />
        <meshStandardMaterial color={material.color} roughness={0.5} />
      </mesh>

      {/* Doors (Right) */}
      <mesh position={[0.38, 1.25, 0.31]} castShadow>
        <boxGeometry args={[0.72, 2.45, 0.02]} />
        <meshStandardMaterial color={material.color} roughness={0.5} />
      </mesh>

      {/* Handles */}
      <mesh position={[-0.1, 1.25, 0.33]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.4]} />
        <meshStandardMaterial color={hardware.color} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.1, 1.25, 0.33]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.4]} />
        <meshStandardMaterial color={hardware.color} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Base / Plinth */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[1.55, 0.1, 0.65]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Internal visualization hint (Layout) */}
      {layout.id === 'drawers' && (
        <mesh position={[0, 0.5, 0.2]} castShadow>
          <boxGeometry args={[1.4, 0.8, 0.5]} />
          <meshStandardMaterial color={material.color} opacity={0.5} transparent />
        </mesh>
      )}
    </group>
  );
};

// --- Main Component ---

export const JoineryConfigurator = () => {
  const [material, setMaterial] = useState(MATERIALS[0]);
  const [hardware, setHardware] = useState(HARDWARE[0]);
  const [layout, setLayout] = useState(LAYOUTS[0]);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);
  const [activeTab, setActiveTab] = useState<'material' | 'hardware' | 'layout'>('material');

  const totalPrice = 2500 + material.price + hardware.price + layout.price;

  const getAiAdvice = async () => {
    setIsGeneratingAdvice(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `
          As a luxury interior designer for Hampstead Renovations, provide a brief (2-3 sentence) expert critique 
          of this joinery configuration:
          Material: ${material.name}
          Hardware: ${hardware.name}
          Layout: ${layout.name}
          
          Focus on aesthetic harmony and high-end appeal.
        `,
      });
      setAiAdvice(response.text);
    } catch (error) {
      console.error(error);
      setAiAdvice("An excellent choice. This combination reflects the timeless elegance found in Hampstead's finest homes.");
    } finally {
      setIsGeneratingAdvice(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[800px] bg-white border border-zinc-200 rounded-[32px] overflow-hidden shadow-2xl shadow-zinc-200/50">
      {/* 3D Viewer Area */}
      <div className="flex-1 bg-zinc-50 relative">
        <div className="absolute top-8 left-8 z-10">
          <h2 className="text-3xl font-light font-serif italic text-zinc-900">Bespoke Joinery</h2>
          <p className="text-xs uppercase tracking-[0.2em] font-medium text-zinc-400 mt-1">Hampstead Series 01</p>
        </div>

        <div className="absolute top-8 right-8 z-10 flex gap-2">
          <button className="p-3 bg-white rounded-full border border-zinc-200 text-zinc-400 hover:text-zinc-900 transition-all shadow-sm">
            <Maximize2 size={18} />
          </button>
          <button 
            onClick={() => {
              setMaterial(MATERIALS[0]);
              setHardware(HARDWARE[0]);
              setLayout(LAYOUTS[0]);
            }}
            className="p-3 bg-white rounded-full border border-zinc-200 text-zinc-400 hover:text-zinc-900 transition-all shadow-sm"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        <Canvas shadows camera={{ position: [3, 2, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            
            <CabinetModel material={material} hardware={hardware} layout={layout} />
            
            <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={10} blur={2} far={4} />
            <Environment preset="city" />
            <OrbitControls 
              enablePan={false} 
              minPolarAngle={Math.PI / 4} 
              maxPolarAngle={Math.PI / 1.5} 
              autoRotate 
              autoRotateSpeed={0.5}
            />
          </Suspense>
        </Canvas>

        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-lg max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-indigo-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">AI Design Critique</span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-600 italic">
              {isGeneratingAdvice ? "Analyzing your configuration..." : aiAdvice || "Select your options and click the button for expert AI advice."}
            </p>
            {!aiAdvice && !isGeneratingAdvice && (
              <button 
                onClick={getAiAdvice}
                className="mt-3 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4"
              >
                Get Expert Advice
              </button>
            )}
          </div>

          <div className="text-right">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Estimated Value</p>
            <p className="text-4xl font-light text-zinc-900">£{totalPrice.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="w-full lg:w-[400px] border-l border-zinc-100 flex flex-col bg-white">
        <div className="p-8 border-b border-zinc-100">
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setActiveTab('material')}
              className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${activeTab === 'material' ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100'}`}
            >
              <Palette size={18} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Finish</span>
            </button>
            <button 
              onClick={() => setActiveTab('hardware')}
              className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${activeTab === 'hardware' ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100'}`}
            >
              <Hammer size={18} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Hardware</span>
            </button>
            <button 
              onClick={() => setActiveTab('layout')}
              className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${activeTab === 'layout' ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100'}`}
            >
              <Layers size={18} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Layout</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'material' && (
              <motion.div
                key="material"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Primary Material</h3>
                <div className="grid grid-cols-1 gap-3">
                  {MATERIALS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMaterial(m)}
                      className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${material.id === m.id ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-100 hover:border-zinc-200'}`}
                    >
                      <div className="w-10 h-10 rounded-full shadow-inner" style={{ backgroundColor: m.color }} />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-bold text-zinc-900">{m.name}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{m.texture}</p>
                      </div>
                      {material.id === m.id && <Check size={16} className="text-zinc-900" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'hardware' && (
              <motion.div
                key="hardware"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Hardware Finish</h3>
                <div className="grid grid-cols-1 gap-3">
                  {HARDWARE.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => setHardware(h)}
                      className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${hardware.id === h.id ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-100 hover:border-zinc-200'}`}
                    >
                      <div className="w-10 h-10 rounded-full shadow-inner border border-zinc-200" style={{ backgroundColor: h.color }} />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-bold text-zinc-900">{h.name}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Premium Grade</p>
                      </div>
                      {hardware.id === h.id && <Check size={16} className="text-zinc-900" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'layout' && (
              <motion.div
                key="layout"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Internal Layout</h3>
                <div className="grid grid-cols-1 gap-3">
                  {LAYOUTS.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setLayout(l)}
                      className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${layout.id === l.id ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-100 hover:border-zinc-200'}`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-400">
                        <Layers size={18} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-bold text-zinc-900">{l.name}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{l.description}</p>
                      </div>
                      {layout.id === l.id && <Check size={16} className="text-zinc-900" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-auto p-8 border-t border-zinc-100 space-y-4">
          <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
            <Info size={16} className="text-zinc-400" />
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              All joinery is handcrafted in our London workshop using sustainably sourced hardwoods.
            </p>
          </div>
          <button className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200">
            Save Configuration
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
