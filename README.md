# DAO des Sages

A DAO for auditing blockchain project with a transparent and automated process that verifies the accuracy and integrity of the projects transactions and data.

## Deployment
https://dao-sages.vercel.app/

DAOSage Contract : https://mumbai.polygonscan.com/address/0xf6446e926Fa3aa2282eC9c8D72C06D459FBF80F8
DAOSageGovernance Contract : https://mumbai.polygonscan.com/address/0xca561fC618ad204734aD6B911DE1AE80c4a6D048

## Demo
https://www.loom.com/share/dd42cfcc20d64a10b34e3b549e388a98

## How to run locally

#### Run Hardhat Node :
```shell
npx hardhat node
```

#### Run API server :
```shell
cd api
npm install
npm start
```

#### Deploy smart contracts :
```shell
cd front
npm install
npx hardhat run scripts/deploy.js --network localhost
```

#### Run client :
```shell
cd client
npm install
npx next start
```

#### Run unit testing with coverage :
```shell
npx hardhat coverage
```


## Unit Test coverage with solidity-coverage
```shell
  74 passing (6s)

------------------------|----------|----------|----------|----------|----------------|
File                    |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
------------------------|----------|----------|----------|----------|----------------|
 contracts/             |      100 |    96.81 |      100 |      100 |                |
  DAOSage.sol           |      100 |    95.71 |      100 |      100 |                |
  DAOSageGovernance.sol |      100 |      100 |      100 |      100 |                |
------------------------|----------|----------|----------|----------|----------------|
All files               |      100 |    96.81 |      100 |      100 |                |
------------------------|----------|----------|----------|----------|----------------|

```

### Unit testings

```shell

  DAOSage Contract
    mint
      mint finder as visitor
        ✔ should find a finder nft in visitor
        ✔ should return tokenFinderURI
        ✔ should update contract balance
      mint finder as zero address
        ✔ should revert with address incorrect
      mint finder as finder
        ✔ should revert with already minted finder
      mint finder as visitor with no eth
        ✔ should revert with insufficient eth
      get tokenFinder as visitor
        ✔ should revert with finder not mint
      mint brainer as visitor
        ✔ should find a brainer nft in visitor
        ✔ should return brainer tokenURI
        ✔ should update contract balance with brainer mint
      mint brainer as zero address
        ✔ should revert with address incorrect
      mint brainer as brainer
        ✔ should revert with already minted brainer
      mint finder as visitor with no eth
        ✔ should revert with insufficient eth
      get tokenBrainer as visitor
        ✔ should revert with brainer not mint
      mint wisemen as visitor
        ✔ should find a wisemen nft in visitor
        ✔ should return wisemen tokenURI
      mint wisemen as zero address
        ✔ should revert with address incorrect
      mint wisemen as wisemen
        ✔ should revert with already minted wisemen
      get tokenWise as visitor
        ✔ should revert with wisemen not mint
    submitProject
      submit new project as finder
        ✔ should create project in array
        ✔ should emit event ProjectSubmitted
      submit new project as visitor
        ✔ should revert if not finder
      submit new project as brainer
        ✔ should revert if brainer only
      submit new project with empty name
        ✔ should revert if project name is empty
    audited
      audit created project
        ✔ should update the total score
        ✔ should return an audit
        ✔ should emit event AuditSubmitted
      audit project more than once
        ✔ should remove previous grade and add new grade
        ✔ should emit two events AuditSubmitted
      audit project as finder
        ✔ should revert if not brainer or wise
      audit non existing project
        ✔ should revert with invalid project index
      audit project with grade above 10
        ✔ should revert with invalid grade
      get audit from not audited project
        ✔ should return 0 as project audit
    getVoteWeight
      get weight for wisemen
        ✔ should return uint 4
      get weight for brainer
        ✔ should return uint 2
      get weight for finder
        ✔ should return uint 1
      get weight for zero address
        ✔ should revert with address incorrect
      get weight for visitor
        ✔ should revert with not participant
    isParticipant
      get isParticipant for wisemen
        ✔ should return uint true
      get isParticipant for brainer
        ✔ should return uint true
      get isParticipant for finder
        ✔ should return uint true
      get isParticipant for visitor
        ✔ should return uint false
      get weight for zero address
        ✔ should revert with address incorrect
    withdrawFunds
      withdraw as owner
        ✔ should withdraw and balance equal 0
      withdraw as visitor
        ✔ should revert with address incorrect
      withdraw as finder
        ✔ should revert with address incorrect
      withdraw as brainer
        ✔ should revert with address incorrect
      withdraw as wisemen
        ✔ should revert with address incorrect

  DAOSage Contract
    submitProposal
      submit new proposal
        ✔ should add proposal in proposals array
        ✔ should emit event ProjectSubmitted
      submit new proposal with empty name
        ✔ should revert if project name is empty
      submit new proposal with empty description
        ✔ should revert if project description is empty
      submit new proposal as visitor
        ✔ should revert with not participant
      get proposal submitted
        ✔ should return proposal
      get non existing proposal
        ✔ should revert with not found
    voted
      submit vote existing proposal
        ✔ should increase voteCount to 4
        ✔ should emit event VoteSubmitted with true
        ✔ should not emit event ProposalValidated
      submit vote existing proposal as finder
        ✔ should increase voteCount to 1
      submit vote existing proposal as brainer
        ✔ should increase voteCount to 1
      submit vote existing proposal as wisemen
        ✔ should increase voteCount to 1
      submit enough votes to validate proposal
        ✔ should emit event ProposalValidated
      submit vote on non existing proposal
        ✔ should revert with proposal not found
      submit vote true two times with same address
        ✔ should revert with already submitted
      submit vote as visitor
        ✔ should revert with not participant
      submit vote on validated proposal
        ✔ should emit event ProposalValidated
    withdraw
      withdraw submitted vote
        ✔ should decrease voteCount to 0
        ✔ should emit event VoteSubmitted with false
      withdraw submitted vote as finder
        ✔ should decrease voteCount to 0 as finder
      withdraw submitted vote as brainer
        ✔ should decrease voteCount to 0 as brainer
      withdraw submitted vote as wisemen
        ✔ should decrease voteCount to 0 as wisemen
      withdraw vote on non existing proposal
        ✔ should revert with proposal not found
      withdrawn vote as visitor
        ✔ should revert with not participant
      withdraw non submitted vote
        ✔ should revert with already withdrawn


```
