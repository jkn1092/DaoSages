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

    // Define a test case for the auditing function
    describe("audited", function () {
        it("should add a new audit", async function () {
            const projectName = "My Project";
            await dao.submitProject(projectName);
            await dao.auditProject(1, 8);
            const projectVote = await dao.projectsAudited(1, admin.address);
            expect(projectVote).to.equal(8);
        });

        it("should emit event AuditSubmitted", async function () {
            const projectName = "My Project";
            await dao.submitProject(projectName);
            const tx = await dao.auditProject(1, 8);
            await tx.wait();

            const events = await dao.queryFilter("AuditSubmitted", tx.blockHash);
            expect(events.length).to.equal(1);
            expect(events[0].args.voter).to.equal(admin.address);
            expect(events[0].args.projectId).to.equal(1);
            expect(events[0].args.grade).to.equal(8);
        });

        it("should revert with invalid project index", async function () {
            await expect(dao.auditProject(1, 8)).to.be.revertedWith("Invalid project index.");
        });

        it("should revert with invalid grade", async function () {
            const projectName = "My Project";
            await dao.submitProject(projectName);
            await expect(dao.auditProject(1, 12)).to.be.revertedWith("Grade must be between 1 and 10.");
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
            expect(events[0].args.projectId).to.equal(1);
        });

        it("should revert with invalid project index", async function () {
            await expect(dao.validateProject(1)).to.be.revertedWith("Invalid project index.");
        });

        it("should revert with proposal already validated", async function () {
            const projectName = "My Project";
            await dao.submitProject(projectName);
            await dao.validateProject(1);
            await expect(dao.validateProject(1)).to.be.revertedWith("Project has already been validated.");
        });

        it("should revert with not wise user", async function () {
            const projectName = "My Project";
            await dao.submitProject(projectName);
            await expect(dao.connect(brainer).validateProject(1)).to.be.revertedWith("Validation done only by wise.");
        });
    });

    // Define a test case for the submitProposal function
    describe("submitProposal", function () {
        it("should add a new proposal", async function () {
            const proposalName = "Proposal A";
            const proposalDesc = "Desc A";
            await dao.submitProposal(proposalName, proposalDesc);
            const proposal = await dao.proposals(0);
            expect(proposal.id).to.equal(0);
            expect(proposal.name).to.equal(proposalName);
            expect(proposal.description).to.equal(proposalDesc);
            expect(proposal.owner).to.equal(admin.address);
            expect(proposal.validated).to.equal(false);
        });


        it("should emit event ProjectSubmitted", async function () {
            const proposalName = "Proposal A";
            const proposalDesc = "Desc A";
            const tx = await dao.submitProposal(proposalName, proposalDesc);
            await tx.wait();

            const events = await dao.queryFilter("ProposalSubmitted", tx.blockHash);
            expect(events.length).to.equal(1);
            expect(events[0].args.owner).to.equal(admin.address);
            expect(events[0].args.proposalId).to.equal(0);
            expect(events[0].args.proposalName).to.equal(proposalName);
        });

        it("should revert if project name is empty", async function () {
            await expect(dao.submitProposal("","Test")).to.be.revertedWith("Proposal name and description must not be empty.");
        });

        it("should revert if project description is empty", async function () {
            await expect(dao.submitProposal("Test","")).to.be.revertedWith("Proposal name and description must not be empty.");
        });
    });

    // Define a test case for the voting function
    describe("voted", function () {
        it("should set voted to true", async function () {
            const proposalName = "Proposal A";
            const proposalDesc = "Desc A";
            await dao.submitProposal(proposalName, proposalDesc);
            await dao.submitVote(0);
            const voted = await dao.proposalsVoted(0, admin.address);
            expect(voted).to.equal(true);
        });

        it("should increase voteCount to 1", async function () {
            const proposalName = "Proposal A";
            const proposalDesc = "Desc A";
            await dao.submitProposal(proposalName, proposalDesc);
            await dao.submitVote(0);
            const proposal = await dao.proposals(0);
            expect(proposal.voteCount).to.equal(1);
        });

        it("should emit event VoteSubmitted", async function () {
            const proposalName = "Proposal A";
            const proposalDesc = "Desc A";
            await dao.submitProposal(proposalName, proposalDesc);
            const tx = await dao.submitVote(0);
            await tx.wait();

            const events = await dao.queryFilter("VoteSubmitted", tx.blockHash);
            expect(events.length).to.equal(1);
            expect(events[0].args.voter).to.equal(admin.address);
            expect(events[0].args.proposalId).to.equal(0);
        });

        it("should revert with proposal not found", async function () {
            await expect(dao.submitVote(2)).to.be.revertedWith("Proposal not found");
        });

        it("should revert with already submitted", async function () {
            const proposalName = "Proposal A";
            const proposalDesc = "Desc A";
            await dao.submitProposal(proposalName, proposalDesc);
            await dao.submitVote(0);
            await expect(dao.submitVote(0)).to.be.revertedWith("Already submitted");
        });
    });

    // Define a test case for the withdrawn function
    describe("withdrawn", function () {
        it("should set voted to false", async function () {
            const proposalName = "Proposal A";
            const proposalDesc = "Desc A";
            await dao.submitProposal(proposalName, proposalDesc);
            await dao.submitVote(0);
            await dao.withdrawVote(0);
            const voted = await dao.proposalsVoted(0, admin.address);
            expect(voted).to.equal(false);
        });

        it("should decrease voteCount to 0", async function () {
            const proposalName = "Proposal A";
            const proposalDesc = "Desc A";
            await dao.submitProposal(proposalName, proposalDesc);
            await dao.submitVote(0);
            await dao.withdrawVote(0);
            const proposal = await dao.proposals(0);
            expect(proposal.voteCount).to.equal(0);
        });

        it("should emit event VoteWithdraw", async function () {
            const proposalName = "Proposal A";
            const proposalDesc = "Desc A";
            await dao.submitProposal(proposalName, proposalDesc);
            await dao.submitVote(0);
            const tx = await dao.withdrawVote(0);
            await tx.wait();

            const events = await dao.queryFilter("VoteWithdraw", tx.blockHash);
            expect(events.length).to.equal(1);
            expect(events[0].args.voter).to.equal(admin.address);
            expect(events[0].args.proposalId).to.equal(0);
        });

        it("should revert with proposal not found", async function () {
            await expect(dao.withdrawVote(2)).to.be.revertedWith("Proposal not found");
        });

        it("should revert with already submitted", async function () {
            const proposalName = "Proposal A";
            const proposalDesc = "Desc A";
            await dao.submitProposal(proposalName, proposalDesc);
            await expect(dao.withdrawVote(0)).to.be.revertedWith("Already withdrawn");
        });
    });

    // Define a test case for the validateProposal function
    describe("validateProposal", function () {
        it("should validate a proposal", async function () {
            const proposalName = "Proposal A";
            const proposalDesc = "Desc A";
            await dao.submitProposal(proposalName, proposalDesc);
            await dao.validateProposal(0);
            const proposal = await dao.proposals(0);
            expect(proposal.validated).to.equal(true);
        });

        it("should emit event ProposalValidated", async function () {
            const proposalName = "Proposal A";
            const proposalDesc = "Desc A";
            await dao.submitProposal(proposalName, proposalDesc);
            const tx = await dao.validateProposal(0);
            await tx.wait();

            const events = await dao.queryFilter("ProposalValidated", tx.blockHash);
            expect(events.length).to.equal(1);
            expect(events[0].args.proposalId).to.equal(0);
        });

        it("should revert with invalid project index", async function () {
            await expect(dao.validateProposal(1)).to.be.revertedWith("Proposal not found");
        });

        it("should revert with proposal already validated", async function () {
            const proposalName = "Proposal A";
            const proposalDesc = "Desc A";
            await dao.submitProposal(proposalName, proposalDesc);
            await dao.validateProposal(0);
            await expect(dao.validateProposal(0)).to.be.revertedWith("Proposal has already been validated.");
        });

        it("should revert with not wise user", async function () {
            const proposalName = "Proposal A";
            const proposalDesc = "Desc A";
            await dao.submitProposal(proposalName, proposalDesc);
            await expect(dao.connect(brainer).validateProposal(0)).to.be.revertedWith("Validation done only by wise.");
        });
    });
});