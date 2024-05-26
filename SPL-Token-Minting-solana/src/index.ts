import { initializeKeypair } from './initializeKeypair'
import * as token from '@solana/spl-token'
import * as web3 from '@solana/web3.js'

async function createNewmint(
    connection: web3.Connection,
    payer: web3.Keypair,
    mintAuthority: web3.PublicKey,
    freezeAuthority: web3.PublicKey,
    decimals: number
): Promise<web3.PublicKey> {
    const tokenMint = await token.createMint(
        connection,
        payer,
        mintAuthority,
        freezeAuthority,
        decimals,
    )

    console.log(`Token Mint Address ☑️
        Token Mint: https://explorer.solana.com/address/${tokenMint}?cluster=devnet
    `);
    
    return tokenMint;
}


async function createTokenAccount(
    connection: web3.Connection,
    payer: web3.Keypair,
    mint: web3.PublicKey,
    owner: web3.PublicKey
) {
    const tokenAccount = await token.getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        owner,
    )

    console.log(`
        Token Account: https://explorer.solana.com/address/${tokenAccount.address}?cluster=devnet
    `);
    
    return tokenAccount
}

async function mintTokens(
    connection: web3.Connection,
    payer: web3.Keypair,
    mint: web3.PublicKey,
    destination: web3.PublicKey,
    authority: web3.Keypair,
    amount: number
) {
    const transactionSignature = await token.mintTo(
        connection,
        payer,
        mint,
        destination,
        authority,
        amount,
    )

    console.log(`
        Mint Token Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet
    `);
    
}


async function main() {
    const connection = new web3.Connection(web3.clusterApiUrl("devnet"))
    const admin = await initializeKeypair()
    console.log(admin.publicKey);

    const mint = new web3.PublicKey("67tmQc8SQv1gfEFyEekBWak7kVD3DpPBGoDQ6JsBbcQB");
    const mintInfo = await token.getMint(connection, mint);

    const tokenAccount = await createTokenAccount(
        connection,
        admin,
        mint,
        admin.publicKey
    )

    await mintTokens(
        connection,
        admin,
        mint,
        tokenAccount.address,
        admin,
        1000 * 10 ** mintInfo.decimals
    )
}

main().then();