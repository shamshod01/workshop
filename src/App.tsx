import './App.css';

// src/App.tsx
import React from 'react';
import { useParams } from 'react-router-dom';

import { SDKProvider } from '@tma.js/sdk-react';

import backImage from './back.png';
import FlipImage from './FlipImage';
import frontImage from './usd-front.png';

const App: React.FC = () => {
    let { params } = useParams();

    return (
        <SDKProvider acceptCustomStyles debug={true}>
            <h1>USER TID: {params}</h1>

        <div className="App">
            <FlipImage frontImage={frontImage} backImage={backImage} />
        </div>
        </SDKProvider>
    );
};

export default App;