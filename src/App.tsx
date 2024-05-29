// src/App.tsx
import React from 'react';
import FlipImage from './FlipImage';
import frontImage from './usd-front.png';
import backImage from './back.png';
import './App.css';
import { SDKProvider } from '@tma.js/sdk-react';

const App: React.FC = () => {
    return (
        <SDKProvider acceptCustomStyles debug={true}>
            <h1>Flip Image</h1>
        <div className="App">
            <FlipImage frontImage={frontImage} backImage={backImage} />
        </div>
        </SDKProvider>
    );
};

export default App;
