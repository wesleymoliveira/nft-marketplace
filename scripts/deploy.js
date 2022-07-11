
const hre = require('hardhat');

async function main() {
  // We get the contract to deploy
  const NFTMarketplace = await hre.ethers.getContractFactory('NFTMarketplace');

  const nftMarketplace = await NFTMarketplace.deploy();

  await nftMarketplace.deployed();

  console.log('Contract deployed to:', nftMarketplace.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });