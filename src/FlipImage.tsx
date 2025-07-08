// src/FlipImage.tsx
import React, {useState, useEffect, useRef, useMemo} from 'react';
import { useLaunchParams } from '@telegram-apps/sdk-react';


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
    const initDataRaw = useLaunchParams();


    const initDataRows = useMemo<any[] | undefined>(() => {
        if (!initDataRaw) {
            return;
        }

        return [
            { title: 'raw', value: initDataRaw },
        ];
    }, [initDataRaw]);


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
        <div>


            <div>
                <h2>share AUTH here</h2>
                {
                    initDataRows && <div>
                    <br/>
                    <p>{'start of init data '}{JSON.stringify(initDataRows)} {' end of init data'}</p>
                    <br/>
                    </div>
                }
            </div>
        </div>
    );
};

export default FlipImage;
