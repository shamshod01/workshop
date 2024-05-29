// src/FlipImage.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
    useBackButton,
    useBackButtonRaw,
    useViewport,
    useViewportRaw,
    useBiometryManagerRaw,
} from '@tma.js/sdk-react';
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
// BackButton initializes synchronously. So, bb will be
// the BackButton instance.
    const bb = useBackButton();

// Viewport is being initialized asynchronously, so signal may return undefined.
// After some time it will receive a valid value.
    const vp = useViewport();

    useEffect(() => {
        console.log(vp); // will be undefined and then Viewport instance.
    }, [vp]);

    const bm = useBiometryManagerRaw();

    useEffect(() => {
        if (bm.error) {
            console.log('Something went wrong for BiometryManager', bm.error);
        }
    }, [bm]);

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
