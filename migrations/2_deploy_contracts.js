var BenchMark = artifacts.require("./BenchMark.sol");
const Web3 = require('web3');

module.exports = function(deployer) {
  deployer.deploy(BenchMark, Web3.utils.fromUtf8("test"), 1, 50, Web3.utils.fromUtf8("Mio. EUR"));
};
