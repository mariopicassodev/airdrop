const { expect } = require("chai");
const { ethers } = require("hardhat");

const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");

describe("Airdrop", function () {
    let Airdrop, airdrop, owner, addr1, addr2, addr3, addr4, addr5, addr6, merkleRoot, whitelist_values, tree, token;

    beforeEach(async function () {

        // Get the signers
        [owner, addr1, addr2, addr3, addr4, addr5, addr6, _] = await ethers.getSigners();

        // Deploy a mock ERC-20 token
        const name = "MyToken";
        const symbol = "MTK";
        const initialBalance = 100000;
        const Token = await ethers.getContractFactory("ERC20Mock");
        token = await Token.deploy("MockToken", "MTK", owner.address, initialBalance);
        await token.waitForDeployment();
        tokenAddr = await token.getAddress();
        console.log('Token deployed to:', tokenAddr);
        console.log('Owner address:', owner.address);
        console.log('Token balance:', await token.balanceOf(owner.address));

        // Build the merkle tree with a small whitelist
        whitelist_values = [
            [addr1.address, "500"],
            [addr2.address, "200"],
            [addr3.address, "100"],
            [addr4.address, "100"],
            [addr5.address, "50"],
            [addr6.address, "50"]
        ];
        tree = StandardMerkleTree.of(whitelist_values, ["address", "uint256"]);
        merkleRoot = tree.root;
        console.log('Merkle Root:', tree.root);

        Airdrop = await ethers.getContractFactory("Airdrop");
        airdrop = await Airdrop.deploy(merkleRoot, tokenAddr);
        await airdrop.waitForDeployment();
        const AirdropAddr = await airdrop.getAddress();
        console.log('Airdrop deployed to:', AirdropAddr);

        // Transfer tokens to the airdrop contract
        await token.transfer(AirdropAddr, 100000);

        // Check the balance of the airdrop contract
        console.log('Airdrop balance:', await token.balanceOf(AirdropAddr));
    });

    it("Should allow a valid claim", async function () {

        // Test with addr3
        console.log("Valid claim user address:", addr3.address);

        // Get the proof for the user
        let proof;
        for (const [i, v] of tree.entries()) {
            if (v[0] === addr3.address) {
                proof = tree.getProof(i);
            }
        }

        // Claim the tokens
        const totalAmount = whitelist_values[3][1];
        await airdrop.connect(addr3).claim(proof, totalAmount, totalAmount);

        // Check the balance of the user
        console.log('User balance:', await token.balanceOf(addr3.address));
        expect(await token.balanceOf(addr3.address)).to.equal(totalAmount);
    });

    it("Should allow valid claims with partial amounts", async function () {

        // Test with addr3
        console.log("Valid claim user address:", addr3.address);

        // Get the proof for the user
        let proof;
        for (const [i, v] of tree.entries()) {
            if (v[0] === addr3.address) {
                proof = tree.getProof(i);
            }
        }

        // Claim the tokens
        const totalAmount = whitelist_values[3][1];
        const partialAmount = totalAmount / 2;
        await airdrop.connect(addr3).claim(proof, totalAmount, partialAmount);

        // Check the balance of the user
        console.log('User balance:', await token.balanceOf(addr3.address));
        expect(await token.balanceOf(addr3.address)).to.equal(partialAmount);

        // Claim the remaining tokens
        await airdrop.connect(addr3).claim(proof, totalAmount, partialAmount);

        // Check the balance of the user
        console.log('User balance:', await token.balanceOf(addr3.address));
        expect(await token.balanceOf(addr3.address)).to.equal(totalAmount);
    });


    it("Should reject an invalid proof", async function () {

        // Request with potentially invalid proof
        const totalAmount = whitelist_values[0][1];
        const partialAmount = totalAmount / 2;
        const invalidProof = ["0x0000000000000000000000000000000000000000000000000000000000000000"];

        await expect(airdrop.connect(addr1).claim(invalidProof, totalAmount, partialAmount)).to.be.revertedWith("Invalid Merkle proof");
    });
});
