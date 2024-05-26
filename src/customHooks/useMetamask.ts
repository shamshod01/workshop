import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { MetaMaskSDK } from '@metamask/sdk';

import {
  LSDCORE, StakingRouter, StBFC, WithdrawalQueue, wStBFC
} from './contracts';

const WEB3 = {
    JSON_RPC_URL: 'https://public-01.testnet.bifrostnetwork.com/rpc',
    CHAIN_ID: 49088,
    CHAIN_NAME: 'Bifrost',
    SCAN_URL: 'https://explorer.testnet.bifrostnetwork.com/',
    SYMBOL: 'BFC',
}
const ethereum = new MetaMaskSDK({
    useDeeplink: false,
    //@ts-ignore
    communicationLayerPreference: "socket",
});
interface Token {
    address: string;
    symbol: string;
    decimals: number;
    image: string;
}

const supportedChain = WEB3.CHAIN_ID;
const useMetaMask = () => {
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [account, setAccount] = useState<string>();
    const [error, setError] = useState<Error | null>(null);
    const [currentChainId, setCurrentChainId] = useState<string | undefined>(undefined);
    // Connect to MetaMask wallet
    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                setProvider(new ethers.BrowserProvider(window.ethereum));

                const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
                setAccount(accounts[0]);
                const chainId = await window.ethereum.request({method: 'eth_chainId'});
                setCurrentChainId(chainId.toString());
                if (chainId.toString() !== supportedChain.toString()) {
                    await switchChain(supportedChain);
                }
                window.ethereum.on('accountsChanged', (accounts: string[]) => {
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                    } else {
                        setAccount(undefined);
                    }
                });

                window.ethereum.on('chainChanged', (chainId: string) => {
                    const chainIdInt = parseInt(chainId, 16);
                    setCurrentChainId(chainIdInt.toString());
                });

            return accounts[0];
            } catch (error) {
                setError(error as Error);
            }
        } else {
            console.log('MetaMask is not installed');
        }
    };

    // Add a new chain (network) to MetaMask
    const addChain = async (chainId: string,
                            chainName: string,
                            rpcUrl: string,
                            symbol: string,
                            name: string,
                            scanUrl: string) => {
        try {
            await window.ethereum?.request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        blockExplorerUrls: [
                            scanUrl
                        ],
                        iconUrls: [],
                        nativeCurrency: {
                            name,
                            symbol,
                            decimals: 18
                        },
                        rpcUrls: [
                            rpcUrl
                        ],
                        chainId,
                        chainName
                    }
                ]

            });
        } catch (error) {
            setError(error as Error);
        }
    };

    // Switch between chains in MetaMask
    const switchChain = async (chainId: number) => {
        const chainIdHex = '0x' + chainId.toString(16);
        try {
            await window.ethereum?.request({
                method: 'wallet_switchEthereumChain',
                params: [{chainId:chainIdHex}],
            });
            setCurrentChainId(chainId.toString());
        } catch (error) {
            await addChain(chainIdHex,
                WEB3.CHAIN_NAME,
                WEB3.JSON_RPC_URL,
                WEB3.SYMBOL,
                WEB3.SYMBOL,
                WEB3.SCAN_URL
            );
        }
        const latestData = await window.ethereum?.request({method: 'eth_chainId'});
        setCurrentChainId(latestData?.toString());
    };

    async function stake(nominators: string[], amounts: bigint[], signature: any) {
            const signer = await provider?.getSigner();
            if(!account || !signer){
                await connectWallet();
            }
            if(currentChainId !==  '0x' + WEB3.CHAIN_ID.toString(16)){
                await switchChain(supportedChain);

            }

            const contract = new ethers.Contract(LSDCORE.address, LSDCORE.abi, signer);
            let total = amounts.reduce((a, b) => BigInt(a) + b, BigInt(0));

            const tx = await contract.stake(nominators, amounts, signature, {value: total});
            await tx.wait();
    }

    async function unstake(nominators: string[], amounts: bigint[], totalAmount: bigint, signature: any) {
            const signer = await provider?.getSigner();
            if(!account || !signer){
                await connectWallet();
            }
            if(currentChainId !==  '0x' + WEB3.CHAIN_ID.toString(16)){
                await switchChain(supportedChain);

            }
            const stBFC = new ethers.Contract(StBFC.address, StBFC.abi, signer);
            toast.info('Approving stBFC to be unstaked');
            let tx = await stBFC.approve(LSDCORE.address, ethers.MaxUint256);
            await tx.wait();

            const lsd = new ethers.Contract(LSDCORE.address, LSDCORE.abi, signer);
            toast.info('Minting unstake Request NFT');
            console.log(nominators, amounts, totalAmount, signature);
            tx = await lsd.unstake(nominators, amounts, totalAmount, signature);
            await tx.wait();
    }

    async function claim(id: bigint) {
        const signer = await provider?.getSigner();
            if(!account || !signer){
                await connectWallet();
            }
            if(currentChainId !==  '0x' + WEB3.CHAIN_ID.toString(16)){
                await switchChain(supportedChain);
            }

            toast.info('Withdraw NFT');

            const lsdCore = new ethers.Contract(LSDCORE.address, LSDCORE.abi, signer);
            let tx = await lsdCore.withdraw(id);
            await tx.await();
    }

    async function wrap(amount: string) {
            const signer = await provider?.getSigner();
            if(!account || !signer){
                await connectWallet();
            }
            if(currentChainId !==  '0x' + WEB3.CHAIN_ID.toString(16)){
                await switchChain(supportedChain);

            }
            console.log(signer)
            const stBFC = new ethers.Contract(StBFC.address, StBFC.abi, signer);
            console.log(stBFC)
            toast.info('Approving stBFC to be wrapped');
            let tx = await stBFC.approve(wStBFC.address, ethers.MaxUint256);
            await tx.wait();
            toast.info('Wrapping stBFC');
            let wstBFC = new ethers.Contract(wStBFC.address, wStBFC.abi, signer);
            tx = await wstBFC.wrap(ethers.parseEther(amount));
            await tx.wait();
    }

    async function unwrap(amount: string) {
            const signer = await provider?.getSigner();
            if(!account || !signer){
                await connectWallet();
            }
            if(currentChainId !==  '0x' + WEB3.CHAIN_ID.toString(16)){
                await switchChain(supportedChain);

            }

            const wstBFC = new ethers.Contract(wStBFC.address, wStBFC.abi, signer);
            toast.info('Approving wstBFC to be unwrapped');
            let tx = await wstBFC.approve(wStBFC.address, ethers.MaxUint256);
            await tx.wait();
            toast.info('Unwrapping wstBFC');
            tx = await wstBFC.unwrap(ethers.parseEther(amount));
            await tx.wait();
    }

    async function getStBalance(): Promise<string> {
        const signer = await provider?.getSigner();
        if(!account || !signer){
          return '0';
        }
        const stBFC = new ethers.Contract(StBFC.address, StBFC.abi, signer);
        const b =  await stBFC.balanceOf(account);
        return Number(ethers.formatUnits(b, 18)).toFixed(0);
    }

    async function getWStBalance(): Promise<string> {
        const signer = await provider?.getSigner();
        if(!account || !signer){
         return '0';
        }
        const wstBFC = new ethers.Contract(wStBFC.address, wStBFC.abi, signer);
        const b = await wstBFC.balanceOf(account);
        return Number(ethers.formatUnits(b, 18)).toFixed(0);
    }

    async function getNFTBalance(): Promise<any> {
        console.log('getNFTBalance')
        const signer = await provider?.getSigner();
        if(!account || !signer){
            return [];
        }
        const withdrawQueue = new ethers.Contract(WithdrawalQueue.address, WithdrawalQueue.abi, signer);
        const ids = await withdrawQueue.walletOfOwner(account); // account soon
        if(ids.length === 0){
            return [];
        }

        const stakingRouter = new ethers.Contract(StakingRouter.address, StakingRouter.abi, signer);
        const requests = [];
        for(let i = 0; i < ids.length; i++){
            requests.push({id: ids[i], ...await stakingRouter.getUnstakeRequest(ids[i])});
        }
        console.log(requests);
        return requests;
    }

    // Handle chain change events
    useEffect(() => {
        const handleChainChanged = (chainId: string) => {
            setCurrentChainId(chainId);
        };

        if (window.ethereum) {
            window.ethereum.on('chainChanged', handleChainChanged);
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            }
        };
    }, []);

    return {
        connectWallet,
        stake,
        unstake,
        claim,
        wrap,
        unwrap,
        getStBalance,
        getWStBalance,
        getNFTBalance,
        account};
};

export default useMetaMask;