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
  const addresses = args.slice(2);
  if (addresses.length <= 0) throw new Error("Missing argument: addresses");

  const ballotAddress = addresses[0];
  const voter = addresses[1];
  console.log(addresses);
  console.log("Ballot Address: " + ballotAddress);
  console.log("Voter:" + voter);
  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = await ballotContractFactory.attach(ballotAddress);

  await ballotContract.giveRightToVote(voter);
  console.log(`Voting rights have been granted to ${voter} `);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
