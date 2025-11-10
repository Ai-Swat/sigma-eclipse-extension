# Icons

This directory contains extension icons.

## Required Icons

- `icon16.png` - 16x16px (toolbar)
- `icon48.png` - 48x48px (extension management)
- `icon128.png` - 128x128px (Chrome Web Store)

## Generate Icons

You can use the `icon.svg` file to generate PNG icons at different sizes:

### Using ImageMagick:
```bash
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png
```

### Using online tools:
- https://www.aconvert.com/image/svg-to-png/
- https://cloudconvert.com/svg-to-png

### Design:
- Purple gradient background (#667eea to #764ba2)
- White Sigma symbol (Σ) in the center
- Rounded corners for modern look

## Temporary Solution

For development, you can use any PNG images with the correct dimensions, or generate them from the provided SVG file.

