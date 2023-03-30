// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.18;

contract Escrow {
    address payable public dao;
    address payable public recipient;
    uint public amount;
    bool public fundsDisbursed;

    constructor(address _dao, address _recipient, uint _amount) payable {
        dao = payable(_dao);
        recipient = payable(_recipient);
        amount = _amount;
    }

    function deposit() public {
        require(!fundsDisbursed, "Funds have already been disbursed.");
        dao.transfer(amount);
        fundsDisbursed = true;
    }

    function release() public {
        require(!fundsDisbursed, "Funds have already been disbursed.");
        require(msg.sender == dao, "Only the dao can release funds.");
        recipient.transfer(amount);
        fundsDisbursed = true;
    }

    function balance() view public returns (uint) {
        return address(this).balance;
    }
}