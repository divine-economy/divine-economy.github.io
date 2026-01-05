# Pixel Blob Typography Tool

An advanced typography generation tool that creates custom fonts by combining organic blob shapes with retro pixelated grids.

## Features

- **Organic Grid Generation**: Combines smooth, flowing organic shapes with modular pixel grids
- **26 Uppercase Letters**: Complete A-Z character set
- **Advanced Parameters**: Over 20 customizable parameters for fine-grained control
- **5 Preset Styles**: Pre-configured styles to get started quickly
- **Real-time Preview**: See your font as you adjust parameters
- **TTF/OTF Export**: Export fonts ready for use in Figma, Adobe, and other design tools

## How to Use

### 1. Choose a Starting Point

Select one of the 5 preset configurations:
- **Dense Organic**: Tight grid with strong organic flow
- **Sparse Retro**: Low-res pixelated with minimal smoothing
- **Heavy Flow**: Maximum organic curves with thick branches
- **Geometric Blob**: Balanced organic shapes with clear structure
- **Scattered Pixels**: High noise with organic undertones

### 2. Adjust Parameters

#### Grid Structure
- **Resolution** (10-32): Controls how many grid cells make up each letter
- **Square Size** (60-100%): Size of individual squares, affects gaps between pixels
- **Corner Radius** (0-50%): Rounds corners from sharp squares to circles

#### Organic Flow
- **Blob Smoothness** (0-100): How much the grid follows organic curves
- **Flow Strength** (0-100): Strength of directional flow in strokes
- **Curve Tension** (0.2-1.0): Tightness of bezier curves
- **Branch Thickness** (0.5-2.5): Width at Y-junctions and connections

#### Form & Structure
- **Template**: Choose between Blob, Branch, or Hybrid base shapes
- **Negative Space** (0-50%): Size of carved-out cutouts within letters
- **Cutout Count** (0-5): Number of negative space elements
- **Symmetry** (0-100%): Amount of left/right mirroring

#### Density & Distribution
- **Fill Density** (50-100%): Percentage of grid cells filled
- **Gradient**: How squares concentrate (None, Center, Edge, Random)
- **Scatter Noise** (0-40%): Random positional variation

#### Typography Metrics
- **Width** (60-140%): Letter width from condensed to extended
- **Weight** (50-200%): Stroke thickness from light to bold
- **Tracking** (-100-300): Letter spacing
- **Monospace**: Toggle equal width for all letters

### 3. Preview Your Font

Switch between three view modes:
- **Full Preview**: Type custom text to see how it looks
- **Alphabet**: View all 26 letters at once
- **Single Letter**: Focus on individual characters with zoom

### 4. Export

1. Click **Settings** to configure font metadata:
   - Font Family Name
   - Designer Name
   - Description
   - Copyright

2. Choose format (TTF or OTF)

3. Click **Export Font** to generate and download

4. Import the font into Figma, Illustrator, or any design tool

## Technical Details

- **Units Per Em**: 1000 (industry standard)
- **Cap Height**: 700 units
- **Generation**: Real-time SVG rendering converted to OpenType paths
- **Algorithm**: Combines Catmull-Rom spline smoothing with grid-based rasterization

## Tips

- Start with a preset and adjust from there
- Higher grid resolution (24-32) creates more detailed letters
- Lower resolution (10-16) creates more retro/pixelated looks
- Increase negative space for more open, airy letterforms
- Use monospace mode for coding fonts or uniform designs
- Experiment with the Randomize button for unexpected combinations

## Keyboard Shortcuts

- Type directly into Full Preview to test custom text
- Click individual letters in Single Letter mode for detailed editing

## Exporting to Figma

1. Export your font as TTF or OTF
2. Install the font on your system (double-click the file)
3. Open Figma
4. The font will appear in the font dropdown menu
5. Add color, effects, and further styling in Figma

## Future Features (Coming Soon)

- Lowercase letters (a-z)
- Numbers (0-9)
- Punctuation and special characters
- Multiple font weights
- Contextual ligatures
- Manual glyph editing
- Animation presets
