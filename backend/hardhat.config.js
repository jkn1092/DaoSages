require("@nomicfoundation/hardhat-toolbox");
require("solidity-coverage");
require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    }
  },
  solidity: "0.8.18",
};