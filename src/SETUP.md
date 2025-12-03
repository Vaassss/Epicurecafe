# Setup Instructions for Local Development

## Required Steps Before Running

### 1. Add the Epicure Logo

The app requires the Epicure cafe logo to display properly. 

**Steps:**
1. Locate your Epicure logo image file (the circular green logo with coffee cup and leaves)
2. Rename it to: `epicure-logo.png`
3. Place it in the `/public` folder of this project
4. The final path should be: `/public/epicure-logo.png`

**Logo Specifications:**
- Format: PNG (recommended) or JPG
- Recommended size: 400x400px or larger
- Should be the circular Epicure badge design with:
  - "EPICURE" text at top
  - Coffee cup with plant in center
  - Decorative leaves at bottom

### 2. Verify Logo Placement

After adding the logo, your `/public` folder should contain:
```
public/
└── epicure-logo.png  ← Your Epicure logo goes here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

### 5. Access the Application

Open your browser to: `http://localhost:5173`

## Troubleshooting

### Logo Not Showing?

1. **Check the file path:** Make sure the logo is at `/public/epicure-logo.png` (not in a subfolder)
2. **Check the file name:** Must be exactly `epicure-logo.png` (lowercase, with hyphen)
3. **Try hard refresh:** Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
4. **Restart dev server:** Stop the server (Ctrl+C) and run `npm run dev` again

### Still Having Issues?

- Verify the logo file is a valid image (try opening it in an image viewer)
- Check browser console for errors (F12 → Console tab)
- Make sure you're using a modern browser (Chrome, Firefox, Safari, or Edge)

## Next Steps

Once the logo is showing correctly:
1. Test the login flow (use any phone number and 6-digit OTP)
2. Explore the customer dashboard and roadmaps
3. Test the barista dashboard for logging purchases
4. View the full menu with 3D animations

---

**Need Help?** Refer to the main [README.md](README.md) for full documentation.
