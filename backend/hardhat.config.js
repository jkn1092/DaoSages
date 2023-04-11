require("@nomicfoundation/hardhat-toolbox");
require("solidity-coverage");
require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_ID}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    }
  },
  solidity: "0.8.18",
};