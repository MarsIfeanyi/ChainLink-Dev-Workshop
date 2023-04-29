// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

contract SimpleStorage {
    string public message;
    address public owner;

    // creating an event... This will be emitted whenever a new message is sent
    event NewMessage(string message);

    modifier onlyOwner() {
        require(msg.sender == owner, "Error: Only Owner Can Call");
        _;
    }

    // the constructor will be executed during the deployment process only
    constructor(string memory _message) {
        message = _message;

        owner = msg.sender;
    }

    // Function that sets new message by taking input from the user.
    function setMessage(string memory newMessage) public onlyOwner {
        message = newMessage;

        emit NewMessage(message);
    }
}
