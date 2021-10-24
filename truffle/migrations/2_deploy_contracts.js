const landRecords = artifacts.require("landRecords");

module.exports = async function (deployer, network, accounts) {
  // deployment steps
  await deployer.deploy(landRecords);
};