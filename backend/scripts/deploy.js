// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const signer = await hre.ethers.provider.getSigner();
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

  await daoSage.connect(signer).submitProject("Script deployment project");
  const project = await daoSage.projects(0);
  console.log(project);

  await daoGovernance.connect(signer).submitProposal("Script deployment proposal",
      "This proposal has been added through the script during deployment.");
  const proposal = await daoGovernance.getProposal(0);
  console.log(proposal);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
