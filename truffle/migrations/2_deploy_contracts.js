const landRecords = artifacts.require("landRecords"); // present in build folder (remove ".json")

module.exports = async function (deployer, network, accounts) {
  // deployment steps
  const deployer_address = "0x3dA7a55B94C02FE6557E17B1332431dAE4AE4Eeb"
  await deployer.deploy(landRecords, {from: deployer_address});
};