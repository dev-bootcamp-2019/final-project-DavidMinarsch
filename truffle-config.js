const path = require("path");
const HDWallet = require('truffle-hdwallet-provider');
const fs = require('fs');

const INFURA_KEY = fs.readFileSync(".infura_key").toString().trim();
const MNEMONIC = fs.readFileSync(".secret").toString().trim();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    rinkeby: {
      provider: () => new HDWallet(MNEMONIC, `https://rinkeby.infura.io/v3/${INFURA_KEY}`),
      network_id: 4,
      gas: 5500000 // Gas limit used for deploys
    }
  },
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  compilers: {
    solc: {
      version: "0.5.2",    // Fetch exact version from solc-bin (default: truffle's version)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200
        },
      },
      evmVersion: "byzantium"
    }
  }
};
