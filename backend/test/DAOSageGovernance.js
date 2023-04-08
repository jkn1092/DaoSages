const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DAOSage Contract", function () {
    let dao, daoGovernance, admin, wise, brainer, finder, visitor;

    // Deploy the contract before each test
    beforeEach(async function () {
        [admin, wise, brainer, finder, visitor] = await ethers.getSigners();
        const DAOSage = await ethers.getContractFactory("DAOSage");
        dao = await DAOSage.deploy();
        await dao.deployed();

        const DAOSageGovernance = await ethers.getContractFactory("DAOSageGovernance");
        daoGovernance = await DAOSageGovernance.deploy(dao.address);
        await daoGovernance.deployed();

        dao.mintWisemen(wise.address);
        dao.mintBrainer(brainer.address, {value: ethers.utils.parseEther("0.02")});
        dao.mintFinder(finder.address, {value: ethers.utils.parseEther("0.01")});
    });

    // Define test cases for the submitProposal function
    describe("submitProposal", function () {

        describe("submit new proposal", function () {
            it("should add proposal in proposals array", async function () {
                const proposalName = "Proposal A";
                const proposalDesc = "Desc A";
                await daoGovernance.submitProposal(proposalName, proposalDesc);
                const proposal = await daoGovernance.proposals(0);
                expect(proposal.name).to.equal(proposalName);
                expect(proposal.description).to.equal(proposalDesc);
                expect(proposal.validated).to.equal(false);
            });

            it("should emit event ProjectSubmitted", async function () {
                const proposalName = "Proposal A";
                const proposalDesc = "Desc A";
                const tx = await daoGovernance.submitProposal(proposalName, proposalDesc);
                await tx.wait();

                const events = await daoGovernance.queryFilter("ProposalSubmitted", tx.blockHash);
                expect(events.length).to.equal(1);
                expect(events[0].args.id).to.equal(0);
            });
        })

        describe("submit new proposal with empty name", function () {
            it("should revert if project name is empty", async function () {
                await expect(daoGovernance.submitProposal("","Test")).to.be.revertedWith("Proposal name and description must not be empty.");
            });
        })

        describe("submit new proposal with empty description", function () {
            it("should revert if project description is empty", async function () {
                await expect(daoGovernance.submitProposal("Test","")).to.be.revertedWith("Proposal name and description must not be empty.");
            });
        });

        describe("submit new proposal as visitor", function () {
            it("should revert with not participant", async function () {
                await expect(daoGovernance.connect(visitor).submitProposal("Test","test")).to.be.revertedWith("Not participant");
            });
        });

        describe("get proposal submitted", function () {
            it("should return proposal", async function () {
                const proposalName = "Proposal A";
                const proposalDesc = "Desc A";
                await daoGovernance.submitProposal(proposalName, proposalDesc);

                const proposal = await daoGovernance.getProposal(0);
                expect(proposal.name).to.equal(proposalName);
                expect(proposal.description).to.equal(proposalDesc);
                expect(proposal.validated).to.equal(false);
            });
        });

        describe("get non existing proposal", function () {
            it("should revert with not found", async function () {
                await expect(daoGovernance.getProposal(0)).to.be.revertedWith("Proposal not found");
            });
        });

    });

    // Define test cases for the voting function
    describe("voted", function () {
        describe("submit vote existing proposal", function () {
            it("should increase voteCount to 4", async function () {
                const proposalName = "Proposal A";
                const proposalDesc = "Desc A";
                await daoGovernance.submitProposal(proposalName, proposalDesc);
                await daoGovernance.submitVote(0);
                const proposal = await daoGovernance.proposals(0);
                expect(proposal.voteCount).to.equal(4);
            });

            it("should emit event VoteSubmitted with true", async function () {
                const proposalName = "Proposal A";
                const proposalDesc = "Desc A";
                await daoGovernance.submitProposal(proposalName, proposalDesc);
                const tx = await daoGovernance.submitVote(0);
                await tx.wait();

                const events = await daoGovernance.queryFilter("VoteSubmitted", tx.blockHash);
                expect(events.length).to.equal(1);
                expect(events[0].args.voter).to.equal(admin.address);
                expect(events[0].args.id).to.equal(0);
                expect(events[0].args.voted).to.equal(true);
            });

            it("should not emit event ProposalValidated", async function () {
                const proposalName = "Proposal A";
                const proposalDesc = "Desc A";
                await daoGovernance.connect(finder).submitProposal(proposalName, proposalDesc);
                const tx = await daoGovernance.connect(finder).submitVote(0);
                await tx.wait();

                const events = await daoGovernance.queryFilter("ProposalValidated", tx.blockHash);
                expect(events.length).to.equal(0);
            });
        });

        describe("submit vote existing proposal as finder", function () {
            it("should increase voteCount to 1", async function () {
                const proposalName = "Proposal A";
                const proposalDesc = "Desc A";
                await daoGovernance.submitProposal(proposalName, proposalDesc);
                await daoGovernance.connect(finder).submitVote(0);
                const proposal = await daoGovernance.proposals(0);
                expect(proposal.voteCount).to.equal(1);
            });
        })

        describe("submit vote existing proposal as brainer", function () {
            it("should increase voteCount to 1", async function () {
                const proposalName = "Proposal A";
                const proposalDesc = "Desc A";
                await daoGovernance.submitProposal(proposalName, proposalDesc);
                await daoGovernance.connect(brainer).submitVote(0);
                const proposal = await daoGovernance.proposals(0);
                expect(proposal.voteCount).to.equal(2);
            });
        })

        describe("submit vote existing proposal as wisemen", function () {
            it("should increase voteCount to 1", async function () {
                const proposalName = "Proposal A";
                const proposalDesc = "Desc A";
                await daoGovernance.submitProposal(proposalName, proposalDesc);
                await daoGovernance.connect(wise).submitVote(0);
                const proposal = await daoGovernance.proposals(0);
                expect(proposal.voteCount).to.equal(4);
            });
        })

        describe("submit enough votes to validate proposal", function () {
            it("should emit event ProposalValidated", async function () {
                const proposalName = "Proposal A";
                const proposalDesc = "Desc A";
                await daoGovernance.submitProposal(proposalName, proposalDesc);
                await daoGovernance.connect(finder).submitVote(0);
                const tx = await daoGovernance.submitVote(0);
                await tx.wait();

                const events = await daoGovernance.queryFilter("ProposalValidated", tx.blockHash);
                expect(events.length).to.equal(1);
                expect(events[0].args.id).to.equal(0);
            });
        });

        describe("submit vote on non existing proposal", function () {
            it("should revert with proposal not found", async function () {
                await expect(daoGovernance.submitVote(2)).to.be.revertedWith("Proposal not found");
            });
        });

        describe("submit vote true two times with same address", function () {
            it("should revert with already submitted", async function () {
                const proposalName = "Proposal A";
                const proposalDesc = "Desc A";
                await daoGovernance.submitProposal(proposalName, proposalDesc);
                await daoGovernance.connect(finder).submitVote(0);
                await expect(daoGovernance.connect(finder).submitVote(0)).to.be.revertedWith("Already submitted");
            });
        });

        describe("submit vote as visitor", function () {
            it("should revert with not participant", async function () {
                const proposalName = "Proposal A";
                const proposalDesc = "Desc A";
                await daoGovernance.submitProposal(proposalName, proposalDesc);
                await expect(daoGovernance.connect(visitor).submitVote(0)).to.be.revertedWith("Not participant");
            });
        });

        describe("submit vote on validated proposal", function () {
            it("should emit event ProposalValidated", async function () {
                const proposalName = "Proposal A";
                const proposalDesc = "Desc A";
                await daoGovernance.submitProposal(proposalName, proposalDesc);
                await daoGovernance.connect(finder).submitVote(0);
                await daoGovernance.connect(brainer).submitVote(0);

                await expect(daoGovernance.submitVote(0)).to.be.revertedWith("Already validated");
            });
        });
    });

    // Define test cases for the withdraw function
    describe("withdraw", function () {

        describe("withdraw submitted vote", function () {
            it("should decrease voteCount to 0", async function () {
                const proposalName = "Proposal A";
                const proposalDesc = "Desc A";
                await daoGovernance.submitProposal(proposalName, proposalDesc);
                await daoGovernance.submitVote(0);
                await daoGovernance.withdrawVote(0);
                const proposal = await daoGovernance.proposals(0);
                expect(proposal.voteCount).to.equal(0);
            });

            it("should emit event VoteSubmitted with false", async function () {
                const proposalName = "Proposal A";
                const proposalDesc = "Desc A";
                await daoGovernance.submitProposal(proposalName, proposalDesc);
                await daoGovernance.submitVote(0);
                const tx = await daoGovernance.withdrawVote(0);
                await tx.wait();

                const events = await daoGovernance.queryFilter("VoteSubmitted", tx.blockHash);
                expect(events.length).to.equal(1);
                expect(events[0].args.voter).to.equal(admin.address);
                expect(events[0].args.id).to.equal(0);
                expect(events[0].args.voted).to.equal(false);
            });
        });

        describe("withdraw submitted vote as finder", function () {
            it("should decrease voteCount to 0 as finder", async function () {
                const proposalName = "Proposal A";
                const proposalDesc = "Desc A";
                await daoGovernance.submitProposal(proposalName, proposalDesc);
                await daoGovernance.connect(finder).submitVote(0);
                await daoGovernance.connect(finder).withdrawVote(0);
                const proposal = await daoGovernance.proposals(0);
                expect(proposal.voteCount).to.equal(0);
            });
        })

        describe("withdraw submitted vote as brainer", function () {
            it("should decrease voteCount to 0 as brainer", async function () {
                const proposalName = "Proposal A";
                const proposalDesc = "Desc A";
                await daoGovernance.submitProposal(proposalName, proposalDesc);
                await daoGovernance.connect(brainer).submitVote(0);
                await daoGovernance.connect(brainer).withdrawVote(0);
                const proposal = await daoGovernance.proposals(0);
                expect(proposal.voteCount).to.equal(0);
            });
        })

        describe("withdraw submitted vote as wisemen", function () {
            it("should decrease voteCount to 0 as wisemen", async function () {
                const proposalName = "Proposal A";
                const proposalDesc = "Desc A";
                await daoGovernance.submitProposal(proposalName, proposalDesc);
                await daoGovernance.connect(wise).submitVote(0);
                await daoGovernance.connect(wise).withdrawVote(0);
                const proposal = await daoGovernance.proposals(0);
                expect(proposal.voteCount).to.equal(0);
            });
        })

        describe("withdraw vote on non existing proposal", function () {
            it("should revert with proposal not found", async function () {
                await expect(daoGovernance.withdrawVote(2)).to.be.revertedWith("Proposal not found");
            });
        });

        describe("withdrawn vote as visitor", function () {
            it("should revert with not participant", async function () {
                const proposalName = "Proposal A";
                const proposalDesc = "Desc A";
                await daoGovernance.submitProposal(proposalName, proposalDesc);
                await expect(daoGovernance.connect(visitor).withdrawVote(0)).to.be.revertedWith("Not participant");
            });
        });

        describe("withdraw non submitted vote", function () {
            it("should revert with already withdrawn", async function () {
                const proposalName = "Proposal A";
                const proposalDesc = "Desc A";
                await daoGovernance.submitProposal(proposalName, proposalDesc);
                await expect(daoGovernance.withdrawVote(0)).to.be.revertedWith("Already withdrawn");
            });
        });
    });
});