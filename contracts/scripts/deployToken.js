async function deployER20Token () {
  // Get the contract factory
  const Token = await ethers.getContractFactory('MyToken')

  // Specify the initial supply (e.g., 1 million tokens)
  const initialBalance = ethers.utils.parseUnits('1000', 18) // 1000 tokens with 18 decimals

  // Deploy the contract
  const token = await Token.deploy(initialSupply)

  // Wait for the deployment to finish
  await token.deployed()

  console.log('Token deployed to:', token.address)
}

// Boilerplate to run the script
deployER20Token().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
