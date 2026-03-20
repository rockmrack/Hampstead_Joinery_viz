import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, ChevronRight, ChevronLeft, CheckCircle2, Coins } from 'lucide-react';

const STEPS = [
  { id: 'type', title: 'Project Type' },
  { id: 'size', title: 'Dimensions' },
  { id: 'finish', title: 'Finish Level' },
  { id: 'result', title: 'Estimate' }
];

const PROJECT_TYPES = [
  { id: 'kitchen', name: 'Kitchen Extension', basePrice: 45000, unit: 'extension' },
  { id: 'loft', name: 'Loft Conversion', basePrice: 55000, unit: 'conversion' },
  { id: 'bathroom', name: 'Bathroom Renovation', basePrice: 8000, unit: 'room' },
  { id: 'full', name: 'Full House Refurb', basePrice: 120000, unit: 'house' }
];

const FINISH_LEVELS = [
  { id: 'standard', name: 'Standard', multiplier: 1 },
  { id: 'premium', name: 'Premium', multiplier: 1.4 },
  { id: 'luxury', name: 'Luxury / Bespoke', multiplier: 2.1 }
];

export const Estimator = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    type: PROJECT_TYPES[0],
    sqm: 20,
    finish: FINISH_LEVELS[0]
  });

  const calculateEstimate = () => {
    const base = data.type.basePrice;
    const finish = data.finish.multiplier;
    // Simple London-weighted calculation
    const estimate = base * finish;
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(estimate);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-xl shadow-zinc-200/50">
        {/* Progress Bar */}
        <div className="h-1.5 bg-zinc-100 flex">
          {STEPS.map((s, i) => (
            <div 
              key={s.id} 
              className={`flex-1 transition-all duration-500 ${i <= step ? 'bg-emerald-500' : ''}`} 
            />
          ))}
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-zinc-900">What are we building?</h3>
                  <p className="text-zinc-500">Select the primary focus of your renovation project.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PROJECT_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setData({ ...data, type })}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${
                        data.type.id === type.id 
                          ? 'border-emerald-500 bg-emerald-50/50 ring-4 ring-emerald-50' 
                          : 'border-zinc-100 hover:border-zinc-200 bg-white'
                      }`}
                    >
                      <h4 className="font-bold text-zinc-900">{type.name}</h4>
                      <p className="text-xs text-zinc-500 mt-1">Starting from £{type.basePrice.toLocaleString()}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-zinc-900">Project Scale</h3>
                  <p className="text-zinc-500">Approximate size of the area being renovated.</p>
                </div>
                <div className="space-y-8 py-8">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-medium text-zinc-500">Small</span>
                    <span className="text-4xl font-bold text-zinc-900">{data.sqm} <span className="text-xl font-normal text-zinc-400">m²</span></span>
                    <span className="text-sm font-medium text-zinc-500">Large</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="200" 
                    value={data.sqm}
                    onChange={(e) => setData({ ...data, sqm: parseInt(e.target.value) })}
                    className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                      <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">Type</p>
                      <p className="text-sm font-semibold text-zinc-700">{data.type.name}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                      <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">Location</p>
                      <p className="text-sm font-semibold text-zinc-700">London</p>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                      <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">VAT</p>
                      <p className="text-sm font-semibold text-zinc-700">Incl. 20%</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-zinc-900">Desired Finish</h3>
                  <p className="text-zinc-500">The quality of materials and level of bespoke craftsmanship.</p>
                </div>
                <div className="space-y-4">
                  {FINISH_LEVELS.map((finish) => (
                    <button
                      key={finish.id}
                      onClick={() => setData({ ...data, finish })}
                      className={`w-full p-6 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                        data.finish.id === finish.id 
                          ? 'border-emerald-500 bg-emerald-50/50 ring-4 ring-emerald-50' 
                          : 'border-zinc-100 hover:border-zinc-200 bg-white'
                      }`}
                    >
                      <div>
                        <h4 className="font-bold text-zinc-900">{finish.name}</h4>
                        <p className="text-xs text-zinc-500 mt-1">
                          {finish.id === 'standard' && 'High quality trade materials, standard fixtures.'}
                          {finish.id === 'premium' && 'Designer brands, custom joinery, high-end finishes.'}
                          {finish.id === 'luxury' && 'Full bespoke design, rare materials, specialist artisans.'}
                        </p>
                      </div>
                      {data.finish.id === finish.id && <CheckCircle2 className="text-emerald-500" size={24} />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-8"
              >
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Coins size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Estimated Project Cost</h3>
                  <p className="text-6xl font-black text-zinc-900 tracking-tighter">
                    {calculateEstimate()}
                  </p>
                  <p className="text-zinc-500 text-sm max-w-sm mx-auto pt-4">
                    This is a high-level estimate based on current London market rates for a {data.finish.name.toLowerCase()} {data.type.name.toLowerCase()}.
                  </p>
                </div>
                <div className="pt-8 flex flex-col gap-3">
                  <button className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold shadow-xl shadow-zinc-200 hover:bg-zinc-800 transition-all">
                    Book Site Survey
                  </button>
                  <button className="w-full bg-white border border-zinc-200 text-zinc-600 py-4 rounded-xl font-bold hover:bg-zinc-50 transition-all">
                    Download Detailed Breakdown
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {step < 3 && (
            <div className="mt-12 flex items-center justify-between pt-8 border-t border-zinc-100">
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-zinc-900 disabled:opacity-0 transition-all"
              >
                <ChevronLeft size={18} /> Back
              </button>
              <button
                onClick={() => setStep(step + 1)}
                className="bg-zinc-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
              >
                {step === 2 ? 'Generate Estimate' : 'Next Step'} <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 p-6 bg-zinc-100 rounded-2xl border border-zinc-200 flex items-start gap-4">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-zinc-400 shrink-0">
          <Calculator size={20} />
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed">
          <strong>Note:</strong> This tool provides a preliminary estimate only. Actual costs may vary based on structural requirements, planning permissions, and specific material selections. For a guaranteed quote, please book a professional site survey.
        </p>
      </div>
    </div>
  );
};
