require('dotenv').config();
const { ethers } = require('hardhat');
const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");



/*------------------------------------------------ FIX --------------------------------------------------*/



async function main() {
    const provider = new ethers.getDefaultProvider(process.env.INFURA_URL);
    const PRIVATE_KEY = process.env.PRIVATE_KEY;

    console.log(`Private Key: ${PRIVATE_KEY}`);

    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    // Deploy a mock ERC-20 token
    const name = "MyToken";
    const symbol = "MTK";
    const initialBalance = 100000;
    const Token = await ethers.getContractFactory("ERC20Mock", wallet);
    const token = await Token.deploy(name, symbol, wallet.address, initialBalance);
    await token.waitForDeployment();
    const tokenAddr = token.address;
    console.log('Token deployed to:', tokenAddr);
    console.log('Owner address:', wallet.address);
    console.log('Token balance:', ethers.utils.formatUnits(await token.balanceOf(wallet.address), 18));

    // Build the merkle tree with a small whitelist
    const whitelist_values = [
        [wallet.address, "500"],
        ["0xAddress2", "200"],
        ["0xAddress3", "100"],
        ["0xAddress4", "100"],
        ["0xAddress5", "50"],
        ["0xAddress6", "50"]
    ];
    const tree = StandardMerkleTree.of(whitelist_values, ["address", "uint256"]);
    const merkleRoot = tree.root;
    console.log('Merkle Root:', merkleRoot);

    // Deploy the Airdrop contract
    const Airdrop = await ethers.getContractFactory("Airdrop", wallet);
    const airdrop = await Airdrop.deploy(merkleRoot, tokenAddr);
    await airdrop.waitForDeployment();
    console.log('Airdrop deployed to:', airdrop.address);

    // Transfer tokens to the airdrop contract
    const transferTx = await token.transfer(airdrop.address, initialBalance);
    await transferTx.wait();
    console.log('Tokens transferred to Airdrop contract');

    // show a link to sepolia etherscan
    console.log('https://sepolia.etherscan.io/address/' + airdrop.address);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
