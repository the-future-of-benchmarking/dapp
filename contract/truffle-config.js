module.exports = {
    compilers: {
        solc: {
          version: "0.8.4", 
        }
      },
      networks: {
        development: {
            host: "192.168.178.21",
            port: 7545,
            network_id: 5777,
            gas: 4698712,
            gasPrice: 25000000000,
            networkCheckTimeout: 5000,
        }
      },
      solc: {
          optimizer: {
              enabled: true,
              runs: 200
          }
      }
      
  };