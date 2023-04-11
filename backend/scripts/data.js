const hre = require("hardhat");

async function main() {
    const DaoSage = await hre.ethers.getContractFactory("DAOSage");
    const contractAddress = "0xC73873193556c965F19dae4eD1514BB6b62e2ac2";

    const DAOSageGovernance = await hre.ethers.getContractFactory("DAOSageGovernance");
    const governanceAddress = "0x8faB79ef2Eda9283995c03B26503524ace2814D2";

    const address = hre.ethers.utils.getAddress("0x0f49abe5eed491d14fDD1f5842bAce069aB3A2b2");

    const signer = await hre.ethers.provider.getSigner();
    const contract = await DaoSage.attach(contractAddress);
    const governance = await DAOSageGovernance.attach(governanceAddress);

    //await contract.connect(signer).mintWisemen(address);

    const value = await contract.getAudit(0);
    console.log("Stored value:", value);

    await contract.connect(signer).auditProject(0, 4);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});