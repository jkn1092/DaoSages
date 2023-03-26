const { expect } = require("chai");
const { ethers } = require("hardhat");
const {address} = require("hardhat/internal/core/config/config-validation");

describe("DAOSage Contract", function () {
    let dao, admin, wise, brainer, finder

    // Deploy the contract before each test
    beforeEach(async function () {
        [admin, wise, brainer, finder] = await ethers.getSigners();
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
            expect(project.owner).to.equal(admin.address);
            expect(project.validated).to.equal(false);
            expect(ethers.utils.isAddress(project.escrowWallet)).to.be.true;
        });


        it("should emit event ProjectSubmitted", async function () {
            const projectName = "My Project";
            const tx = await dao.submitProject(projectName);
            await tx.wait();

            const events = await dao.queryFilter("ProjectSubmitted", tx.blockHash);
            expect(events.length).to.equal(1);
            expect(events[0].args.owner).to.equal(admin.address);
            expect(events[0].args.projectId).to.equal(1);
        });

        it("should revert if project name is empty", async function () {
            await expect(dao.submitProject("")).to.be.revertedWith("Project name must not be empty.");
        });
    });

    // Define a test case for the vote function
    describe("vote", function () {
        it("should add a new vote", async function () {
            const projectName = "My Project";
            await dao.submitProject(projectName);
            await dao.vote(1, 8);
            const projectVote = await dao.projectsVotes(1, admin.address);
            expect(projectVote).to.equal(8);
        });

        it("should emit event VoteSubmitted", async function () {
            const projectName = "My Project";
            await dao.submitProject(projectName);
            const tx = await dao.vote(1, 8);
            await tx.wait();

            const events = await dao.queryFilter("VoteSubmitted", tx.blockHash);
            expect(events.length).to.equal(1);
            expect(events[0].args.voter).to.equal(admin.address);
            expect(events[0].args.projectId).to.equal(1);
            expect(events[0].args.grade).to.equal(8);
        });

        it("should revert with invalid project index", async function () {
            await expect(dao.vote(1, 8)).to.be.revertedWith("Invalid project index.");
        });

        it("should revert with invalid grade", async function () {
            const projectName = "My Project";
            await dao.submitProject(projectName);
            await expect(dao.vote(1, 12)).to.be.revertedWith("Grade must be between 1 and 10.");
        });
    });

    // Define a test case for the validateProject function
    describe("validateProject", function () {
        it("should validate a project", async function () {
            const projectName = "My Project";
            await dao.submitProject(projectName);
            await dao.validateProject(1);
            const project = await dao.projects(1);
            expect(project.validated).to.equal(true);
        });

        it("should emit event ProjectValidated", async function () {
            const projectName = "My Project";
            await dao.submitProject(projectName);
            const tx = await dao.validateProject(1);
            await tx.wait();

            const events = await dao.queryFilter("ProjectValidated", tx.blockHash);
            expect(events.length).to.equal(1);
            expect(events[0].args.owner).to.equal(admin.address);
            expect(events[0].args.projectId).to.equal(1);
        });

        it("should revert with invalid project index", async function () {
            await expect(dao.validateProject(1)).to.be.revertedWith("Invalid project index.");
        });

        it("should revert with proposal already validated", async function () {
            const projectName = "My Project";
            await dao.submitProject(projectName);
            await dao.validateProject(1);
            await expect(dao.validateProject(1)).to.be.revertedWith("Proposal has already been executed.");
        });

        it("should revert with not wise user", async function () {
            const projectName = "My Project";
            await dao.submitProject(projectName);
            await expect(dao.connect(brainer).validateProject(1)).to.be.revertedWith("Validation done only by wise.");
        });
    });
});