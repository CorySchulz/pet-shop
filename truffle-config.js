'use strict'
let HDWalletProvider = require("truffle-hdwallet-provider")
let mnemonic = 'admit curve bacon enroll current escape fossil reopen grid solve oil volume'
// address: 0x4ac53c53c4814d8a33102faf920d55d1c4587b2b
// Pantograph PKey: A6FA2984C9848FFA5CE99D71970EA5022051E493294C73B1C0890FFC6036C406


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
 
  networks: {
    development: {
      provider: () => new HDWalletProvider(
        mnemonic,
        "http://127.0.0.1:8545",
      ),
      host: "127.0.0.1",
      port: "8545",
      network_id: "*", // Match any network id
    },
    tomotestnet: {
      provider: () => new HDWalletProvider(
        mnemonic,
        "https://rpc.testnet.tomochain.com",
        0,
        1,
        true,
        "m/44'/889'/0'/0/",
      ),
      network_id: "89",
      gas: 2000000,
      gasPrice: 10000000000000,
    },
    tomomainnet: {
      provider: () => new HDWalletProvider(
        mnemonic,
        "https://rpc.tomochain1.com",
        0,
        1,
        true,
        "m/44'/889'/0'/0/",
      ),
      network_id: "88",
      gas: 5000000,
      gasPrice: 10000000000000,
    }
  },

  compilers: {
    solc: {
      version: "0.5.0",  // TomoChain highest supported solc version
    }
  }


};
