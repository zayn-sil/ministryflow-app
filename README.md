# MinistryFlow - Professional Project Management for Churches & Ministries

A modern, full-featured project management application designed specifically for churches and ministries with teams, boards, and comprehensive task management.

## Features

✅ **User Authentication** - Sign up/Sign in system  
✅ **Team Management** - Create and manage multiple teams  
✅ **Multiple Boards** - Organize tasks across different boards  
✅ **Kanban Task Management** - Drag-and-drop task organization  
✅ **Task Priority & Due Dates** - Full task details with priorities  
✅ **Dashboard Analytics** - Track progress and statistics  
✅ **Mobile Responsive** - Works perfectly on all devices  
✅ **Local Storage** - Data persists in browser (easily upgradeable to database)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

## Deployment Options

### Option A: Netlify (Easiest)

1. Run `npm run build`
2. Drag the `dist` folder to [netlify.com/drop](https://app.netlify.com/drop)
3. Get your live URL instantly!

### Option B: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Get your live URL!

### Option C: Any Static Host

Just upload the `dist` folder to:
- GitHub Pages
- AWS S3
- Cloudflare Pages
- Any hosting service

## Customization Guide

### Change Branding

**App Name:** Edit `src/App.jsx` - Search for "TaskFlow" and replace

**Colors:** Edit `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: '#yourcolor',
    }
  }
}
```

**Logo:** Replace the `<LayoutDashboard>` icon component in `src/App.jsx`

### Add Features

All components are in `src/App.jsx`:
- `AuthScreen` - Login/signup
- `TeamSelection` - Team management
- `BoardSelection` - Board management
- `KanbanBoard` - Task management
- `Dashboard` - Analytics

### Connect to Real Database

Replace the storage functions in `src/App.jsx`:

```js
// Current (localStorage)
const getFromStorage = (key, defaultValue) => { ... }
const saveToStorage = (key, value) => { ... }

// Change to Supabase/Firebase
import { supabase } from './supabase'
const getFromStorage = async (key) => {
  const { data } = await supabase.from(key).select()
  return data
}
```

## File Structure

```
taskflow-project/
├── src/
│   ├── App.jsx          # Main application (ALL FEATURES HERE)
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Build configuration
└── tailwind.config.js   # Styling configuration
```

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool (super fast)
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **LocalStorage** - Data persistence (upgradeable)

## Support & Customization

Need help customizing? Want to add features?
- All code is commented and easy to read
- Each section is clearly labeled
- Easy to extend with new features

## License

This is a professional product ready for commercial use.
Customize and sell to your clients!

---

Built for professional project management 🚀
