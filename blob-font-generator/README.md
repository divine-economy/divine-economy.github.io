# Blob Font Generator

A comprehensive web application for creating custom blob fonts with smooth organic shapes. Built with Next.js 14, TypeScript, and Tailwind CSS v4.

![Blob Font Generator](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwind-css)

## Features

### Letter Design
- **Smooth Bezier Curves**: All letters (A-Z, 0-9) designed with organic blob-like shapes
- **No Hard Edges**: Every letter uses rounded, flowing forms with Q and C commands
- **Consistent Height**: All letters maintain uniform height for visual consistency

### Preview System
- **SVG Morphological Filters**: Real-time preview using feMorphology for visual effects
- **Grid Overlay**: Optional grid pattern that follows letter shapes using SVG masking
- **Live Parameter Adjustment**: Instant visual feedback as you modify parameters

### Export System
- **Path Transformation**: Actual coordinate modifications for accurate export
- **OpenType.js Integration**: Export as professional OTF font files
- **Preview = Export**: What you see is exactly what you get in the exported font

### Parameters

#### Blob Parameters
- **Thickness** (30-150): Scale letters fatter or thinner
- **Smoothness** (0-100%): Control edge blur amount
- **Curvature** (0-100%): Round corners from sharp to very round

#### Grid Parameters
- **Grid Spacing** (5-40): Size of grid cells
- **Grid Line Width** (0.5-5): Thickness of grid lines
- **Grid Color**: Customizable color picker

#### Display Parameters
- **Letter Spacing**: Space between letters
- **Word Spacing**: Space between words
- **Size**: Overall font size
- **Rotation Variance**: Random rotation per letter
- **Vertical Offset Variance**: Random vertical shift
- **Vertical Crop**: Zoom in/out on letters
- **Monospace**: Toggle fixed-width letters
- **Letter Color**: Color picker for letters
- **Background Color**: Color picker for background

## Technical Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with @tailwindcss/postcss
- **Font Export**: opentype.js
- **Rendering**: SVG with morphological filters

## Project Structure

```
blob-font-generator/
├── app/
│   ├── page.tsx              # Main page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── BlobFontGenerator.tsx # Main component
│   ├── ParameterControls.tsx # Blob & grid controls
│   ├── DisplayControls.tsx   # Display controls
│   ├── LetterPreview.tsx     # Single letter renderer
│   └── TextPreview.tsx       # Text string renderer
├── lib/
│   ├── letterTemplates.ts    # SVG path definitions (A-Z, 0-9)
│   ├── blobGenerator.ts      # Filter calculations for preview
│   ├── pathProcessor.ts      # Coordinate transformations for export
│   ├── gridOverlay.ts        # Grid pattern generation
│   ├── displayParams.ts      # Parameter type definitions
│   └── fontExporter.ts       # OpenType.js export logic
└── package.json
```

## Installation

```bash
# Clone the repository
git clone https://github.com/divine-economy/divine-economy.github.io.git
cd divine-economy.github.io/blob-font-generator

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Usage

1. **Enter Text**: Type or paste text in the preview text area (automatically converts to uppercase)

2. **Adjust Blob Parameters**:
   - Move the Thickness slider to make letters fatter or thinner
   - Adjust Smoothness to control edge blur
   - Change Curvature to round corners

3. **Toggle Grid Overlay**: Enable to see how letters interact with grid patterns

4. **Customize Display**:
   - Adjust spacing between letters and words
   - Change size and add random rotation/offset for variety
   - Modify colors for letters and background
   - Toggle monospace for fixed-width letters

5. **Export Font**:
   - Click "Export Font (.otf)" button
   - Font file downloads automatically
   - Install the font on your system
   - Use in any application that supports OTF fonts

## How It Works

### Preview System
The preview uses SVG morphological filters (`feMorphology`) to create visual effects:
- **Dilate**: Expands letter shapes
- **Blur**: Smooths edges with Gaussian blur
- **Erode**: Contracts shapes back
- **Scale Transform**: Adjusts thickness from center point (50,50)

### Export System
The export uses `pathProcessor.ts` to modify actual SVG path coordinates:
- **Thickness**: Scales coordinates from center (50,50)
- **Curvature**: Adjusts bezier control points
- **OpenType Conversion**: Transforms SVG paths to OpenType.js glyphs

The preview filters and export transformations are calibrated to produce identical results.

### Grid Overlay
The grid system uses SVG patterns and masks:
- **Pattern**: Generated grid of horizontal and vertical lines
- **Mask**: Created from letter shape with filters applied
- **Overlay**: Grid clipped to letter shape

## Design Philosophy

### Organic Shapes
Every letter is designed with smooth, blob-like curves inspired by organic forms. No angular edges or straight corners - everything flows naturally.

### Preview Accuracy
The critical requirement is that preview matches export exactly. Filters provide beautiful real-time preview, while path transformations ensure the exported font contains the actual modified shapes.

### Parametric Control
All letters respond consistently to parameter changes, allowing users to create cohesive font families with unified characteristics.

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with SVG filter support

## License

MIT License - See LICENSE file for details

## Contributing

Contributions welcome! Please open an issue or submit a pull request.

## Credits

Created with inspiration from organic typography and blob design trends. Reference image provided by user showing smooth, rounded letter forms.

## Support

For issues or questions, please open an issue on GitHub:
https://github.com/divine-economy/divine-economy.github.io/issues
