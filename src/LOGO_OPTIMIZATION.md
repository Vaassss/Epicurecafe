# Logo Optimization Guide

## Making Your Logo Visible on Dark Backgrounds

If your Epicure logo is still hard to see even after the fixes, you may need to create a lighter/brighter version optimized for the dark green background.

## Quick Fixes (No Image Editing Required)

### Option 1: Add a Light Background Circle
Edit `/App.tsx` and find the logo section, then add a white circle behind it:

```tsx
<div className="relative w-64 h-64 md:w-80 md:h-80">
  {/* Add this line for a white background */}
  <div className="absolute inset-0 bg-white/20 rounded-full backdrop-blur-sm" />
  
  <div className="absolute inset-0 bg-gradient-to-br from-[#a8c5a0]/30 to-[#d4e4d0]/20 rounded-full" />
  <img 
    src={logoImage} 
    alt="Epicure Cafe Logo" 
    className="w-full h-full object-contain rounded-full relative z-10"
    style={{ 
      filter: 'brightness(1.3) contrast(1.1)',
      opacity: 0.95
    }}
  />
  ...
</div>
```

### Option 2: Increase Brightness
Change the filter values to make it even brighter:

```tsx
style={{ 
  filter: 'brightness(1.8) contrast(1.3) saturate(1.2)',
  opacity: 1
}}
```

### Option 3: Add Border
Add a light border around the logo:

```tsx
className="w-full h-full object-contain rounded-full relative z-10 border-4 border-[#a8c5a0]/50"
```

## Using Image Editing Software

If the above CSS fixes don't work well enough, create a "dark mode" version of your logo:

### Using Photopea (Free Online)

1. Go to [Photopea.com](https://www.photopea.com/)
2. Open your logo file (`File` → `Open`)
3. Adjust brightness:
   - Go to `Image` → `Adjustments` → `Brightness/Contrast`
   - Increase **Brightness** to +30 to +50
   - Increase **Contrast** to +10 to +20
4. Adjust colors (optional):
   - Go to `Image` → `Adjustments` → `Hue/Saturation`
   - Increase **Lightness** to +20 to +40
5. Export:
   - Go to `File` → `Export as` → `PNG`
   - Save as `epicure-logo.png`
6. Replace the file in `/public/epicure-logo.png`

### Using GIMP (Free Desktop App)

1. Download and install [GIMP](https://www.gimp.org/)
2. Open your logo: `File` → `Open`
3. Increase brightness:
   - `Colors` → `Brightness-Contrast`
   - Brightness: +30 to +50
   - Contrast: +10 to +20
4. Optional - Make lighter:
   - `Colors` → `Curves`
   - Drag the diagonal line upward to lighten
5. Export:
   - `File` → `Export As`
   - Name: `epicure-logo.png`
   - Format: PNG
6. Replace in `/public/epicure-logo.png`

### Using Figma (If You Have the Original Design)

1. Open your Epicure logo in Figma
2. Select all logo elements
3. In the right panel, under "Fill":
   - If dark colors: Change to lighter shades
   - Add brightness adjustment layer
4. For green elements:
   - Change from dark green (#1a2f2a) to light green (#a8c5a0 or #d4e4d0)
5. Export:
   - Select the logo frame
   - Click "Export" in right panel
   - Format: PNG
   - Scale: 2x or 3x for quality
   - Export
6. Rename to `epicure-logo.png` and replace in `/public/`

## Color Recommendations for Dark Background

Since your app uses a dark green (#1a2f2a) background, the logo should use:

### Good Colors (High Contrast):
- ✅ White (#FFFFFF)
- ✅ Light cream (#d4e4d0) - Your accent color!
- ✅ Light green (#a8c5a0) - Your primary light color!
- ✅ Gold/Yellow (#FFD700)
- ✅ Light gray (#CCCCCC)

### Avoid (Low Contrast):
- ❌ Dark green (same as background)
- ❌ Black
- ❌ Dark brown
- ❌ Navy blue
- ❌ Dark red

## Creating Two Versions (Recommended)

For best results, create two logo versions:

1. **Original Logo** - For light backgrounds
2. **Dark Mode Logo** - For dark backgrounds (this app)

### Logo Naming:
- `/public/epicure-logo.png` - The dark mode version (lighter colors)
- `/public/epicure-logo-light.png` - Original version (if you need it elsewhere)

## Testing Your Logo

After making changes:

1. Replace `/public/epicure-logo.png` with your optimized version
2. Hard refresh your browser:
   - Mac: `Cmd + Shift + R`
   - Windows/Linux: `Ctrl + Shift + R`
3. Check visibility on:
   - Landing page (hero section)
   - Login page (header)
   - Customer dashboard (top-left)
   - Barista dashboard (header)

## Still Having Issues?

If you've tried everything and the logo is still not visible:

1. **Share your logo file:**
   - Check the actual colors in the PNG file
   - Open in an image viewer to verify it's not corrupted

2. **Verify file path:**
   - Must be exactly: `/public/epicure-logo.png`
   - Case-sensitive on some systems

3. **Check browser console:**
   - Press F12 to open developer tools
   - Look for errors loading the logo image

4. **Try a test logo:**
   - Use a simple white circle as a test
   - Create in any image editor
   - If white circle shows, your logo is too dark

## Example: Creating a Simple Light Version

If you need a quick solution, you can:

1. Open your logo in any image editor
2. Add a new layer on top
3. Fill with white at 30-50% opacity
4. Merge/flatten layers
5. Export as PNG

This will create a "washed out" lighter version that works well on dark backgrounds.

---

**Need Help?** If you're still struggling with logo visibility, you may want to provide the actual logo PNG file to a designer to optimize it for dark backgrounds.
