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
    // console.log(todoList);
    // let s = await new web3.eth.Contract(todoList.abi);
    // console.log(s);
    App.contract.TodoList = await new web3.eth.Contract(todoList.abi);
    App.contract.TodoList.setProvider(web3.currentProvider);

    console.log(App.contract.TodoList);
    // App.todoList = await App.contract.TodoList.deployed();
    // console.log(App.todoList);
  },

  render: async () => {
    var element = document.getElementById("account");
    App.setLoading(true);

    element.innerHTML = App.account;

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
};

$(() => {
  $(window).load(() => {
    App.load();
  });
});
