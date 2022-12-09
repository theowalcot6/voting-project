const BlockchainPoll = artifacts.require("BlockchainPoll");

module.exports = function(deployer) {
  deployer.deploy(BlockchainPoll);
};
