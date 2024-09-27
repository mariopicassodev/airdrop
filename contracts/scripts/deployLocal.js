require('dotenv').config();
const { ethers } = require('hardhat');
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");

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

    // Build the merkle tree with a small whitelist
    const whitelist_values = [
        [wallet.address, "500"],
        ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8", "200"],
        ["0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", "100"],
        ["0x90F79bf6EB2c4f870365E785982E1f101E93b906", "100"],
        ["0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", "50"],
        ["0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc", "50"]
    ];
    const tree = StandardMerkleTree.of(whitelist_values, ["address", "uint256"]);
    const merkleRoot = tree.root;
    console.log('Merkle Root:', merkleRoot);

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
