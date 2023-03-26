const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DAOSage Contract", function () {
    let dao;

    // Deploy the contract before each test
    beforeEach(async function () {
        const DAOSage = await ethers.getContractFactory("DAOSage");
        dao = await DAOSage.deploy();
        await dao.deployed();
    });

    // Define a test case for the submitProject function
    describe("submitProject", function () {
        it("should add a new project", async function () {
            const projectName = "My Project";
            await dao.submitProject(projectName);
            const project = await dao.projects(1);
            expect(project.id).to.equal(1);
            expect(project.name).to.equal(projectName);
            expect(project.owner).to.equal(await ethers.provider.getSigner(0).getAddress());
            expect(project.validated).to.equal(false);
            expect(project.score).to.equal(0);
        });
    });
});