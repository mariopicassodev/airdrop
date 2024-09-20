const { expect } = require("chai");

const { StandardMerkleTree } = require("@openzeppelin/merkle-tree")


describe("Airdrop", function () {
    let Airdrop, airdrop, owner, addr1, addr2, addr3, addr4, addr5, addr6, merkleRoot, whitelist_values, tree;

    beforeEach(async function () {
        Airdrop = await ethers.getContractFactory("Airdrop");
        [owner, addr1, addr2, addr3, addr4, addr5, addr6, _] = await ethers.getSigners();

        whitelist_values = [[addr1.address, "500"], [addr2.address, "200"], [addr3.address, "100"], [addr4.address, "100"], [addr5.address, "50"], [addr6.address, "50"]];

        tree = StandardMerkleTree.of(whitelist_values, ["address", "uint256"]);
        merkleRoot = tree.root;

        console.log('Merkle Root:', tree.root);

        airdrop = await Airdrop.deploy(merkleRoot);
        await airdrop.waitForDeployment();
        const contractAddr = await airdrop.getAddress();
        console.log('Airdrop deployed to:', contractAddr);

    });

    it("Should allow a valid claim", async function () {

        // Test with addr3
        const contractAddr = await airdrop.getAddress();
        const amount = whitelist_values[3][1];
        let proof;
        
        for (const [i, v] of tree.entries()) {
            if (v[0] === addr3.address) {
                proof = tree.getProof(i);
            }
        }

        // Send ether to the contract
        await owner.sendTransaction({ to: contractAddr, value: amount });

        // Perform the claim
        await expect(airdrop.connect(addr3).claim(proof, amount)).to.changeEtherBalance(addr3, amount);
    });

    it("Should reject an invalid proof", async function () {
        const amount = whitelist_values[0][1];
        const invalidProof = ["0x0000000000000000000000000000000000000000000000000000000000000000"]; 

        await expect(airdrop.connect(addr1).claim(invalidProof, amount )).to.be.revertedWith("Invalid Merkle proof");
    });
});
