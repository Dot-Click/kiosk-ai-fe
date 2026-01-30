// // cupPresets.ts
// export const cupPresets = {
//     front: {
//       position: { x: 0, y: 0 },
//       rotation: { x: 0, y: 0, z: 0 },
//       scale: 1,
//       uvOffset: { u: 0.5, v: 0.5 },
//     },
//     leftSide: {
//       position: { x: -0.3, y: 0 },
//       rotation: { x: 0, y: -Math.PI / 4, z: 0 },
//       scale: 1,
//       uvOffset: { u: 0.25, v: 0.5 },
//     },
//     rightSide: {
//       position: { x: 0.3, y: 0 },
//       rotation: { x: 0, y: Math.PI / 4, z: 0 },
//       scale: 1,
//       uvOffset: { u: 0.75, v: 0.5 },
//     },
//     wrapAround: {
//       position: { x: 0, y: 0 },
//       rotation: { x: 0, y: 0, z: 0 },
//       scale: 1.2,
//       uvOffset: { u: 0, v: 0.5 },
//     },
//     centered: {
//       position: { x: 0, y: 0 },
//       rotation: { x: 0, y: 0, z: 0 },
//       scale: 0.8,
//       uvOffset: { u: 0.5, v: 0.5 },
//     },
//   };
  
//   // Add preset buttons to your UI
//   const PresetButtons = ({ onPresetSelect }: { onPresetSelect: (preset: keyof typeof cupPresets) => void }) => (
//     <Box className="flex gap-2 mt-4">
//       {Object.keys(cupPresets).map((preset) => (
//         <button
//           key={preset}
//           onClick={() => onPresetSelect(preset as keyof typeof cupPresets)}
//           className="px-3 py-2 text-sm bg-white/5 hover:bg-white/10 rounded-lg text-white/80 capitalize"
//         >
//           {preset.replace(/([A-Z])/g, ' $1').trim()}
//         </button>
//       ))}
//     </Box>
//   );