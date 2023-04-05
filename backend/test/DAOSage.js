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
        dao.mintBrainer(brainer.address, {value: ethers.utils.parseEther("0.02")});
        dao.mintFinder(finder.address, {value: ethers.utils.parseEther("0.01")});
    });

    // Define test cases for the minting part
    describe("mint", function () {

        describe("mint finder as visitor", function () {
            it("should find a finder nft in visitor", async function () {
                const cost = ethers.utils.parseEther("0.01");
                await dao.connect(visitor).mintFinder(visitor.address, {value: cost});
                const result = await dao.connect(visitor).getRoles();
                expect(result.isFinder).to.equal(true);
                expect(result.isBrainer).to.equal(false);
                expect(result.isWise).to.equal(false);
            });

            it("should return tokenFinderURI", async function () {
                const cost = ethers.utils.parseEther("0.01");
                await dao.connect(visitor).mintFinder(visitor.address, {value: cost});
                const result = await dao.connect(visitor).tokenFinderURI();
                expect(result).to.be.not.undefined;
            });
        })

        describe("mint finder as finder", function () {
            it("should revert with already minted finder", async function () {
                const cost = ethers.utils.parseEther("0.01");
                await expect(dao.connect(finder).mintFinder(finder.address, {value: cost})).to.be.revertedWith("Already minted");
            });
        })

        describe("mint finder as visitor with no eth", function () {
            it("should revert with insufficient eth", async function () {
                await expect(dao.connect(visitor).mintFinder(visitor.address)).to.be.revertedWith("insufficient eth");
            });
        })

        describe("get tokenFinder as visitor", function () {
            it("should revert with finder not mint", async function () {
                await expect(dao.connect(visitor).tokenFinderURI()).to.be.revertedWith("Finder not mint");
            });
        })

        describe("mint brainer as visitor", function () {
            it("should find a brainer nft in visitor", async function () {
                const cost = ethers.utils.parseEther("0.02");
                await dao.connect(visitor).mintBrainer(visitor.address, {value: cost});
                const result = await dao.connect(visitor).getRoles();
                expect(result.isFinder).to.equal(false);
                expect(result.isBrainer).to.equal(true);
                expect(result.isWise).to.equal(false);
            });

            it("should return brainer tokenURI", async function () {
                const cost = ethers.utils.parseEther("0.02");
                await dao.connect(visitor).mintBrainer(visitor.address, {value: cost});
                const result = await dao.connect(visitor).tokenBrainerURI();
                expect(result).to.be.not.undefined;
            });
        })

        describe("mint brainer as brainer", function () {
            it("should revert with already minted brainer", async function () {
                const cost = ethers.utils.parseEther("0.02");
                await expect(dao.connect(brainer).mintBrainer(brainer.address, {value: cost})).to.be.revertedWith("Already minted");
            });
        })

        describe("mint finder as visitor with no eth", function () {
            it("should revert with insufficient eth", async function () {
                await expect(dao.connect(visitor).mintBrainer(visitor.address)).to.be.revertedWith("insufficient eth");
            });
        })

        describe("get tokenBrainer as visitor", function () {
            it("should revert with brainer not mint", async function () {
                await expect(dao.connect(visitor).tokenBrainerURI()).to.be.revertedWith("Brainer not mint");
            });
        });

        describe("mint wisemen as visitor", function () {
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
        });

        describe("mint wisemen as wisemen", function () {
            it("should revert with already minted wisemen", async function () {
                await dao.connect(admin).mintWisemen(visitor.address);
                await expect(dao.connect(admin).mintWisemen(visitor.address)).to.be.revertedWith("Already minted");
            });
        })

        describe("get tokenWise as visitor", function () {
            it("should revert with wisemen not mint", async function () {
                await expect(dao.connect(visitor).tokenWiseURI()).to.be.revertedWith("Wise not mint");
            });
        })
    })

    // Define test cases for the submitProject function
    describe("submitProject", function () {
        describe("submit new project as finder", function () {
            it("should create project in array", async function () {
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
        });

        describe("submit new project as visitor", function () {
            it("should revert if not finder", async function () {
                await expect(dao.connect(visitor).submitProject("Test")).to.be.revertedWith("Not finder or wisemen");
            });
        })

        describe("submit new project as brainer", function () {
            it("should revert if brainer only", async function () {
                await expect(dao.connect(brainer).submitProject("Test")).to.be.revertedWith("Not finder or wisemen");
            });
        })

        describe("submit new project with empty name", function () {
            it("should revert if project name is empty", async function () {
                await expect(dao.submitProject("")).to.be.revertedWith("Project name must not be empty.");
            });
        });
    });

    // Define test cases for the auditing function
    describe("audited", function () {

        describe("audit created project", function () {
            it("should update the total score", async function () {
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
        });

        describe("audit project more than once", function () {
            it("should remove previous grade and add new grade", async function () {
                const projectName = "My Project";
                await dao.submitProject(projectName);
                await dao.auditProject(0, 8);
                await dao.auditProject(0, 3);
                const audit = await dao.getAudit(0);
                expect(audit).to.equal(3);
            });

            it("should emit two events AuditSubmitted", async function () {
                const projectName = "My Project";
                await dao.submitProject(projectName);
                await dao.auditProject(0, 8);
                await dao.auditProject(0, 3);

                const events = await dao.queryFilter("AuditSubmitted");
                expect(events.length).to.equal(2);
                expect(events[0].args.voter).to.equal(admin.address);
                expect(events[0].args.grade).to.equal(8);
                expect(events[1].args.voter).to.equal(admin.address);
                expect(events[1].args.grade).to.equal(3);
            });
        })

        describe("audit project as finder", function () {
            it("should revert if not brainer or wise", async function () {
                const projectName = "My Project";
                await dao.submitProject(projectName);
                await expect(dao.connect(finder).auditProject(0, 8)).to.be.revertedWith("Not brainer or wisemen");
            });
        })

        describe("audit non existing project", function () {
            it("should revert with invalid project index", async function () {
                await expect(dao.auditProject(1, 8)).to.be.revertedWith("Invalid project index.");
            });
        })

        describe("audit project with grade above 10", function () {
            it("should revert with invalid grade", async function () {
                const projectName = "My Project";
                await dao.submitProject(projectName);
                await expect(dao.auditProject(0, 12)).to.be.revertedWith("Grade must be between 1 and 10.");
            });
        })

        describe("get audit from not audited project", function () {
            it("should return 0 as project audit", async function () {
                const projectName = "My Project";
                await dao.submitProject(projectName);
                const audit = await dao.getAudit(0);
                expect(audit).to.equal(0);
            });
        })
    });

    // Define test cases for the submitProposal function
    describe("submitProposal", function () {

        describe("submit new proposal", function () {
            it("should add proposal in proposals array", async function () {
                const proposalName = "Proposal A";
                const proposalDesc = "Desc A";
                await dao.submitProposal(proposalName, proposalDesc);
                const proposal = await dao.proposals(0);
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
        })

        describe("submit new proposal with empty name", function () {
            it("should revert if project name is empty", async function () {
                await expect(dao.submitProposal("","Test")).to.be.revertedWith("Proposal name and description must not be empty.");
            });
        })

        describe("submit new proposal with empty description", function () {
            it("should revert if project description is empty", async function () {
                await expect(dao.submitProposal("Test","")).to.be.revertedWith("Proposal name and description must not be empty.");
            });
        });

        describe("submit new proposal as visitor", function () {
            it("should revert with not participant", async function () {
                await expect(dao.connect(visitor).submitProposal("Test","test")).to.be.revertedWith("Not participant");
            });
        });

        describe("get proposal submitted", function () {
            it("should return proposal", async function () {
                const proposalName = "Proposal A";
                const proposalDesc = "Desc A";
                await dao.submitProposal(proposalName, proposalDesc);

                const proposal = await dao.getProposal(0);
                expect(proposal.name).to.equal(proposalName);
                expect(proposal.description).to.equal(proposalDesc);
                expect(proposal.validated).to.equal(false);
            });
        });

        describe("get non existing proposal", function () {
            it("should revert with not found", async function () {
                await expect(dao.getProposal(0)).to.be.revertedWith("Proposal not found");
            });
        });

    });

    // Define test cases for the voting function
    describe("voted", function () {
        describe("submit vote existing proposal", function () {
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
        });

        describe("submit enough votes to validate proposal", function () {
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
        });

        describe("submit vote on non existing proposal", function () {
            it("should revert with proposal not found", async function () {
                await expect(dao.submitVote(2)).to.be.revertedWith("Proposal not found");
            });
        });

        describe("submit vote true two times with same address", function () {
            it("should revert with already submitted", async function () {
                const proposalName = "Proposal A";
                const proposalDesc = "Desc A";
                await dao.submitProposal(proposalName, proposalDesc);
                await dao.submitVote(0);
                await expect(dao.submitVote(0)).to.be.revertedWith("Already submitted");
            });
        });

        describe("submit vote as visitor", function () {
            it("should revert with not participant", async function () {
                const proposalName = "Proposal A";
                const proposalDesc = "Desc A";
                await dao.submitProposal(proposalName, proposalDesc);
                await expect(dao.connect(visitor).submitVote(0)).to.be.revertedWith("Not participant");
            });
        });

        describe("submit vote on validated proposal", function () {
            it("should emit event ProposalValidated", async function () {
                const proposalName = "Proposal A";
                const proposalDesc = "Desc A";
                await dao.submitProposal(proposalName, proposalDesc);
                await dao.connect(finder).submitVote(0);
                await dao.connect(brainer).submitVote(0);
                await dao.submitVote(0);

                await expect(dao.connect(wise).submitVote(0)).to.be.revertedWith("Already validated");
            });
        });
    });

    // Define test cases for the withdraw function
    describe("withdraw", function () {

        describe("withdraw submitted vote", function () {
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
        });

        describe("withdraw vote on non existing proposal", function () {
            it("should revert with proposal not found", async function () {
                await expect(dao.withdrawVote(2)).to.be.revertedWith("Proposal not found");
            });
        });

        describe("withdrawn vote as visitor", function () {
            it("should revert with not participant", async function () {
                const proposalName = "Proposal A";
                const proposalDesc = "Desc A";
                await dao.submitProposal(proposalName, proposalDesc);
                await expect(dao.connect(visitor).withdrawVote(0)).to.be.revertedWith("Not participant");
            });
        });

        describe("withdraw non submitted vote", function () {
            it("should revert with already withdrawn", async function () {
                const proposalName = "Proposal A";
                const proposalDesc = "Desc A";
                await dao.submitProposal(proposalName, proposalDesc);
                await expect(dao.withdrawVote(0)).to.be.revertedWith("Already withdrawn");
            });
        });
    });
});