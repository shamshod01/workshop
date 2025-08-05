import './App.css';

// src/App.tsx
import React from 'react';



import backImage from './back.png';
import FlipImage from './FlipImage';
import frontImage from './usd-front.png';
import { isTMA } from '@telegram-apps/bridge';

const App: React.FC = () => {
    const isTelegramApp = isTMA();

    return (
        <div className="App">
            <h1>Vibrate Test</h1>
            {isTelegramApp ? (
                <FlipImage frontImage={frontImage} backImage={backImage} />
            ) : (
                <div className="non-telegram-fallback">
                    <div className="fallback-content">
                        <h1>🎯 Telegram Coin Flip</h1>
                        <p>This app is designed to run within Telegram Mini Apps.</p>
                        <div className="telegram-info">
                            <h3>To use this app:</h3>
                            <ol>
                                <li>Open Telegram on your device</li>
                                <li>Search for this bot or use the provided link</li>
                                <li>Launch the Mini App from within Telegram</li>
                            </ol>
                        </div>
                        <div className="demo-note">
                            <p><strong>Note:</strong> This is a demo version. The full functionality requires Telegram Mini Apps environment.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;