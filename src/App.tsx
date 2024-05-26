import 'react-toastify/dist/ReactToastify.css';

import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import useMetamask from './customHooks/useMetamask';
import backgroundImg from './pages/background.png';
import { ComingSoon } from './pages/comingSoon';
import { Home } from './pages/home';
import { Navbar } from './pages/navbar';
import { Stake } from './pages/stake';
import {WalletButton, WalletChooser, WalletProvider} from "./wallet";

function App() {

    const [isChooserOpened, setIsChooserOpened] = React.useState(false)
    useEffect(() => {

    }, []);
    const {
        connectWallet,
        stake,
        getStBalance,
        account} = useMetamask();

    const backgroundImageStyle: React.CSSProperties = {
        backgroundImage: `url(${backgroundImg})`, // Replace with your image path
        height: '100vh',
        width: '100vw',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        position: 'relative',
    };

    const overlayStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        color: 'white'
    };
    return (
        <div className={'app'}>
            <WalletProvider>

            <div style={backgroundImageStyle}>

                <div style={overlayStyle}>
                    <Navbar connectWallet={()=> setIsChooserOpened(true)} account={account}/>
                    {isChooserOpened && <WalletChooser close={() => setIsChooserOpened(false)} />}
                    <Routes>
                        <Route path="" element={<Home/>}/>
                        <Route path="/bridge" element={<Stake stakeFunction={stake} getStBalance={getStBalance}/>}/>
                        <Route path="*" element={<ComingSoon/>}/>

                    </Routes>
                </div>
            </div>
            </WalletProvider>

            <ToastContainer />
        </div>
    );
}

export default App;
