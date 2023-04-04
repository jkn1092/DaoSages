const { expect } = require("chai");
const { ethers } = require("hardhat");
const {address} = require("hardhat/internal/core/config/config-validation");

describe("DAOSage Contract", function () {
    let dao, admin, wise, brainer, finder, visitor

    // Deploy the contract before each test
    beforeEach(async function () {
        [admin, wise, brainer, finder, visitor] = await ethers.getSigners();
        const DAOSage = await ethers.getContractFactory("DAOSage");
        dao = await DAOSage.deploy();
        await dao.deployed();

        dao.mintWisemen(wise.address);
        dao.mintBrainer(brainer.address);
        dao.mintFinder(finder.address);
    });

    // Define a test case for the submitProject function
    describe("submitProject", function () {
        it("should add a new project", async function () {
            const projectName = "My Project";
            await dao.connect(finder).submitProject(projectName);
            const project = await dao.projects(0);
            expect(project.name).to.equal(projectName);
            expect(project.owner).to.equal(finder.address);
        });

        it("should emit event ProjectSubmitted", async function () {
            const projectName = "My Project";
            const tx = await dao.connect(wise).submitProject(projectName);
            await tx.wait();

            const events = await dao.queryFilter("ProjectSubmitted", tx.blockHash);
            expect(events.length).to.equal(1);
            expect(events[0].args.owner).to.equal(wise.address);
            expect(events[0].args.id).to.equal(0);
            expect(events[0].args.name).to.equal(projectName);
        });

        it("should revert if not participantt", async function () {
            await expect(dao.connect(visitor).submitProject("Test")).to.be.revertedWith("Not finder or wisemen");
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
            await dao.auditProject(0, 8);
            const project = await dao.projects(0);
            expect(project.totalScore).to.equal(8);
            expect(project.nbScore).to.equal(1);
        });

        it("should return an audit", async function () {
            const projectName = "My Project";
            await dao.submitProject(projectName);
            await dao.auditProject(0, 8);
            const audit = await dao.getAudit(0);
            expect(audit).to.equal(8);
        });

        it("should return 0 as project audit", async function () {
            const projectName = "My Project";
            await dao.submitProject(projectName);
            const audit = await dao.getAudit(0);
            expect(audit).to.equal(0);
        });

        it("should emit event AuditSubmitted", async function () {
            const projectName = "My Project";
            await dao.submitProject(projectName);
            const tx = await dao.auditProject(0, 8);
            await tx.wait();

            const events = await dao.queryFilter("AuditSubmitted", tx.blockHash);
            expect(events.length).to.equal(1);
            expect(events[0].args.voter).to.equal(admin.address);
            expect(events[0].args.id).to.equal(0);
            expect(events[0].args.grade).to.equal(8);
        });

        it("should revert if not brainer or wise", async function () {
            const projectName = "My Project";
            await dao.submitProject(projectName);
            await expect(dao.connect(finder).auditProject(0, 8)).to.be.revertedWith("Not brainer or wisemen");
        });

        it("should revert with invalid project index", async function () {
            await expect(dao.auditProject(1, 8)).to.be.revertedWith("Invalid project index.");
        });

        it("should revert with invalid grade", async function () {
            const projectName = "My Project";
            await dao.submitProject(projectName);
            await expect(dao.auditProject(0, 12)).to.be.revertedWith("Grade must be between 1 and 10.");
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
            expect(proposal.validated).to.equal(false);
        });

        it("should emit event ProjectSubmitted", async function () {
            const proposalName = "Proposal A";
            const proposalDesc = "Desc A";
            const tx = await dao.submitProposal(proposalName, proposalDesc);
            await tx.wait();

            const events = await dao.queryFilter("ProposalSubmitted", tx.blockHash);
            expect(events.length).to.equal(1);
            expect(events[0].args.id).to.equal(0);
        });

        it("should return proposal from getProposal", async function () {
            const proposalName = "Proposal A";
            const proposalDesc = "Desc A";
            await dao.submitProposal(proposalName, proposalDesc);

            const proposal = await dao.getProposal(0);
            expect(proposal.name).to.equal(proposalName);
            expect(proposal.description).to.equal(proposalDesc);
            expect(proposal.validated).to.equal(false);
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

        it("should emit event VoteSubmitted with true", async function () {
            const proposalName = "Proposal A";
            const proposalDesc = "Desc A";
            await dao.submitProposal(proposalName, proposalDesc);
            const tx = await dao.submitVote(0);
            await tx.wait();

            const events = await dao.queryFilter("VoteSubmitted", tx.blockHash);
            expect(events.length).to.equal(1);
            expect(events[0].args.voter).to.equal(admin.address);
            expect(events[0].args.id).to.equal(0);
            expect(events[0].args.voted).to.equal(true);
        });

        it("should not emit event ProposalValidated", async function () {
            const proposalName = "Proposal A";
            const proposalDesc = "Desc A";
            await dao.submitProposal(proposalName, proposalDesc);
            const tx = await dao.submitVote(0);
            await tx.wait();

            const events = await dao.queryFilter("ProposalValidated", tx.blockHash);
            expect(events.length).to.equal(0);
        });

        it("should emit event ProposalValidated", async function () {
            const proposalName = "Proposal A";
            const proposalDesc = "Desc A";
            await dao.submitProposal(proposalName, proposalDesc);
            await dao.connect(finder).submitVote(0);
            await dao.connect(brainer).submitVote(0);
            const tx = await dao.submitVote(0);
            await tx.wait();

            const events = await dao.queryFilter("ProposalValidated", tx.blockHash);
            expect(events.length).to.equal(1);
            expect(events[0].args.id).to.equal(0);
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

        it("should emit event VoteSubmitted with false", async function () {
            const proposalName = "Proposal A";
            const proposalDesc = "Desc A";
            await dao.submitProposal(proposalName, proposalDesc);
            await dao.submitVote(0);
            const tx = await dao.withdrawVote(0);
            await tx.wait();

            const events = await dao.queryFilter("VoteSubmitted", tx.blockHash);
            expect(events.length).to.equal(1);
            expect(events[0].args.voter).to.equal(admin.address);
            expect(events[0].args.id).to.equal(0);
            expect(events[0].args.voted).to.equal(false);
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

    // Define a test case for the minting
    describe("mint", function () {
        it("should find a finder nft in visitor", async function () {
            await dao.connect(visitor).mintFinder(visitor.address);
            const result = await dao.connect(visitor).getRoles();
            expect(result.isFinder).to.equal(true);
            expect(result.isBrainer).to.equal(false);
            expect(result.isWise).to.equal(false);
        });

        it("should return finder tokenURI", async function () {
            await dao.connect(visitor).mintFinder(visitor.address);
            const result = await dao.connect(visitor).tokenFinderURI();
            expect(result).to.be.not.undefined;
        });

        it("should find a brainer nft in visitor", async function () {
            await dao.connect(visitor).mintBrainer(visitor.address);
            const result = await dao.connect(visitor).getRoles();
            expect(result.isFinder).to.equal(false);
            expect(result.isBrainer).to.equal(true);
            expect(result.isWise).to.equal(false);
        });

        it("should return brainer tokenURI", async function () {
            await dao.connect(visitor).mintBrainer(visitor.address);
            const result = await dao.connect(visitor).tokenBrainerURI();
            expect(result).to.be.not.undefined;
        });

        it("should find a wisemen nft in visitor", async function () {
            await dao.connect(admin).mintWisemen(visitor.address);
            const result = await dao.connect(visitor).getRoles();
            expect(result.isFinder).to.equal(false);
            expect(result.isBrainer).to.equal(false);
            expect(result.isWise).to.equal(true);
        });

        it("should return wisemen tokenURI", async function () {
            await dao.connect(admin).mintWisemen(visitor.address);
            const result = await dao.connect(visitor).tokenWiseURI();
            expect(result).to.be.not.undefined;
        });
    })
});