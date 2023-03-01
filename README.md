# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

Deployment script command:

```
yarn run ts-node --files ./scripts/Deployment.ts <arg1> <arg2> <arg3> ...
```

GiveRightToVote script command:

```
yarn run ts-node --files ./scripts/GiveRightToVote.ts <deployed ballot address> <new voter>
```

CastVote script command:

```
yarn run ts-node --files ./scripts/CastVote.ts <deployed ballot address> <index of proposal(number)>
```

DelegateVote script command:

```
yarn run ts-node --files ./scripts/DelegateVote.ts <deployed ballot address> <address of delegation>
```

Winningresults script command:

```
yarn run ts-node --files ./scripts/WinningResults.ts <deployed ballot address>
```
