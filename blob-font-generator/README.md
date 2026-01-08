# Blob Font Generator

A Next.js application for creating custom organic blob-shaped fonts with grid overlays. Generate smooth, flowing letterforms inspired by the blob typography style.

## Features

- **Smooth Organic Shapes**: All letters (A-Z) and numbers (0-9) are created using smooth bezier curves with no hard edges
- **Grid Overlay System**: Horizontal and vertical grid lines that clip to letter boundaries
- **Real-time Preview**: See your custom text rendered in blob font as you type
- **Adjustable Parameters**:
  - Blob thickness (30-150)
  - Smoothness (0-100%)
  - Grid spacing (5-40)
  - Grid line width (0.5-5)
  - Grid line lightness (0-100%)
- **Font Export**: Generate and download .otf font files for use in design tools like Figma

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build the application for production:

```bash
npm run build
npm start
```

## Usage

1. **Adjust Parameters**: Use the sliders on the left to adjust blob thickness, smoothness, and grid properties
2. **Preview Text**: Type in the custom text input to see your text in blob font
3. **View Full Character Set**: Scroll down to see all letters (A-Z) and numbers (0-9)
4. **Export Font**: Click "Export Font (.otf)" to download the font file
5. **Install Font**: Install the .otf file on your computer or import it into Figma

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Font Generation**: opentype.js
- **Graphics**: SVG with bezier paths

## Project Structure

```
blob-font-generator/
├── app/
│   ├── globals.css          # Global styles with Tailwind
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page
├── components/
│   ├── BlobFontGenerator.tsx # Main component
│   ├── LetterPreview.tsx     # Individual letter rendering
│   ├── ParameterControls.tsx # Parameter sliders
│   └── TextPreview.tsx       # Custom text preview
├── lib/
│   ├── letterTemplates.ts    # Letter path definitions (A-Z, 0-9)
│   ├── blobGenerator.ts      # Blob transformation utilities
│   ├── gridOverlay.ts        # Grid pattern generation
│   └── fontExporter.ts       # Font file generation
└── README.md
```

## Letter Design Philosophy

Each letter is hand-crafted with smooth bezier curves to achieve an organic, blob-like quality:

- **Rounded terminals**: All stroke endings are pill-shaped or teardrop-shaped
- **No sharp angles**: Every transition uses smooth curves
- **Organic flow**: Letters have an asymmetric, hand-drawn quality
- **Metaball-like**: Strokes blend together seamlessly

## Export and Use in Figma

1. Click "Export Font (.otf)" in the application
2. Download the `BlobFont.otf` file
3. On macOS: Double-click the .otf file and click "Install Font"
4. On Windows: Right-click the .otf file and select "Install"
5. In Figma: The font will appear as "BlobFont" in the font selector

## Future Enhancements

- Lowercase letters
- Punctuation marks
- Variable thickness along strokes
- Additional blob styles (more organic, more geometric)
- SVG export for individual letters
- Color customization

## License

ISC
