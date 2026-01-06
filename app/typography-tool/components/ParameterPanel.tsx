'use client';

import { useTypographyStore } from '@/lib/typography/store';
import { PRESETS } from '@/lib/typography/types';
import { ChevronDown, ChevronUp, RotateCcw, Shuffle } from 'lucide-react';
import { useState } from 'react';

interface ParameterSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
}

function ParameterSlider({ label, value, onChange, min, max, step, unit = '' }: ParameterSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <span className="text-sm text-gray-400">
          {typeof value === 'number' ? value.toFixed(step < 1 ? 1 : 0) : value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
    </div>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ title, children, defaultOpen = true }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-gray-800/50 flex items-center justify-between hover:bg-gray-800 transition-colors"
      >
        <span className="font-medium text-sm uppercase tracking-wider text-gray-200">{title}</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {isOpen && <div className="p-4 space-y-4 bg-gray-900/30">{children}</div>}
    </div>
  );
}

export default function ParameterPanel() {
  const { parameters, setParameter, setParameters, resetParameters, loadPreset } = useTypographyStore();

  const randomizeParameters = () => {
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    setParameters({
      edgePixelSize: Math.round(randomInRange(15, 70)),
      edgePixelSpacing: Math.round(randomInRange(30, 120)),
      cornerRadius: Math.round(randomInRange(0, 45)),
      blobThickness: Math.round(randomInRange(70, 180)),
      blobSmoothness: Math.round(randomInRange(40, 95)),
      flowStrength: Math.round(randomInRange(30, 90)),
    });
  };

  return (
    <div className="space-y-4 sticky top-24">
      {/* Presets */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-3">
        <h3 className="font-medium text-sm uppercase tracking-wider text-gray-200">Presets</h3>
        <div className="grid grid-cols-1 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => loadPreset(preset)}
              className="px-3 py-2 bg-gray-800 hover:bg-blue-600 border border-gray-700 hover:border-blue-500 rounded text-sm text-left transition-all"
            >
              <div className="font-medium">{preset.name}</div>
              <div className="text-xs text-gray-400">{preset.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={randomizeParameters}
          className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Shuffle size={16} />
          Randomize
        </button>
        <button
          onClick={resetParameters}
          className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {/* Parameter Sections */}
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {/* Edge Pixels */}
        <Section title="Edge Pixels">
          <ParameterSlider
            label="Pixel Size"
            value={parameters.edgePixelSize}
            onChange={(v) => setParameter('edgePixelSize', Math.round(v))}
            min={10}
            max={80}
            step={1}
          />
          <ParameterSlider
            label="Pixel Spacing"
            value={parameters.edgePixelSpacing}
            onChange={(v) => setParameter('edgePixelSpacing', Math.round(v))}
            min={20}
            max={150}
            step={5}
          />
          <ParameterSlider
            label="Corner Radius"
            value={parameters.cornerRadius}
            onChange={(v) => setParameter('cornerRadius', Math.round(v))}
            min={0}
            max={50}
            step={1}
            unit="%"
          />
        </Section>

        {/* Blob Shape */}
        <Section title="Blob Shape">
          <ParameterSlider
            label="Blob Thickness"
            value={parameters.blobThickness}
            onChange={(v) => setParameter('blobThickness', Math.round(v))}
            min={50}
            max={200}
            step={5}
          />
          <ParameterSlider
            label="Smoothness"
            value={parameters.blobSmoothness}
            onChange={(v) => setParameter('blobSmoothness', Math.round(v))}
            min={0}
            max={100}
            step={1}
          />
          <ParameterSlider
            label="Curve Tension"
            value={parameters.curveTension * 100}
            onChange={(v) => setParameter('curveTension', v / 100)}
            min={20}
            max={100}
            step={5}
          />
        </Section>

        {/* Form & Structure */}
        <Section title="Form & Structure">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Template</label>
            <select
              value={parameters.organicTemplate}
              onChange={(e) => setParameter('organicTemplate', e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm"
            >
              <option value="blob">Blob</option>
              <option value="branch">Branch</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Fill Style</label>
            <select
              value={parameters.fillStyle}
              onChange={(e) => setParameter('fillStyle', e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm"
            >
              <option value="solid">Solid</option>
              <option value="outline-only">Outline Only</option>
              <option value="hollow">Hollow</option>
            </select>
          </div>
          <ParameterSlider
            label="Symmetry"
            value={parameters.symmetryStrength}
            onChange={(v) => setParameter('symmetryStrength', Math.round(v))}
            min={0}
            max={100}
            step={5}
          />
        </Section>

        {/* Typography */}
        <Section title="Typography">
          <ParameterSlider
            label="Width"
            value={parameters.width}
            onChange={(v) => setParameter('width', Math.round(v))}
            min={60}
            max={140}
            step={5}
            unit="%"
          />
          <ParameterSlider
            label="Tracking"
            value={parameters.tracking}
            onChange={(v) => setParameter('tracking', Math.round(v))}
            min={-100}
            max={300}
            step={10}
          />
          <div className="flex items-center justify-between pt-2">
            <label className="text-sm font-medium text-gray-300">Monospace</label>
            <input
              type="checkbox"
              checked={parameters.monospace}
              onChange={(e) => setParameter('monospace', e.target.checked)}
              className="w-4 h-4 bg-gray-800 border-gray-700 rounded accent-blue-500"
            />
          </div>
        </Section>

        {/* Advanced */}
        <Section title="Advanced" defaultOpen={false}>
          <ParameterSlider
            label="Flow Strength"
            value={parameters.flowStrength}
            onChange={(v) => setParameter('flowStrength', Math.round(v))}
            min={0}
            max={100}
            step={5}
          />
          <ParameterSlider
            label="Branch Thickness"
            value={parameters.branchThickness * 10}
            onChange={(v) => setParameter('branchThickness', v / 10)}
            min={5}
            max={25}
            step={1}
          />
        </Section>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgb(17 24 39);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgb(55 65 81);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgb(75 85 99);
        }
      `}</style>
    </div>
  );
}
