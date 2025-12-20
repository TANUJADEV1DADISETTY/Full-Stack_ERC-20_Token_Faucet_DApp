const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // 1. Deploy Token
  const Token = await hre.ethers.getContractFactory("FaucetToken");
  const token = await Token.deploy();
  await token.waitForDeployment();
  console.log("Token deployed to:", await token.getAddress());

  // 2. Deploy Faucet
  const Faucet = await hre.ethers.getContractFactory("TokenFaucet");
  const faucet = await Faucet.deploy(await token.getAddress());
  await faucet.waitForDeployment();
  console.log("Faucet deployed to:", await faucet.getAddress());

  // 3. Set faucet in token
  const tx = await token.setFaucet(await faucet.getAddress());
  await tx.wait();
  console.log("Faucet set as minter in token");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
