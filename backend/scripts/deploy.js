// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const DaoSage = await hre.ethers.getContractFactory("DAOSage");
  const daoSage = await DaoSage.deploy();
  await daoSage.deployed();

  const DAOSageGovernance = await hre.ethers.getContractFactory("DAOSageGovernance");
  const daoGovernance = await DAOSageGovernance.deploy(daoSage.address);
  await daoGovernance.deployed();

  console.log(
      `Contract deployed to ${daoSage.address}`
  );
  console.log(
      `Contract Governance deployed to ${daoGovernance.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
