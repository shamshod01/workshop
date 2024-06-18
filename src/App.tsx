import './App.css';

// src/App.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { SDKProvider } from '@tma.js/sdk-react';

import backImage from './back.png';
import FlipImage from './FlipImage';
import frontImage from './usd-front.png';

const App: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [debug, setDebug] = useState(searchParams.get('tid'));
    useEffect(() => {
        if (searchParams.has('tid')) {
            setDebug(searchParams.get('tid'));
        }
    },[]);
    return (
        <SDKProvider acceptCustomStyles debug={true}>
            <h1>USER TID: {debug}</h1>

        <div className="App">
            <FlipImage frontImage={frontImage} backImage={backImage} />
        </div>
        </SDKProvider>
    );
};

export default App;