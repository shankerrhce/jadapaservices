# Jadapa Services - Photography & Videography Portfolio

A modern, responsive photography and videography portfolio website for Shankar Jadapa, featuring stunning visuals, smooth animations, and professional contact forms.

## 🌟 **Live Demo**

**Website**: [jadapaservices.com](https://jadapaservices.com) _(after deployment)_

## 📁 **Project Structure**

```
new/
├── index.html              # Main HTML structure with semantic markup
├── styles.css              # Modern CSS with gradients, animations & responsive design
├── script.js               # Interactive JavaScript functionality
├── README.md               # Project documentation
├── public/
│   ├── images/            # Portfolio images with metadata
│   │   └── images-config.js
│   └── videos/            # Hero section video content
│       └── Hero.mp4
└── .gitignore             # Git ignore file
```

## ✨ **Key Features**

### **🎨 Modern Design & UX**

- **Dark Theme**: Professional dark color scheme with vibrant gradients
- **Glassmorphism**: Modern glass-like effects with backdrop filters
- **Responsive Design**: Perfect on desktop, tablet, and mobile devices
- **Smooth Animations**: CSS transitions, hover effects, and micro-interactions
- **Gradient Backgrounds**: Beautiful radial gradients with multiple color layers

### **📸 Portfolio Gallery**

- **Dynamic Loading**: 20+ portfolio images loaded from local directory
- **Category Filtering**: Filter by Wedding, Portrait, Product, Event photography/videography
- **Lightbox View**: Full-screen image viewing with navigation controls
- **Responsive Grid**: Adaptive layout that works on all screen sizes
- **Image Optimization**: Proper aspect ratios and loading states

### **🎬 Video Hero Section**

- **Portrait Mode**: 9:16 aspect ratio for mobile-first design
- **Autoplay**: Video starts automatically with audio
- **Audio Controls**: Mute/unmute toggle button
- **Responsive**: Adapts to different screen sizes
- **Local Video**: Uses local MP4 file for fast loading

### **📱 Navigation & UX**

- **Sticky Header**: Navigation bar stays at top while scrolling
- **Active Indicators**: Shows current page/section in navigation
- **Smooth Scrolling**: Enhanced navigation between sections
- **Mobile Menu**: Hamburger menu for mobile devices
- **Progress Bar**: Visual scroll progress indicator

### **📧 Contact & Forms**

- **Professional Form**: "Book Your Shoot" inquiry form
- **Form Validation**: Email format, phone number, and required field validation
- **Email Integration**: Direct mailto links to jadapaservices@gmail.com
- **Success Feedback**: Visual confirmation and error handling
- **Auto-reset**: Form clears after successful submission

### **⚡ Performance & SEO**

- **Static Site**: No server-side processing required
- **Optimized Assets**: Compressed images and videos
- **Semantic HTML**: Proper heading structure and accessibility
- **Fast Loading**: Minimal dependencies and optimized code
- **Mobile First**: Responsive design optimized for mobile devices

## 🚀 **How to Run Locally**

### **Method 1: Direct File Opening**

1. Double-click `index.html` to open in your default browser
2. Or drag and drop `index.html` into any web browser

### **Method 2: Terminal (macOS/Linux)**

```bash
open index.html
```

### **Method 3: Browser File Menu**

1. Open any web browser
2. Go to `File` → `Open File...`
3. Select `index.html`

### **Method 4: Live Server (Development)**

```bash
# Install live-server globally
npm install -g live-server

# Run in project directory
live-server
```

## 🌐 **Browser Compatibility**

- ✅ **Chrome** (recommended)
- ✅ **Safari** (macOS/iOS)
- ✅ **Firefox**
- ✅ **Edge**
- ✅ **Mobile browsers** (iOS Safari, Chrome Mobile)

## 🎨 **Customization Guide**

### **Colors & Theme**

Edit CSS variables in `styles.css`:

```css
:root {
  --bg: #0a0a0f; /* Deep space black */
  --bg-2: #0f0f1a; /* Dark blue-black */
  --primary: #00d4ff; /* Vibrant cyan */
  --accent: #ff0080; /* Hot pink */
  --accent-2: #ff6b35; /* Vibrant orange */
  --accent-3: #8a2be2; /* Electric purple */
}
```

### **Content Updates**

- **Text Content**: Edit content in `index.html`
- **Portfolio Images**: Replace images in `public/images/` folder
- **Hero Video**: Update `public/videos/Hero.mp4`
- **Contact Email**: Modify email in `script.js` form handler
- **Services**: Update service options in contact form

### **Styling & Layout**

- **Layouts**: Modify grid systems in `styles.css`
- **Animations**: Add new keyframes and transitions
- **Responsive**: Update breakpoints for different screen sizes
- **Typography**: Change fonts and text styling

## 🚀 **Deployment to GitHub Pages**

### **Step 1: Initialize Git Repository**

```bash
git init
git add .
git commit -m "Initial commit - Photography website"
```

### **Step 2: Create GitHub Repository**

1. Go to [GitHub.com](https://github.com)
2. Click "+" → "New repository"
3. Name: `jadapa-photography` (or your preferred name)
4. Make it **Public** (required for GitHub Pages)
5. Click "Create repository"

### **Step 3: Connect & Push**

```bash
git remote add origin https://github.com/yourusername/jadapa-photography.git
git branch -M main
git push -u origin main
```

### **Step 4: Enable GitHub Pages**

1. Go to repository **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main**, Folder: **/ (root)**
4. Click **Save**

### **Step 5: Custom Domain Setup**

1. In Pages settings, add your custom domain
2. Create `CNAME` file in project root:
   ```
   jadapaservices.com
   ```
3. Configure DNS at your domain registrar
4. Commit and push CNAME file

## 🔧 **Technical Details**

### **Frontend Technologies**

- **HTML5**: Semantic markup and modern elements
- **CSS3**: Grid, Flexbox, CSS Variables, Animations
- **JavaScript (ES6+)**: Modern JS with async/await, modules
- **No Frameworks**: Pure vanilla code for maximum performance

### **Key JavaScript Features**

- **Intersection Observer**: For scroll animations and counters
- **Form Validation**: Client-side validation with regex patterns
- **Dynamic Content**: Portfolio gallery population and filtering
- **Event Handling**: Comprehensive event management
- **Responsive Navigation**: Active section detection and highlighting

### **CSS Features**

- **CSS Grid & Flexbox**: Modern layout systems
- **CSS Variables**: Dynamic theming and customization
- **Animations**: Keyframes, transitions, and transforms
- **Backdrop Filters**: Glassmorphism effects
- **Media Queries**: Responsive design breakpoints

## 📱 **Responsive Design**

### **Breakpoints**

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### **Mobile-First Approach**

- Portrait video hero section
- Touch-friendly navigation
- Optimized touch targets
- Responsive typography

## 🔒 **Security & Privacy**

- **No External Dependencies**: All code is local and secure
- **Form Validation**: Client-side validation prevents spam
- **No Data Collection**: Forms send emails directly, no data stored
- **HTTPS Ready**: Compatible with secure hosting

## 📈 **Performance Optimization**

- **Minimal Dependencies**: No heavy frameworks
- **Optimized Images**: Proper sizing and compression
- **Efficient CSS**: Minimal unused styles
- **Fast JavaScript**: Optimized event handling
- **Lazy Loading**: Images load as needed

## 🐛 **Troubleshooting**

### **Common Issues**

1. **Video not playing**: Check browser autoplay policies
2. **Images not loading**: Verify `public/images/` folder structure
3. **Form not working**: Check JavaScript console for errors
4. **Styling issues**: Clear browser cache and refresh

### **Debug Mode**

- Open browser Developer Tools (F12)
- Check Console for error messages
- Verify file paths and structure

## 📄 **License & Usage**

This project is designed for **Jadapa Services** business use. You may:

- ✅ Use for your own photography business
- ✅ Modify and customize for your needs
- ✅ Deploy to your own hosting
- ❌ Resell or redistribute as-is

## 🤝 **Support & Updates**

- **Issues**: Check browser console for error messages
- **Updates**: Pull latest changes from repository
- **Customization**: Modify CSS variables and content as needed

## 🌟 **Credits**

- **Design & Development**: Custom built for Jadapa Services
- **Powered by**: web-setu
- **Icons**: Custom SVG icons
- **Fonts**: Google Fonts (Poppins)

---

**Built with ❤️ for Jadapa Services Photography & Videography**

_Last updated: January 2025_
