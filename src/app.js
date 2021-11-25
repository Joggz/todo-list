// const Web3 = require("web3");
// import Web3 from "web3";

// const { default: Web3 } = require("web3");

// let web3; sx
App = {
  contract: {},
  loading: false,
  load: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
  },

  loadWeb3: async () => {
    if (typeof web3 !== "undefined") {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
      // console.log("====> web3", web3);
    } else {
      window.alert("Please connect to Metamask.");
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        web3.eth.sendTransaction({
          /* ... */
        });
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider;
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      web3.eth.sendTransaction({
        /* ... */
      });
    }
    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  },
  loadAccount: async () => {
    let acc = await web3.eth.getAccounts();
    console.log(acc);
    App.account = acc[0];
    // alert(App.account);
  },
  loadContract: async () => {
    const todoList = await $.getJSON("TodoList.json");
    let cAdd = "0x692d871510794f51FDD9d8291eB6073F74b08Ef0";

    App.contract.TodoList = await new web3.eth.Contract(todoList.abi, cAdd);
    App.contract.TodoList.setProvider(web3.currentProvider);
  },

  render: async () => {
    var element = document.getElementById("account");
    App.setLoading(true);

    element.innerHTML = App.account;
    await App.renderTasks();

    App.setLoading(false);
  },

  setLoading: (boolean) => {
    App.loading = boolean;
    var loader = document.getElementById("loader");
    var content = document.getElementById("content");

    if (boolean) {
      loader.style.visibility = "visible";
      content.style.visibility = "hidden";
    } else {
      loader.style.visibility = "hidden";
      content.style.visibility = "visible";
    }
  },

  renderTasks: async () => {
    try {
      let contract = App.contract.TodoList;

      let taskCount = await contract.methods.taskCount().call();
      let taskArray = [];

      for (let index = 1; index <= taskCount; index++) {
        let task = await contract.methods.tasks(index).call();

        const taskId = task.id;
        const taskContent = task.content;
        const taskcompleted = task.completed;
        let p = document.getElementById("taskTemplate");

        let e = $("#taskTemplate").clone();

        $(e).find(".content").html(taskContent);
        $(e)
          .find("input")
          .prop("name", taskId)
          .prop("checked", taskcompleted)
          .prop("class", "input")
          .on("click", App.toggleCompleted);

        var completedTaskList = document.getElementById("completedTaskList");
        var taskList = $("#taskList");
        if (taskcompleted) {
          completedTaskList.append(e.val);
        } else {
          taskList.append(e.html());
        }

        e.show();
      }
    } catch (error) {
      console.log(error);
    }
  },
  createTask: async () => {
    App.setLoading(true);
    const content = $("#newTask").val();

    let contract = App.contract.TodoList;
    console.log(content, contract);
    let s = await contract.methods
      .createTask(content)
      .send({ from: App.account });
  },
};

$(() => {
  $(window).load(() => {
    App.load();
  });
});
