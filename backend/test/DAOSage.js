const { expect } = require("chai");
const { ethers } = require("hardhat");
const {address} = require("hardhat/internal/core/config/config-validation");

describe("DAOSage Contract", function () {
    let dao, admin, wise, brainer, finder, visitor;

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

            it("should update contract balance", async function () {
                const balance = await ethers.provider.getBalance(dao.address);
                const cost = ethers.utils.parseEther("0.01");
                await dao.connect(visitor).mintFinder(visitor.address, {value: cost});
                const newBalance = await ethers.provider.getBalance(dao.address);
                const expectedBalance = balance.add(ethers.utils.parseEther("0.01"));
                expect(newBalance).to.equal(expectedBalance);
            });
        })

        describe("mint finder as zero address", function () {
            it("should revert with address incorrect", async function () {
                const cost = ethers.utils.parseEther("0.01");
                await expect(dao.connect(finder).mintFinder(ethers.constants.AddressZero, {value: cost})).to.be.revertedWith("address incorrect");
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
                await expect(dao.connect(visitor).mintFinder(visitor.address)).to.be.revertedWith("wrong amount of ether");
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

            it("should update contract balance with brainer mint", async function () {
                const balance = await ethers.provider.getBalance(dao.address);
                const cost = ethers.utils.parseEther("0.02");
                await dao.connect(visitor).mintBrainer(visitor.address, {value: cost});
                const newBalance = await ethers.provider.getBalance(dao.address);
                const expectedBalance = balance.add(ethers.utils.parseEther("0.02"));
                expect(newBalance).to.equal(expectedBalance);
            });
        })

        describe("mint brainer as zero address", function () {
            it("should revert with address incorrect", async function () {
                const cost = ethers.utils.parseEther("0.02");
                await expect(dao.connect(brainer).mintBrainer(ethers.constants.AddressZero, {value: cost})).to.be.revertedWith("address incorrect");
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
                await expect(dao.connect(visitor).mintBrainer(visitor.address)).to.be.revertedWith("wrong amount of ether");
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

        describe("mint wisemen as zero address", function () {
            it("should revert with address incorrect", async function () {
                await expect(dao.connect(admin).mintWisemen(ethers.constants.AddressZero)).to.be.revertedWith("address incorrect");
            });
        })

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

    // Define test cases for the getVoteWeight function
    describe("getVoteWeight", function () {
        describe("get weight for wisemen", function () {
            it("should return uint 4", async function () {
                const weight = await dao.getVoteWeight(wise.address);
                expect(weight).to.be.equal(4);
            });
        })

        describe("get weight for brainer", function () {
            it("should return uint 2", async function () {
                const weight = await dao.getVoteWeight(brainer.address);
                expect(weight).to.be.equal(2);
            });
        })

        describe("get weight for finder", function () {
            it("should return uint 1", async function () {
                const weight = await dao.getVoteWeight(finder.address);
                expect(weight).to.be.equal(1);
            });
        })

        describe("get weight for zero address", function () {
            it("should revert with address incorrect", async function () {
                await expect(dao.getVoteWeight(ethers.constants.AddressZero)).to.be.revertedWith("address incorrect");
            });
        })

        describe("get weight for visitor", function () {
            it("should revert with not participant", async function () {
                await expect(dao.getVoteWeight(visitor.address)).to.be.revertedWith("not participant");
            });
        })
    });

    // Define test cases for the getVoteWeight function
    describe("isParticipant", function () {
        describe("get isParticipant for wisemen", function () {
            it("should return uint true", async function () {
                const value = await dao.isParticipant(wise.address);
                expect(value).to.be.equal(true);
            });
        })

        describe("get isParticipant for brainer", function () {
            it("should return uint true", async function () {
                const value = await dao.isParticipant(brainer.address);
                expect(value).to.be.equal(true);
            });
        })

        describe("get isParticipant for finder", function () {
            it("should return uint true", async function () {
                const value = await dao.isParticipant(finder.address);
                expect(value).to.be.equal(true);
            });
        })

        describe("get isParticipant for visitor", function () {
            it("should return uint false", async function () {
                const value = await dao.isParticipant(visitor.address);
                expect(value).to.be.equal(false);
            });
        })

        describe("get weight for zero address", function () {
            it("should revert with address incorrect", async function () {
                await expect(dao.isParticipant(ethers.constants.AddressZero)).to.be.revertedWith("address incorrect");
            });
        })
    });

    // Define test cases for the withdrawFunds function
    describe("withdrawFunds", function () {
        describe("withdraw as owner", function () {
            it("should withdraw and balance equal 0", async function () {
                await dao.withdrawFunds();
                const balanceAfter = await ethers.provider.getBalance(dao.address);
                expect(balanceAfter).to.be.equal(0);
            });
        })
        describe("withdraw as visitor", function () {
            it("should revert with address incorrect", async function () {
                await expect(dao.connect(visitor).withdrawFunds()).to.be.revertedWith("Ownable: caller is not the owner");
            });
        })
        describe("withdraw as finder", function () {
            it("should revert with address incorrect", async function () {
                await expect(dao.connect(finder).withdrawFunds()).to.be.revertedWith("Ownable: caller is not the owner");
            });
        })
        describe("withdraw as brainer", function () {
            it("should revert with address incorrect", async function () {
                await expect(dao.connect(brainer).withdrawFunds()).to.be.revertedWith("Ownable: caller is not the owner");
            });
        })
        describe("withdraw as wisemen", function () {
            it("should revert with address incorrect", async function () {
                await expect(dao.connect(wise).withdrawFunds()).to.be.revertedWith("Ownable: caller is not the owner");
            });
        })
    })
});