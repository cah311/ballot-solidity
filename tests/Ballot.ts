import { expect } from "chai";
import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

describe("Ballot", function () {
  let ballotContract: Ballot;

  beforeEach(async function () {
    const ballotContractFactory = await ethers.getContractFactory("Ballot");
    ballotContract = await ballotContractFactory.deploy(
      convertStringArrayToBytes32(PROPOSALS)
    );
    await ballotContract.deployTransaction.wait();
  });
  describe("When the contract is deployed", function () {
    it("Has the provided proposals", async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(
          PROPOSALS[index]
        );
      }
    });

    it("Has zero votes for all proposals", async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(proposal.voteCount).to.eq(0);
      }
    });

    it("Sets the deployer address as chairperson", async function () {
      const signers = await ethers.getSigners();
      const deployerAddress = signers[0].address;
      const chairperson = await ballotContract.chairperson();
      expect(chairperson).to.eq(deployerAddress);
    });

    it("Sets the voting weight for the chairperson as 1", async function () {
      const chairperson = await ballotContract.chairperson();
      const chairpersonVoter = await ballotContract.voters(chairperson);
      expect(chairpersonVoter.weight).to.eq(1);
    });
  });

  describe("When giving the right to vote", function () {
    it("Should not allow someone either than the chairperson to give voting rights", async function () {
      const signers = await ethers.getSigners();

      await expect(
        ballotContract.connect(signers[1]).giveRightToVote(signers[2].address)
      ).to.be.revertedWith("Only chairperson can give right to vote.");
    });

    it("Give's the right to vote", async function () {
      const signers = await ethers.getSigners();
      console.log({ signers });
      await ballotContract
        .connect(signers[0])
        .giveRightToVote(signers[1].address);
      const newVoter = ballotContract.voters(signers[1].address);
      await expect((await newVoter).weight).to.eq(1);
    });
    it("Should reject giving rights to voters who have already voted", async function () {
      const signers = await ethers.getSigners();
      await ballotContract
        .connect(signers[0])
        .giveRightToVote(signers[1].address);
      await ballotContract.connect(signers[1]).vote(1);
      await expect(
        ballotContract.connect(signers[0]).giveRightToVote(signers[1].address)
      ).to.be.revertedWith("The voter already voted.");
    });
  });
});
