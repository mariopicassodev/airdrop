require('dotenv').config();
const fs = require('fs');
const { ethers } = require('hardhat');
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const whitelist = require('../data/test-testnet-whitelist.json');


async function main() {
    const provider = new ethers.getDefaultProvider("https://holesky.infura.io/v3/ca37cec292f745d289c0f1b104088e94");
    const PRIVATE_KEY = "601c5affd9520a243febeda9d40287ddb93b6bdbbb656b44dfc39d1e8c2045b7";

    console.log(`Private Key: ${PRIVATE_KEY}`);

    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    // Deploy a mock ERC-20 token
    const name = "MyToken";
    const symbol = "MTK";
    const initialBalance = 100000;
    const Token = await ethers.getContractFactory("ERC20Mock", wallet);
    const token = await Token.deploy(name, symbol, wallet.address, initialBalance);
    await token.waitForDeployment();
    const tokenAddr = await token.getAddress();
    console.log('Token deployed to:', tokenAddr);
    console.log('Owner address:', wallet.address);
    console.log('Token balance:', await token.balanceOf(wallet.address));

    // Build the merkle tree with a small whitelist
    const tree = StandardMerkleTree.of(whitelist, ["address", "uint256"]);
    const merkleRoot = tree.root;
    console.log('Merkle Root:', merkleRoot);
    fs.writeFileSync("./scripts/outputs/testnet-whitelist-tree.json", JSON.stringify(tree.dump()));

    // Deploy the Airdrop contract
    const Airdrop = await ethers.getContractFactory("Airdrop", wallet);
    console.log('Deploying Airdrop contract...');
    const airdrop = await Airdrop.deploy(merkleRoot, tokenAddr);
    await airdrop.waitForDeployment();
    const airdropAddr = await airdrop.getAddress();
    console.log('Airdrop deployed to:', airdropAddr);

     // Write a json with the contract addresses
     const addresses = {
        token: tokenAddr,
        airdrop: airdropAddr
    };
    fs.writeFileSync("./scripts/outputs/testnet-addresses.json", JSON.stringify(addresses));

    // Transfer tokens to the airdrop contract
    console.log('Transferring tokens to Airdrop contract...');
    const nonce = await provider.getTransactionCount(wallet.address);
    const transferTx = await token.transfer(airdropAddr, initialBalance, { nonce });
    await transferTx.wait();
    console.log('Tokens transferred to Airdrop contract');

}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
