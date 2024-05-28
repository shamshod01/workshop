// src/FlipImage.tsx
import React, { useState, useEffect, useRef } from 'react';
import './FlipImage.css';

interface FlipImageProps {
    frontImage: string;
    backImage: string;
}

const FlipImage: React.FC<FlipImageProps> = ({ frontImage, backImage }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [flipCount, setFlipCount] = useState(0);
    const [isMoving, setIsMoving] = useState(false);
    const flipSound = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize the audio element once the component mounts
        flipSound.current = new Audio(process.env.PUBLIC_URL + '/sound.mp3');
    }, []);

    const handleFlip = () => {
        if (flipSound.current) {
            flipSound.current.play();
        }
        setIsFlipped(true);
        setIsMoving(true);
        setTimeout(() => {
            setIsFlipped(false);
            setIsMoving(false);
        }, 2000);
    };

    return (
        <div
            className={`flip-container ${isFlipped ? 'flipped' : ''} ${isMoving ? 'moving-up' : ''}`}
            onClick={handleFlip}
        >
            <div className="flipper">
                <img className="front" src={frontImage} alt="Front" />
                <img className="back" src={backImage} alt="Back" />
            </div>
        </div>
    );
};

export default FlipImage;
