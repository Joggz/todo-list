const { assert } = require("chai");

const TodoList = artifacts.require("./TodoList.sol");

contract("TodoList", (accounts) => {
  before(async () => {
    this.todoList = await TodoList.deployed();
  });

  it("should return contract address ", async () => {
    const address = await this.todoList.address;
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });

  it("list tasks", async () => {
    const taskCount = await this.todoList.taskCount();
    const task = await this.todoList.tasks(taskCount);
    assert.equal(task.id.toNumber(), taskCount.toNumber());
  });
  it("should create another task ", async () => {
    const task = await this.todoList.createTask("learn some more bcd stuff");
    console.log(task);
  });
});
