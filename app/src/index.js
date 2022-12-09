import Web3 from "web3";
import BlockchainPoll from "../../build/contracts/BlockchainPoll.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function () {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = BlockchainPoll.networks[networkId];
      this.meta = new web3.eth.Contract(
        BlockchainPoll.abi,
        deployedNetwork.address,
      );
      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  setStatus: function (message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },

  createPoll: async function () {
    const { createPoll } = this.meta.methods;
    // Returns the Poll Name
    const name = document.getElementById("pollName").value;
    //Returns the Poll Question
    const pollQuestion = document.getElementById("pollQuestion").value;
    //Returns the different Poll Options
    const elements1 = document.querySelectorAll(`[id^="answer"]`);
    //Converts the Poll Options into an array from a HTML Query Selector
    let elements2= [];
    for (let i=0; i < elements1.length; i++) {
     elements2[i] = elements1[i].value 
    };
    //Create the Poll using the information above and set the status claiming success
    await createPoll(name, pollQuestion, elements2).send({ from: this.account });
    App.setStatus("Poll Question has been created with the name " + name + " and the question is " + pollQuestion + " by " + this.account + ".");
  },


  lookUpMaster: async function () {
    const { lookUpnameToQuestionInfo } = this.meta.methods;
    const { lookUpnameToOptions } = this.meta.methods;
    const { lookUpnameToVotes } = this.meta.methods;  
    //Try returning the name of the poll from the smart contract using the value searched
    const name = document.getElementById("lookupPollName").value;
    if (name === "") {
      alert("Please provide a poll name");
      return false;
    }
    if (Number.isInteger(Number(name))) {
      alert("The name must be a string");
      return false;
    }
    //Try returning the question of the poll from the smart contract
    let question;
    try {
      question = await lookUpnameToQuestionInfo(name).call({ from: this.account });
    } catch (error) {
      if (error.message.indexOf('The Poll is not referenced') !== -1) {
        alert(`The poll ${name} could not be found!`);
        return false;
      } else {
        alert("Error occured! Please contact support"); // unknown error
        return false;
      }
    }
    //Return the options and votes of the poll from the smart contract
    const options = await lookUpnameToOptions(name).call({ from: this.account });
    const votes = await lookUpnameToVotes(name).call({ from: this.account });

    //Push the options into the dropdown for users to vote unless they have already been added by clicking the button previously
    var select = document.getElementById("selectoption")
    let numb = select.childElementCount;
    if (numb != options.length + 1) {
      for(var i = 0; i < options.length; i++) {
        var opt = options[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
      }
  }

    //Only make the Vote option available if a poll is returned
    const votebtn = document.getElementById('votebutton');
    votebtn.style.display='initial';
    //Set the status of the poll
    App.setStatus("The Poll question " + question + " has the options " + options + " with " + votes + " respective votes.");
  },
  
  //Simple Voting function using the name and dropdown option selected
  vote: async function () {
    const { vote } = this.meta.methods;
    const name = document.getElementById("lookupPollName").value;
    const option = document.getElementById("selectoption").value;
    await vote(name, option).send({ from: this.account });
    this.lookUpMaster();
  }

};

window.App = App;

window.addEventListener("load", async function () {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    await window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",);
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"),);
  }

  App.start();
});


//COSMETIC WORK//
var answers = 0

const optionbtn = document.getElementById('addoption');
const removebtn = document.getElementById('removeoption');

optionbtn.addEventListener('click', () => {
  removebtn.style.display='initial';
  var elements1 = document.querySelectorAll(`[id^="answer"]`);
  var button = elements1.length + 1;
  let write = document.getElementById('buttons' + button);
  write.innerHTML = '<span><input type="text" id="answer"' + answers + '/></span>';
  answers ++;
})

removebtn.addEventListener('click', () => {
  var elements1 = document.querySelectorAll(`[id^="answer"]`);
  var button = elements1.length;
  let write = document.getElementById('buttons' + button);
  write.innerHTML="";
  if (button == 1) {
    removebtn.style.display='none';
  }
})

