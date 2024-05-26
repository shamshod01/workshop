import * as web3 from '@solana/web3.js'
import * as fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()


export async function initializeKeypair(
): Promise<web3.Keypair> {
    if (!process.env.PRIVATE_KEY) {
        console.log("Creating a .env file");
        const signer = web3.Keypair.generate()
        fs.writeFileSync(".env", `PRIVATE_KEY=[${signer.secretKey.toString()}]`)

        return signer
    }

    const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[]
    const secretKey = Uint8Array.from(secret)
    const keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey)
    // await airdropSolIfNeeded(keypairFromSecretKey, connection)

    return keypairFromSecretKey
}
