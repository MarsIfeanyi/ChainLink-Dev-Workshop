import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
import { ethers } from "hardhat";
import { SimpleStorage } from "../typechain-types";
//import { assert } from "console";

// Hint: fixtures are used for you to deploy smart contract only once and then use a copy of it inside every unit test

// Hint: the ".only" prefix ensure that only this particular test will run when to call "hardhat test"

describe.only("SimpleStorage Unit Tests", function () {
  // fixtures

  async function deploySimpleStorageFixture() {
    const _message = "Hello, Mars is a Blockchain Engineer";

    const [owner, otherAccount] = await ethers.getSigners(); // Hint: By default, owner is always the first account

    const SimpleStorageFactory = await ethers.getContractFactory(
      "SimpleStorage"
    );
    const simpleStorage = await SimpleStorageFactory.connect(owner).deploy(
      _message
    );

    return { simpleStorage, _message, owner, otherAccount };
  }

  it("Should test deployment", async function () {
    const { simpleStorage, _message, owner } = await loadFixture(
      deploySimpleStorageFixture
    );

    // calling the getter function on the storage variable, "message" set in the contract
    const message = await simpleStorage.message();

    // console.log(simpleStorage.address);
    // console.log("My Message:", message);

    assert(message === _message, "Messages are not the same");

    const currentOwner = await simpleStorage.owner();
    // console.log(currentOwner, owner.address);

    // Testing if currentOwner === msg.sender ie owner defined in the smart contract

    assert(currentOwner === owner.address, "Owner was not set properly");
  });

  /**
   * Hint: In the setMessage function in the smart contract we need to test 3 things:
   *
   * 1. onlyOwner can call this function
   * 2. newMessage is set
   * 3. Correct event is emitted
   */

  describe("#setMessage", async function () {
    let simpleStorageContract: SimpleStorage;

    let user;

    beforeEach(async function () {
      const { simpleStorage, otherAccount, owner } = await loadFixture(
        deploySimpleStorageFixture
      );

      simpleStorageContract = simpleStorage;
      user = otherAccount;
    });

    it("Should be called only by an owner", async function () {
      //   const { simpleStorage, otherAccount } = await loadFixture(
      //     deploySimpleStorageFixture
      //   );

      await expect(
        simpleStorageContract.setMessage("Hello World")
      ).to.be.revertedWith("Error: Only Owner Can Call");
    });

    it("Should set new message", async function () {
      //   const { simpleStorage, owner } = await loadFixture(
      //     deploySimpleStorageFixture
      //   );

      const newMessage = "Mars is a core Blockchain Engineer";

      await simpleStorageContract.setMessage(newMessage);

      // Reading it from the Blockchain
      const actualMessage = await simpleStorageContract.message();
      //   console.log(actualMessage);

      assert(actualMessage === newMessage, "Message not set");
    });

    it("Should emit a NewMessage event", async function () {
      const { simpleStorage, owner } = await loadFixture(
        deploySimpleStorageFixture
      );

      const newMessage = "I am a Modern Polymath";

      await expect(await simpleStorage.connect(owner).setMessage(newMessage))
        .to.emit(simpleStorage, "NewMessage")
        .withArgs(newMessage); // Hint: NewMessage is the name of the event defined in the smart contract
    });
  });
});
