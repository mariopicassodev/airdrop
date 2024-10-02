// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Airdrop is Ownable {
    bytes32 private merkleRoot;
    bool private paused;
    mapping(address => uint256) public withdrawnAmount;
    IERC20 public token;

    constructor(bytes32 _merkleRoot, address _tokenAddress) Ownable(msg.sender) {
        merkleRoot = _merkleRoot;
        token = IERC20(_tokenAddress);
        paused = false;
    }

    function claim(bytes32[] calldata merkleProof, uint256 totalAmount, uint256 partialAmount) whenNotPaused public {

        // Verify that partialAmount is less than totalAmount
        require(partialAmount <= totalAmount, "Partial amount is greater than total amount");

        // Verify the Merkle proof
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(msg.sender, totalAmount))));
        require(verify(merkleProof, merkleRoot, leaf), "Invalid Merkle proof");

        // Now the total amount and the addr are verified.
        // Calculate remaining amount to claim
        uint256 remainingAmount = totalAmount - withdrawnAmount[msg.sender];
        require(partialAmount <= remainingAmount, "Partial amount is greater than remaining amount");
        require(remainingAmount > 0, "No more tokens to claim");

        // Update the withdrawal record
        withdrawnAmount[msg.sender] += partialAmount;

        // Transfer the ERC-20 tokens
        require(token.transfer(msg.sender, partialAmount), "Token transfer failed");
    }

    function getClaimedAmount(address _address) public view returns (uint256) {
        return withdrawnAmount[_address];
    }

    function pause() external onlyOwner {
        paused = true;
    }

    function resume() external onlyOwner {
        paused = false;
    }

    function updateMerkleRoot(bytes32 newRoot) external onlyOwner {
        merkleRoot = newRoot;
    }

    receive() external payable {}


    // INTERNAL FUNCTIONS

    function verify(bytes32[] memory proof, bytes32 root, bytes32 leaf) private pure returns (bool) {
        return processProof(proof, leaf) == root;
    }

    function processProof(bytes32[] memory proof, bytes32 leaf) private pure returns (bytes32) {
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            computedHash = _hashPair(computedHash, proof[i]);
        }
        return computedHash;
    }

    function _hashPair(bytes32 a, bytes32 b) private pure returns (bytes32) {
        return a < b ? keccak256(abi.encode(a, b)) : keccak256(abi.encode(b, a));
    }

    // MODIFIERS

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    modifier whenPaused() {
        require(paused, "Contract is not paused");
        _;
    }
}
