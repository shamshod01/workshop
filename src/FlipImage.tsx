// src/FlipImage.tsx
import React, {useState, useEffect, useRef, useMemo} from 'react';
import { useInitData, useLaunchParams, type User } from '@tma.js/sdk-react';

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
    const initDataRaw = useLaunchParams().initDataRaw;
    const initData = useInitData();
    const initDataRows = useMemo<any[] | undefined>(() => {
        if (!initData || !initDataRaw) {
            return;
        }
        const {
            hash,
            queryId,
            chatType,
            chatInstance,
            authDate,
            startParam,
            canSendAfter,
            canSendAfterDate,
        } = initData;
        return [
            { title: 'raw', value: initDataRaw },
            { title: 'auth_date', value: authDate.toLocaleString() },
            { title: 'auth_date (raw)', value: authDate.getTime() / 1000 },
            { title: 'hash', value: hash },
            { title: 'can_send_after', value: canSendAfterDate?.toISOString() },
            { title: 'can_send_after (raw)', value: canSendAfter },
            { title: 'query_id', value: queryId },
            { title: 'start_param', value: startParam },
            { title: 'chat_type', value: chatType },
            { title: 'chat_instance', value: chatInstance },
        ];
    }, [initData, initDataRaw]);


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
            <div>
                <h2>updated</h2>
                {initData && initData.user && <div>
                    <h3>{initData.user.id.toString()}</h3>
                    <h3>{initData.user.firstName}</h3>
                    <h3>{initData.user.lastName}</h3>
                    <h3>{initData.user.username}</h3>

                </div>}
            </div>
            <div className="flipper">
                <img className="front" src={frontImage} alt="Front" />
                <img className="back" src={backImage} alt="Back" />
            </div>
        </div>
    );
};

export default FlipImage;
