// src/FlipImage.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLaunchParams, useRawInitData } from '@telegram-apps/sdk-react';
import './FlipImage.css';

interface FlipImageProps {
    frontImage: string;
    backImage: string;
}

interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
}

const FlipImage: React.FC<FlipImageProps> = ({ frontImage, backImage }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [flipCount, setFlipCount] = useState(0);
    const [isMoving, setIsMoving] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const flipSound = useRef<HTMLAudioElement | null>(null);
    
    // Telegram SDK hooks
    const initDataRaw = useLaunchParams();
    const rawInitData = useRawInitData();

    const initDataRows = useMemo<any[] | undefined>(() => {
        if (!initDataRaw) {
            return;
        }
        return [
            { title: 'raw', value: initDataRaw },
        ];
    }, [initDataRaw]);

    // Mock user data - in real implementation, this would come from Telegram SDK
    const mockUser = useMemo<TelegramUser | null>(() => {
        if (initDataRaw && typeof initDataRaw === 'object') {
            return (initDataRaw as any).user || null;
        }
        return null;
    }, [initDataRaw]);

    useEffect(() => {
        // Initialize the audio element once the component mounts
        flipSound.current = new Audio(process.env.PUBLIC_URL + '/sound.mp3');
        
        // Check if user is authenticated
        if (mockUser || initDataRaw) {
            setIsLoggedIn(true);
        }
    }, [mockUser, initDataRaw]);

    const handleFlip = () => {
        if (flipSound.current) {
            flipSound.current.play();
        }
        setIsFlipped(true);
        setIsMoving(true);
        setFlipCount(prev => prev + 1);
        setTimeout(() => {
            setIsFlipped(false);
            setIsMoving(false);
        }, 2000);
    };

    const handleTelegramLogin = () => {
        // Telegram login is handled automatically by the SDK
        // This function can be used for additional login logic
        console.log('Telegram login initiated');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        // Additional logout logic can be added here
    };

    return (
        <div className="telegram-login-container">
            {/* Header */}
            <div className="header">
                <h1>🎯 Telegram Coin Flip</h1>
                <p>Flip coins and earn rewards with Telegram</p>
            </div>

            {/* Login Section */}
            {!isLoggedIn ? (
                <div className="login-section">
                    <div className="login-card">
                        <div className="telegram-logo">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.06-.14-.04-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" fill="#0088cc"/>
                            </svg>
                        </div>
                        <h2>Welcome to Coin Flip</h2>
                        <p>Connect with your Telegram account to start playing</p>
                        
                        <div className="auth-info">
                            <h3>🔐 Authentication Status</h3>
                            {initDataRows && (
                                <div className="auth-details">
                                    <p><strong>Init Data:</strong> {initDataRaw ? '✅ Available' : '❌ Not Available'}</p>
                                    <p><strong>Raw Data:</strong> {rawInitData ? '✅ Available' : '❌ Not Available'}</p>
                                    {mockUser && <p><strong>User:</strong> ✅ Authenticated</p>}
                                </div>
                            )}
                        </div>

                        <button 
                            className="telegram-login-btn"
                            onClick={handleTelegramLogin}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.06-.14-.04-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                            </svg>
                            Login with Telegram
                        </button>
                    </div>
                </div>
            ) : (
                /* User Profile and Game Section */
                <div className="user-section">
                    {/* User Profile */}
                    <div className="user-profile">
                        <div className="profile-header">
                            <div className="profile-avatar">
                                {mockUser?.photo_url ? (
                                    <img src={mockUser.photo_url} alt="Profile" />
                                ) : (
                                    <div className="avatar-placeholder">
                                        {mockUser?.first_name?.charAt(0) || 'U'}
                                    </div>
                                )}
                            </div>
                            <div className="profile-info">
                                <h3>{mockUser?.first_name} {mockUser?.last_name}</h3>
                                <p>@{mockUser?.username || 'user'}</p>
                                <span className="user-id">ID: {mockUser?.id}</span>
                            </div>
                            <button className="logout-btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Game Stats */}
                    <div className="game-stats">
                        <div className="stat-card">
                            <h4>Total Flips</h4>
                            <p>{flipCount}</p>
                        </div>
                        <div className="stat-card">
                            <h4>Wins</h4>
                            <p>{Math.floor(flipCount / 2)}</p>
                        </div>
                        <div className="stat-card">
                            <h4>Win Rate</h4>
                            <p>{flipCount > 0 ? Math.round((Math.floor(flipCount / 2) / flipCount) * 100) : 0}%</p>
                        </div>
                    </div>

                    {/* Coin Flip Game */}
                    <div className="game-section">
                        <h3>🎲 Flip the Coin</h3>
                        <div className={`flip-container ${isMoving ? 'moving-up' : ''}`}>
                            <div className={`flipper ${isFlipped ? 'flipped' : ''}`}>
                                <div className="front">
                                    <img src={frontImage} alt="Front" />
                                </div>
                                <div className="back">
                                    <img src={backImage} alt="Back" />
                                </div>
                            </div>
                        </div>
                        <button 
                            className="flip-btn"
                            onClick={handleFlip}
                            disabled={isMoving}
                        >
                            {isMoving ? 'Flipping...' : 'Flip Coin!'}
                        </button>
                    </div>

                    {/* Debug Info */}
                    <div className="debug-info">
                        <details>
                            <summary>🔧 Debug Information</summary>
                            <div className="debug-content">
                                {initDataRows && (
                                    <div>
                                        <h4>Init Data:</h4>
                                        <pre>{JSON.stringify(initDataRows, null, 2)}</pre>
                                    </div>
                                )}
                                {rawInitData && (
                                    <div>
                                        <h4>Raw Init Data:</h4>
                                        <pre>{rawInitData}</pre>
                                    </div>
                                )}
                                {mockUser && (
                                    <div>
                                        <h4>User Data:</h4>
                                        <pre>{JSON.stringify(mockUser, null, 2)}</pre>
                                    </div>
                                )}
                            </div>
                        </details>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlipImage;
