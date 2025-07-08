# Telegram Coin Flip App

A React-based Telegram Mini App that implements a coin flip game with Telegram authentication.

## Features

- 🔐 **Telegram Authentication**: Seamless login using Telegram Mini Apps SDK
- 🎯 **Coin Flip Game**: Interactive coin flipping with animations and sound effects
- 📊 **Game Statistics**: Track your flips, wins, and win rate
- 👤 **User Profile**: Display user information from Telegram
- 🎨 **Modern UI**: Beautiful, responsive design with gradients and animations
- 📱 **Mobile Optimized**: Works perfectly on mobile devices

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Telegram Bot Token (for production)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd workshop
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Telegram Mini Apps Setup

### 1. Create a Telegram Bot

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Create a new bot with `/newbot`
3. Get your bot token

### 2. Configure Mini App

1. Use `/newapp` with BotFather to create a Mini App
2. Set the app URL to your deployed application
3. Configure the app settings as needed

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_BOT_TOKEN=your_bot_token_here
REACT_APP_BOT_USERNAME=your_bot_username
```

## Usage

### Development

1. Start the development server:
```bash
npm start
```

2. The app will be available at `http://localhost:3000`

3. To test Telegram functionality, you'll need to:
   - Deploy the app to a public URL (e.g., using Netlify, Vercel, or GitHub Pages)
   - Configure the Mini App URL in BotFather
   - Access the app through Telegram

### Production Build

```bash
npm run build
```

The built files will be in the `build/` directory.

## Components

### FlipImage.tsx

The main component that handles:
- Telegram authentication
- User profile display
- Coin flip game logic
- Game statistics
- Debug information

### Key Features

#### Authentication Flow
```typescript
// Uses Telegram Apps SDK hooks
const initDataRaw = useLaunchParams();
const rawInitData = useRawInitData();

// Mock user data from init data
const mockUser = useMemo<TelegramUser | null>(() => {
    if (initDataRaw && typeof initDataRaw === 'object') {
        return (initDataRaw as any).user || null;
    }
    return null;
}, [initDataRaw]);
```

#### Game Logic
```typescript
const handleFlip = () => {
    if (flipSound.current) {
        flipSound.current.play();
    }
    setIsFlipped(true);
    setIsMoving(true);
    setFlipCount(prev => prev + 1);
    setTimeout(() => {
        setIsFlipped(false);
        setIsMoving(false);
    }, 2000);
};
```

## Styling

The app uses a modern design system with:
- CSS Grid and Flexbox for layouts
- CSS Custom Properties for theming
- Smooth animations and transitions
- Responsive design for all screen sizes
- Gradient backgrounds and modern UI elements

## Dependencies

- `@telegram-apps/sdk-react`: Telegram Mini Apps SDK
- `@telegram-apps/bridge`: Telegram bridge utilities
- `react`: React framework
- `typescript`: Type safety

## File Structure

```
src/
├── App.tsx              # Main app component
├── App.css              # App styles
├── FlipImage.tsx        # Main game component
├── FlipImage.css        # Game component styles
├── index.tsx            # App entry point
└── ...
```

## Deployment

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### GitHub Pages

1. Add to package.json:
```json
{
  "homepage": "https://yourusername.github.io/your-repo-name",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

2. Install gh-pages: `npm install --save-dev gh-pages`
3. Deploy: `npm run deploy`

## Troubleshooting

### Common Issues

1. **Authentication not working**: Ensure the app is accessed through Telegram
2. **Build errors**: Check that all dependencies are installed
3. **Styling issues**: Clear browser cache and restart dev server

### Debug Information

The app includes a debug section that shows:
- Init data from Telegram
- Raw init data
- User information
- Authentication status

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team. 