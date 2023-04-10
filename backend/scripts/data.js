const hre = require("hardhat");

async function main() {
    const DaoSage = await hre.ethers.getContractFactory("DAOSage");
    const contractAddress = "0xf6446e926Fa3aa2282eC9c8D72C06D459FBF80F8";

    const DAOSageGovernance = await hre.ethers.getContractFactory("DAOSageGovernance");
    const governanceAddress = "0xca561fC618ad204734aD6B911DE1AE80c4a6D048";

    const address = hre.ethers.utils.getAddress("0x0f49abe5eed491d14fDD1f5842bAce069aB3A2b2");

    const signer = await hre.ethers.provider.getSigner();
    const contract = await DaoSage.attach(contractAddress);
    const governance = await DAOSageGovernance.attach(governanceAddress);

    //await contract.connect(signer).mintWisemen(address);

    const value = await contract.getAudit(0);
    console.log("Stored value:", value);

    await contract.connect(signer).auditProject(0, 4);

    const newValue = await contract.getAudit(0);
    console.log("Stored value:", newValue);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});