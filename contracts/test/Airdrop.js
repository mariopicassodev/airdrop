const { expect } = require("chai");
const { ethers } = require("hardhat");

const { StandardMerkleTree } = require("@openzeppelin/merkle-tree");

describe("Airdrop", function () {
    let Airdrop, airdrop, owner, addr1, addr2, addr3, addr4, addr5, addr6, merkleRoot, whitelist_values, tree, token, airdropAddr;

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
        airdropAddr = await airdrop.getAddress();
        console.log('Airdrop deployed to:', airdropAddr);

        // Transfer tokens to the airdrop contract
        await token.transfer(airdropAddr, 100000);

        // Check the balance of the airdrop contract
        console.log('Airdrop balance:', await token.balanceOf(airdropAddr));
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
        const totalAmount = whitelist_values[2][1];
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
        const totalAmount = whitelist_values[2][1];
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

    it("Should reject a claim with an invalid amount", async function () {

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
        const totalAmount = whitelist_values[2][1];
        const invalidAmount = totalAmount * 2;
        await expect(airdrop.connect(addr3).claim(proof, totalAmount, invalidAmount)).to.be.revertedWith("Partial amount is greater than total amount");
    });

    it("Should reject a claim with paused contract", async function () {

        // Pause the contract
        await airdrop.pause();

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
        const totalAmount = whitelist_values[2][1];
        await expect(airdrop.connect(addr3).claim(proof, totalAmount, totalAmount)).to.be.revertedWith("Contract is paused");
    });

    it("Should reject a claim with invalid proof", async function () {

        // Test with addr3
        console.log("Valid claim user address:", addr3.address);

        // Get the proof for the user
        let proof;
        for (const [i, v] of tree.entries()) {
            if (v[0] === addr3.address) {
                proof = tree.getProof(i);
            }
        }

        console.log(proof);

        // Modify the first character of the first proof element
        if (proof && proof.length > 0) {
            let modifiedProof = proof[0].split('');
            modifiedProof[3] = modifiedProof[3] === '0' ? '1' : '0'; // Example modification
            proof[0] = modifiedProof.join('');
        }

        console.log(proof);


        // Claim the tokens
        const totalAmount = whitelist_values[2][1];
        await expect(airdrop.connect(addr3).claim(proof, totalAmount, totalAmount)).to.be.revertedWith("Invalid Merkle proof");
    });

    it("Should reject an invalid proof", async function () {

        // Request with potentially invalid proof
        const totalAmount = whitelist_values[0][1];
        const partialAmount = totalAmount / 2;
        const invalidProof = ["0x0000000000000000000000000000000000000000000000000000000000000000"];

        await expect(airdrop.connect(addr1).claim(invalidProof, totalAmount, partialAmount)).to.be.revertedWith("Invalid Merkle proof");
    });

    it("Should return total claimed amount", async function () {
        // Test with addr3 and addr2
        console.log("Valid claim user address:", addr3.address);
        console.log("Valid claim user address:", addr1.address);


        // Get the proof for the user
        let proof;
        for (const [i, v] of tree.entries()) {
            if (v[0] === addr3.address) {
                proof = tree.getProof(i);
            }
        }
        let proof2;
        for (const [i, v] of tree.entries()) {
            if (v[0] === addr1.address) {
                console.log(v[0]);
                console.log(v[1]);
                proof2 = tree.getProof(i);
                console.log(proof2);
            }
        }

        // Claim the tokens
        const totalAmount2 = whitelist_values[0][1];
        console.log(totalAmount2);
        await airdrop.connect(addr1).claim(proof2, totalAmount2, totalAmount2);
        const totalAmount = whitelist_values[2][1];
        await airdrop.connect(addr3).claim(proof, totalAmount, totalAmount);


        // Check the balance of the user
        console.log('User balance:', await token.balanceOf(addr3.address));
        expect(await token.balanceOf(addr3.address)).to.equal(totalAmount);
        console.log('User balance:', await token.balanceOf(addr1.address));
        expect(await token.balanceOf(addr1.address)).to.equal(totalAmount2);

        // Check the total claimed amount
        const totalClaimedAmount = await airdrop.getTotalClaimedAmount();
        console.log('Total claimed amount:', totalClaimedAmount);

        // convert to integer and perform sum
        const expectedTotalClaimedAmount = parseInt(totalAmount) + parseInt(totalAmount2);

        expect(totalClaimedAmount).to.equal(expectedTotalClaimedAmount);
    });
    /*
    it("Should return the logged claims", async function () {

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
        const totalAmount = whitelist_values[2][1];
        await airdrop.connect(addr3).claim(proof, totalAmount, totalAmount);

        // Check the balance of the user
        console.log('User balance:', await token.balanceOf(addr3.address));
        expect(await token.balanceOf(addr3.address)).to.equal(totalAmount);

        console.log(airdropAddr);
        const claimedEvents = await token.connect(addr3).filters.Transfer(airdropAddr);
        console.log(JSON.stringify(claimedEvents));


        // expect that claimed events is not null
        expect(claimedEvents).to.not.be.null;
    });
    */
});
