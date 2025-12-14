const { ethers } = require("ethers");
const fetch = global.fetch || require("node-fetch");

const CONTRACT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const RPC_URL = process.env.RPC_URL || "https://eth.llamarpc.com";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

async function getCreationFromEtherscan(address) {
  if (!ETHERSCAN_API_KEY) return null;

  const url =
    `https://api.etherscan.io/api?module=contract&action=getcontractcreation` +
    `&contractaddresses=${address}&apikey=${ETHERSCAN_API_KEY}`;

  const res = await fetch(url);
  const json = await res.json();

  if (json.status !== "1" || !json.result?.length) return null;

  return {
    creator: json.result[0].contractCreator,
    txHash: json.result[0].txHash,
  };
}

exports.technicalAssessment = async (req, res) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

    const [network, blockNumber, code] = await Promise.all([
      provider.getNetwork(),
      provider.getBlockNumber(),
      provider.getCode(CONTRACT_ADDRESS),
    ]);

    if (!code || code === "0x") {
      return res.status(404).json({
        error: "No contract code found at address",
        address: CONTRACT_ADDRESS,
      });
    }

    let creator = null;
    let deploymentTimestamp = null;

    const creation = await getCreationFromEtherscan(CONTRACT_ADDRESS);

    if (creation?.txHash) {
      creator = creation.creator;
      const receipt = await provider.getTransactionReceipt(creation.txHash);
      if (receipt?.blockNumber) {
        const block = await provider.getBlock(receipt.blockNumber);
        deploymentTimestamp = new Date(block.timestamp * 1000).toISOString();
      }
    }

    return res.json({
      address: CONTRACT_ADDRESS,
      creator,
      deploymentTimestamp,
      chain: {
        name: network.name,
        chainId: network.chainId,
      },
      rpcBlockNumber: blockNumber,
      rpcTimestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("technical_assessment error:", err);
    return res.status(500).json({
      error: err.message || "Blockchain query failed",
    });
  }
};