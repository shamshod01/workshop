import React, { useEffect, useCallback, useState } from 'react';
import './index.css'

enum WalletSdkProvider {
    UNISAT = 'unisat',
}

type WalletInfoType = {
    sdkProvider: WalletSdkProvider | null,
    clear: () => void,

    address: string | null,
    network: string | null,
}

type WalletApiType = {
    sendBitcoin: (to: string, amount: string, options: any) => Promise<any>,
    signMessage: (msg: string, type: string | null) => Promise<any>,
    signPsbt: (psbt: string, options: any) => Promise<any>,
    signPsbts: (psbts: string[], options: any) => Promise<any>,
    // pushTx: (tx: string) => Promise<any>,
}

type WalletContextType = {
    info: WalletInfoType | null,
    setInfo: (info: WalletInfoType) => void,

    api: WalletApiType | null,
    setApi: (api: WalletApiType) => void,
}

const WalletContext = React.createContext(null as WalletContextType | null)

export const useWallet = () => {
    const context = React.useContext(WalletContext)
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider')
    }
    return context
}

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
    const [info, setInfo] = React.useState<WalletInfoType | null>(null)
    const [api, setApi] = React.useState<WalletApiType | null>(null)

    return (
        <WalletContext.Provider value={{
        info,
            setInfo,
            api,
            setApi,
    }}>
    {children}
    </WalletContext.Provider>
)
}

export const WalletButton = () => {
    const { info, setInfo, setApi } = useWallet()
    const [isChooserOpened, setIsChooserOpened] = React.useState(false)

    if (info?.address) {
        // TODO: Add disconnect UI
        return (
            <div>
                <button className="wallet-button">
                {info.address}
                </button>
                </div>
        )
    }

    return (
        <div>
            <button className="wallet-button" onClick={() => setIsChooserOpened(true)}>
    Connect Wallet
    </button>

    {
        isChooserOpened
            ? <WalletChooser close={() => setIsChooserOpened(false)} />
    : null
    }
    </div>
)
}

export const WalletChooser = ({ close }: { close: () => void }) => {
    const wallets = [
        { provider: WalletSdkProvider.UNISAT, name: 'UniSat Wallet', icon: 'unisat-icon' },
        //   { name: 'Xverse Wallet', icon: 'xverse-icon' },
        //   { name: 'Leather Wallet', icon: 'leather-icon' },
        //   { name: 'OKX Wallet', icon: 'okx-icon' },
        //   { name: 'Bitget Wallet', icon: 'bitget-icon' },
        //   { name: 'Phantom Wallet', icon: 'phantom-icon' },
        //   { name: 'Magic Eden', icon: 'magiceden-icon' },
        //   { name: 'Enkrypt', icon: 'enkrypt-icon' },
    ]

    const [sdkProvider, setSdkProvider] = React.useState<WalletSdkProvider | null>(null)
    switch (sdkProvider) {
        case WalletSdkProvider.UNISAT:
            return <UnisatConnector close={close} />
        default:
            return (
                <div className="wallet-chooser-overlay">
                <div className="wallet-chooser">
                <div className="wallet-chooser-header">
                    <h2>Choose Wallet</h2>
        <button className="close-button" onClick={() => close()}>Close</button>
    </div>
    <ul className="wallet-list">
        {wallets.map((wallet, index) => (
                <li key={index} className="wallet-item" onClick={() => setSdkProvider(wallet.provider)}>
    <div className={`wallet-icon ${wallet.icon}`}></div>
    <span>{wallet.name}</span>
    </li>
))}
    </ul>
    </div>
    </div>
)
}
}

function useAsync(callback: () => Promise<any>, dependencies = []) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()
    const [value, setValue] = useState()

    const callbackMemoized = useCallback(() => {
        setLoading(true)
        setError(undefined)
        setValue(undefined)
        callback()
            .then(setValue)
            .catch(setError)
            .finally(() => setLoading(false))
    }, dependencies)

    useEffect(() => {
        callbackMemoized()
    }, [callbackMemoized])

    return { loading, error, value }
}


const UnisatConnector = ({ close }: { close: () => void }) => {
    const { setInfo, setApi } = useWallet()
    const [unisatInstalled, setUnisatInstalled] = React.useState(false)

    // TODO: Handle accountsChanged, networkChanged, unisat not installed
    // useEffect(() => {
    //     async function checkUnisat() {
    //         let unisat = (window as any).unisat

    //         for (let i = 1; i < 10 && !unisat; i += 1) {
    //             await new Promise((resolve) => setTimeout(resolve, 100 * i))
    //             unisat = (window as any).unisat
    //         }

    //         if (unisat) {
    //             setUnisatInstalled(true)
    //         } else if (!unisat)
    //             return

    //         unisat.getAccounts().then((accounts: string[]) => {
    //             handleAccountsChanged(accounts)
    //         });

    //         unisat.on("accountsChanged", handleAccountsChanged)
    //         unisat.on("networkChanged", handleNetworkChanged)

    //         return () => {
    //             unisat.removeListener("accountsChanged", handleAccountsChanged)
    //             unisat.removeListener("networkChanged", handleNetworkChanged)
    //         }
    //     }

    //     checkUnisat().then()
    // }, [])

    const walletName = 'UniSat Wallet'

    const { loading, error, value } = useAsync(async () => {
        const unisat = (window as any).unisat

        const account = await unisat.requestAccounts()
        const network = await unisat.getNetwork()

        await unisat.signMessage(`Welcome Arrow Bridge`)

        setInfo({
            sdkProvider: WalletSdkProvider.UNISAT,
            clear: () => { },
            address: account[0],
            network,
        })

        setApi({
            sendBitcoin: async (to, amount, options) => {
                return await unisat.sendBitcoin(to, amount, options)
            },
            signMessage: async (msg, type) => {
                return await unisat.signMessage(msg, type)
            },
            signPsbt: async (psbt, options) => {
                return await unisat.signPsbt(psbt, options)
            },
            signPsbts: async (psbts, options) => {
                return await unisat.signPsbts(psbts, options)
            },
        })
    })

    if (loading) {
        return (
            <div className="wallet-connecting-overlay">
            <div className="wallet-connecting">
            <div className="wallet-connecting-header">
                <h2>Choose Wallet</h2>
        <button className="close-button" onClick={() => close()}>Close</button>
        </div>
        <div className="wallet-connecting-content">
            {/* <div className={`wallet-icon ${walletIcon}`}></div> */}
            <h3>{walletName}</h3>
            <div className="connecting-status">
        <span className="loading-icon"></span>
            <span>Connecting...</span>
        </div>
        <button className="cancel-button" onClick={() => close()}>Cancel</button>
        </div>
        </div>
        </div>
    )
    }

    // TODO: Handle error
    return null
}

// TODO: Implement
type Edict = {
    id: RuneId,
    amount: number,
    output: number,
}

type RuneId = {
    block: number,
    tx: number,
}

type Dest = {
    chainId: number,
    address: string
}

function sendRunes(inputs: {runeId: RuneId, amount: number, to: Dest}[]) {
}

function sendBitcoins(inputs: {amount: number, to: Dest}[]) {
}