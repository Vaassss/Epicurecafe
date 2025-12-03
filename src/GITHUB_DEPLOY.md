# GitHub Deployment Instructions

## Steps to Push Code to GitHub

### 1. Prepare the Logo File

**BEFORE pushing to GitHub**, you need to add the Epicure logo:

1. Save the Epicure logo image (the circular green badge with coffee cup)
2. Rename the file to: `epicure-logo.png`
3. Place it in the `/public/` folder of this project
4. Verify the path is: `/public/epicure-logo.png`

### 2. Initialize Git Repository (if not already done)

```bash
git init
```

### 3. Add All Files

```bash
git add .
```

### 4. Commit the Changes

```bash
git commit -m "Initial commit: Epicure Cafe with loyalty program"
```

### 5. Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click the "+" icon → "New repository"
3. Name it: `epicure-cafe` (or your preferred name)
4. **DO NOT** initialize with README (you already have one)
5. Click "Create repository"

### 6. Link Local Repository to GitHub

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/epicure-cafe.git
git branch -M main
git push -u origin main
```

### 7. Verify Upload

1. Go to your GitHub repository page
2. Check that the `/public/epicure-logo.png` file is present
3. Verify all other files are uploaded

## What Gets Uploaded to GitHub

✅ **Included in repository:**
- All source code files
- Component files
- Menu data
- Styles
- Configuration files
- **Epicure logo** (in `/public/epicure-logo.png`)
- README and documentation
- .gitignore file

❌ **Not included (automatically ignored):**
- `node_modules/` folder
- Build output (`dist/`)
- Environment variables (`.env`)
- IDE settings
- Log files

## Testing After Push

### For Others to Clone and Run:

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/epicure-cafe.git
cd epicure-cafe
```

2. **Verify logo is present:**
```bash
ls -la public/epicure-logo.png
```
If this file is missing, the logo won't display!

3. Install dependencies:
```bash
npm install
```

4. Run the app:
```bash
npm run dev
```

5. Open browser to `http://localhost:5173`

## Important Notes

### Logo File is Essential

The `/public/epicure-logo.png` file **MUST** be committed to the repository. Without it:
- The logo won't appear on landing page
- Login page header will be blank
- Dashboard headers will be missing the logo

### Commit the Logo

Make sure the logo is added to git:

```bash
git add public/epicure-logo.png
git commit -m "Add Epicure logo"
git push
```

### Verify Logo on GitHub

After pushing, check the GitHub repository in your browser:
1. Navigate to `/public/` folder
2. You should see `epicure-logo.png` listed
3. Click on it to preview - it should show the Epicure badge

## Updating the Repository

When you make changes:

```bash
git add .
git commit -m "Description of your changes"
git push
```

## Troubleshooting

### Logo not showing on GitHub?

```bash
# Check if logo is tracked by git
git ls-files public/

# If not listed, add it explicitly
git add -f public/epicure-logo.png
git commit -m "Force add logo file"
git push
```

### File too large error?

If your logo is very large (>50MB), GitHub might reject it. Resize the logo to:
- Recommended: 400x400 pixels
- Maximum: 1000x1000 pixels
- Optimize PNG file size using tools like TinyPNG

---

## 🎉 Success!

Once pushed successfully, anyone can:
1. Clone your repository
2. Install dependencies
3. Run `npm run dev`
4. See the full Epicure Cafe website with working logo!

**Repository will be live at:**
`https://github.com/YOUR_USERNAME/epicure-cafe`
