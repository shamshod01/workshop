/// <reference types="react-scripts" />
interface Ethereum {
    request: (args: any) => Promise<any>;
    on: (args: any, callback: any) => Promise<any>;

    removeListener: (args: any, callback: any) => Promise<any>;
    // Add any other methods or properties you access on the ethereum object here.
}

interface Window {
    ethereum?: Ethereum;
}