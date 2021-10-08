/* eslint-disable quotes */
/* eslint-disable no-undef */

const { expect } = require('chai');

describe('delegation call', function () {
  let deployer, Storage, storage, Machine, machine;

  beforeEach(async function () {
    deployer = await ethers.getSigner();

    Storage = await ethers.getContractFactory('Storage');
    storage = await Storage.deploy(5);
    await storage.deployed();

    Machine = await ethers.getContractFactory('Machine');
    machine = await Machine.deploy(storage.address);
    await machine.deployed();
  })
  
  describe('Storage', async function () {
    it("Should return the value 5", async function () {
      expect(await storage.reservedValue()).to.equal(5);
    });
    it("Should rset a new value", async function () {
      await storage.setValue(10);
      expect(await storage.reservedValue()).to.equal(10);
    });
  });

  describe('Machine', async function () {
    it("Should set the new value to Storage", async function () {
      await machine.saveValue(1)
      expect(await machine.getValueStorage()).to.equal(1);
      expect(await machine.getValueMachine()).to.equal(0);
    });
    it("Should set the new value to Machine", async function () {
      const result = await machine.setValue(3)
      expect(await machine.getValueStorage()).to.equal(5);
      expect(await machine.getValueMachine()).to.equal(3);
    });
  });

})

