import './App.css';

// src/App.tsx
import React from 'react';

import { SDKProvider } from '@tma.js/sdk-react';

import backImage from './back.png';
import FlipImage from './FlipImage';
import frontImage from './usd-front.png';

const App: React.FC = () => {

    return (
        <SDKProvider acceptCustomStyles debug={true}>
            <h1>USER TID:</h1>

        <div className="App">
            <FlipImage frontImage={frontImage} backImage={backImage} />
        </div>
        </SDKProvider>
    );
};

export default App;