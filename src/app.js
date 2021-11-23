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
    // console.log("app loading");
    // alert("i got here");
    // console.log("====>>>>", "web3 accouts", await web3.eth.getAccounts());
    let acc = await web3.eth.getAccounts();

    App.account = acc[0];
    // alert(App.account);
  },
  loadContract: async () => {
    const todoList = await $.getJSON("TodoList.json");
    let cAdd = "0x46d4953A9FEE189072E6bc30B9Cdc83DE515C9a1";
    // console.log(todoList);
    // let s = await new web3.eth.Contract(todoList.abi);
    // console.log(s);
    App.contract.TodoList = await new web3.eth.Contract(todoList.abi, cAdd);
    App.contract.TodoList.setProvider(web3.currentProvider);

    // console.log(App.contract.TodoList);
    // App.todoList = await App.contract.TodoList.deployed();
    // console.log(App.todoList);
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
    // var content = $("#content");

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
      // console.log("contract here ==>", contract);
      let taskCount = await contract.methods.taskCount().call();
      let taskArray = [];
      // console.log(task);
      for (let index = 1; index <= taskCount; index++) {
        let task = await contract.methods.tasks(index).call();
        // console.log(task);
        const taskId = task.id;
        const taskContent = task.content;
        const taskcompleted = task.completed;
        console.log(taskId, taskContent, taskcompleted);
        let p = document.getElementById("taskTemplate");

        let e = $("#taskTemplate").clone();
        console.log(e, taskContent, "nwiqn");

        $(e).find(".content").html(taskContent);
        $(e)
          .find("input")
          .prop("name", taskId)
          .prop("checked", taskcompleted)
          .prop("class", "input")
          .on("click", App.toggleCompleted);

        console.log(e);
        var completedTaskList = document.getElementById("completedTaskList");
        var taskList = $("#taskList");
        if (taskcompleted) {
          // alert("here");
          completedTaskList.append(e.val);
          console.log(completeTaskList);
        } else {
          // alert("there");
          taskList.append(e.html());

          console.log(taskList);
        }

        e.show();
      }
    } catch (error) {
      console.log(error);
    }
  },
};

$(() => {
  $(window).load(() => {
    App.load();
  });
});
