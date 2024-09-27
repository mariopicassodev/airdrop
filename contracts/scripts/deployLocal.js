require('dotenv').config();
const fs = require('fs');
const { ethers } = require('hardhat');
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");
const whitelist = require('../data/test-local-whitelist.json');

async function main() {
    const provider = new ethers.getDefaultProvider("http://127.0.0.1:8545");
    const privkey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    const wallet = new ethers.Wallet(privkey, provider);

    // Deploy a mock ERC-20 token
    const name = "MyToken";
    const symbol = "MTK";
    const initialBalance = 100000;
    const Token = await ethers.getContractFactory("ERC20Mock", wallet);
    console.log('Deploying Token contract...');
    const token = await Token.deploy(name, symbol, wallet.address, initialBalance);
    await token.waitForDeployment();
    const tokenAddr = await token.getAddress();
    console.log('Token deployed to:', tokenAddr);
    console.log('Owner address:', wallet.address);
    console.log('Token balance:', await token.balanceOf(wallet.address));

    const tree = StandardMerkleTree.of(whitelist, ["address", "uint256"]);
    const merkleRoot = tree.root;
    console.log('Merkle Root:', merkleRoot);
    fs.writeFileSync("./data/local-whitelist-tree.json", JSON.stringify(tree.dump()));

    // Deploy the Airdrop contract
    const Airdrop = await ethers.getContractFactory("Airdrop", wallet);
    console.log('Deploying Airdrop contract...');
    const airdrop = await Airdrop.deploy(merkleRoot, tokenAddr);
    await airdrop.waitForDeployment();
    const airdropAddr = await airdrop.getAddress();
    console.log('Airdrop deployed to:', airdropAddr);

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
