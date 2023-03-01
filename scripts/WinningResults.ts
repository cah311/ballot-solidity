import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { Ballot__factory } from "../typechain-types";

dotenv.config();

async function main() {
  const provider = new ethers.providers.AlchemyProvider(
    "goerli",
    process.env.ALCHEMY_API_KEY
  );

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey || privateKey.length <= 0)
    throw new Error("Missing environment: PRIVATE_KEY");

  const wallet = new ethers.Wallet(privateKey);
  const signer = wallet.connect(provider);

  const args = process.argv;
  const params = args.slice(2);
  if (params.length <= 0) throw new Error("Missing argument: contract address");

  const ballotAddress = params[0];

  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = await ballotContractFactory.attach(ballotAddress);

  const ballotEntries = await ballotContract.proposals.name;
  const results = await ballotContract.winningProposal();
  const winnerName = await ballotContract.winnerName();

  console.log({ ballotEntries });
  console.log(results);
  console.log(winnerName);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
