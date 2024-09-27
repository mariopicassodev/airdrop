// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Airdrop is Ownable {
    bytes32 private merkleRoot;
    mapping(address => uint256) public withdrawnAmount;
    IERC20 public token;

    // Note: Ownable to then pause and resume the contract
    constructor(bytes32 _merkleRoot, address _tokenAddress) Ownable(msg.sender) {
        merkleRoot = _merkleRoot;
        token = IERC20(_tokenAddress);
    }

    function claim(bytes32[] calldata merkleProof, uint256 amount) public {

        // Verify the Merkle proof
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(msg.sender, amount))));
        require(verify(merkleProof, merkleRoot, leaf), "Invalid Merkle proof");

        // Calculate remaining amount to claim
        uint256 remainingAmount = amount - withdrawnAmount[msg.sender];
        require(remainingAmount > 0, "No more tokens to claim");

        // Update the withdrawal record
        withdrawnAmount[msg.sender] += remainingAmount;

        // Transfer the ERC-20 tokens
        require(token.transfer(msg.sender, remainingAmount), "Token transfer failed");
    }

    // Function to allow owner to update the Merkle root
    function updateMerkleRoot(bytes32 newRoot) external onlyOwner {
        merkleRoot = newRoot;
    }

    // Fallback function to receive funds
    receive() external payable {}

    // Check proof against merkle
    function verify(bytes32[] memory proof, bytes32 root, bytes32 leaf) internal pure returns (bool) {
        return processProof(proof, leaf) == root;
    }

    // Process the proof
    function processProof(bytes32[] memory proof, bytes32 leaf) internal pure returns (bytes32) {
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            computedHash = _hashPair(computedHash, proof[i]);
        }
        return computedHash;
    }

    // Hash a pair of nodes in sorted order
    function _hashPair(bytes32 a, bytes32 b) private pure returns (bytes32) {
        return a < b ? keccak256(abi.encode(a, b)) : keccak256(abi.encode(b, a));
    }


}
