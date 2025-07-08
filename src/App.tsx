import './App.css';

// src/App.tsx
import React from 'react';



import backImage from './back.png';
import FlipImage from './FlipImage';
import frontImage from './usd-front.png';
import { isTMA } from '@telegram-apps/bridge';
const App: React.FC = () => {


    return (

        <div className="App">
            <h1>Hello</h1>
            {isTMA() && < FlipImage frontImage={frontImage} backImage={backImage} />}
        </div>

    );
};

export default App;