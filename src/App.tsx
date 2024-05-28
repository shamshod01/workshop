// src/App.tsx
import React from 'react';
import FlipImage from './FlipImage';
import frontImage from './usd-front.png';
import backImage from './back.png';
import './App.css';

const App: React.FC = () => {
    return (
        <div className="App">
            <FlipImage frontImage={frontImage} backImage={backImage} />
        </div>
    );
};

export default App;
