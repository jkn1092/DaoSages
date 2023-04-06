const hre = require("hardhat");

async function main() {
    const DaoSage = await hre.ethers.getContractFactory("DAOSage");
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const DAOSageGovernance = await hre.ethers.getContractFactory("DAOSageGovernance");
    const governanceAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

    const signer = await hre.ethers.provider.getSigner();
    const contract = await DaoSage.attach(contractAddress);
    const governance = await DAOSageGovernance.attach(governanceAddress);

    const value = await contract.getAudit(0);
    console.log("Stored value:", value);

    await contract.connect(signer).auditProject(0, 4);

    const newValue = await contract.getAudit(0);
    console.log("Stored value:", newValue);

    await governance.connect(signer).submitProposal("Script creation", "This proposal has been added through a script.");
    const proposal = await governance.getProposal(0);
    console.log(proposal);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});