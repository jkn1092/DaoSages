const hre = require("hardhat");
const axios = require("axios");

async function main() {
  const signer = await hre.ethers.provider.getSigner();
  const DaoSage = await hre.ethers.getContractFactory("DAOSage");
  const daoSage = await DaoSage.deploy();
  await daoSage.deployed();

  const DAOSageGovernance = await hre.ethers.getContractFactory("DAOSageGovernance");
  const daoGovernance = await DAOSageGovernance.deploy(daoSage.address);
  await daoGovernance.deployed();

  console.log(
      `Contract deployed to ${daoSage.address}`
  );
  console.log(
      `Contract Governance deployed to ${daoGovernance.address}`
  );

  await daoSage.connect(signer).submitProject("Alyra");
  const project = await daoSage.projects(0);
  console.log(project);

  await daoGovernance.connect(signer).submitProposal("Script deployment proposal",
      "This proposal has been added through the script during deployment.");
  const proposal = await daoGovernance.getProposal(0);
  console.log(proposal);

  const variables = {
    daoId: '0',
    name: "Alyra",
    token: "ALY",
    codeSource: "github.com/DaoSages",
    socialMedia: "twitter.com/DaoSages",
    email: "contact@DaoSages.com",
    description: "Project submitted during deployment"
  };

  const mutation = `
    mutation submitProject(
      $daoId: String!
      $name: String!
      $token: String!
      $codeSource: String!
      $socialMedia: String!
      $email: String!
      $description: String!
    ) {
      createProject(
        createProjectInput: {
          daoId: $daoId
          name: $name
          token: $token
          codeSource: $codeSource
          socialMedia: $socialMedia
          email: $email
          description: $description
        }
      ) {
        name
      }
    }
  `;

  axios.post('https://daosages.herokuapp.com/graphql', {
    query: mutation,
    variables: variables
  })
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log(error);
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
