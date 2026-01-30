import { useState } from 'react';
import { Flex } from '@/components/ui/flex';
import { Box } from '@/components/ui/box';
import { RotateCw, Move, Scale, Grid3x3 } from 'lucide-react';

interface ThreeControlsProps {
  onPositionChange: (axis: 'x' | 'y' | 'z', value: number) => void;
  onRotationChange: (axis: 'x' | 'y' | 'z', value: number) => void;
  onScaleChange: (value: number) => void;
  onUVAdjust: (u: number, v: number) => void;
}

export function ThreeControls({
  onPositionChange,
  onRotationChange,
  onScaleChange,
  onUVAdjust,
}: ThreeControlsProps) {
  const [activeTab, setActiveTab] = useState<'position' | 'rotation' | 'scale' | 'uv'>('position');
  
  return (
    <Box className="p-4 rounded-xl bg-[#130E29]/80 backdrop-blur-sm border border-white/10">
      <Flex className="gap-2 mb-4">
        {[
          { id: 'position', label: 'Position', icon: Move },
          { id: 'rotation', label: 'Rotation', icon: RotateCw },
          { id: 'scale', label: 'Scale', icon: Scale },
          { id: 'uv', label: 'UV Map', icon: Grid3x3 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <Flex className="items-center gap-2">
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Flex>
          </button>
        ))}
      </Flex>

      {activeTab === 'position' && (
        <div className="space-y-3">
          {['x', 'y'].map((axis) => (
            <div key={axis} className="space-y-1">
              <label className="text-xs text-white/70 uppercase tracking-wider">
                {axis.toUpperCase()} Position
              </label>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.01"
                defaultValue="0"
                onChange={(e) => onPositionChange(axis as 'x' | 'y', parseFloat(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
              />
            </div>
          ))}
        </div>
      )}

      {activeTab === 'rotation' && (
        <div className="space-y-3">
          {['x', 'y', 'z'].map((axis) => (
            <div key={axis} className="space-y-1">
              <label className="text-xs text-white/70 uppercase tracking-wider">
                {axis.toUpperCase()} Rotation
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                defaultValue="0"
                onChange={(e) => onRotationChange(axis as 'x' | 'y' | 'z', parseFloat(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
              />
            </div>
          ))}
        </div>
      )}

      {activeTab === 'scale' && (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs text-white/70 uppercase tracking-wider">
              Scale
            </label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              defaultValue="1"
              onChange={(e) => onScaleChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
            />
          </div>
        </div>
      )}

      {activeTab === 'uv' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {['u', 'v'].map((axis) => (
              <div key={axis} className="space-y-1">
                <label className="text-xs text-white/70 uppercase tracking-wider">
                  {axis.toUpperCase()} Offset
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  defaultValue="0.5"
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    onUVAdjust(
                      axis === 'u' ? value : 0.5,
                      axis === 'v' ? value : 0.5
                    );
                  }}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </Box>
  );
}