let contract;

$(document).ready(function () {
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

  $.get("/contract/contract_data.json", function (data, status) {
    if (status === "success") {
      const contract_abi = data.contract_abi;
      const contract_address = data.contract_address;

      contract = new web3.eth.Contract(contract_abi, contract_address);

      // check metamask connection
      web3.eth.getAccounts().then(function (accounts) {
        if (!ethereum.isMetaMask || accounts.length < 1) {
          ethereum.request({
            method: 'eth_requestAccounts'
          });
        } else {
          $('#connectMetamask').html("Metamask Is Connected")
          $('#connectMetamask').prop('disabled', true);
        }

        // show super admin address
        contract.methods.superAdmin().call()
          .then(function (result) {
            $('#super-admin-address').text(result);
          }).catch(function (err) {
            console.log(err)
          });

        web3.eth.getAccounts().then(function (accounts) {
          $('#current-user-address').text(accounts[0]);
        });

      });

      // connect metamask
      $('#connectMetamask').click(function () {
        if (!ethereum.isMetaMask) {
          ethereum.request({
            method: 'eth_requestAccounts'
          });
        } else {
          alert('Metamask Already connected...');
          $(this).prop('disabled', true);
        }

        // show super admin address
        contract.methods.superAdmin().call()
          .then(function (result) {
            $('#super-admin-address').text(result);
          }).catch(function (err) {
            console.log(err)
          });

        web3.eth.getAccounts().then(function (accounts) {
          $('#current-user-address').text(accounts[0]);
        });

      });

      // reload window on account change
      window.ethereum.on('accountsChanged', function (accounts) {
        // window.location.reload();

        web3.eth.getAccounts().then(function (accounts) {
          $('#current-user-address').text(accounts[0]);
        });
      })



      //x-x-x-x-x-x-x-x-x-x-x-x-x--x-x-x-xx--x-x---x-x-x-x-x-x-x--xx
      //                       TEST
      //x-x-x-x-x-x-x-x-x-x-x-x-x--x-x-x-xx--x-x---x-x-x-x-x-x-x--xx    

      // get user
      $('#submit-get-user').click(function () {
        web3.eth.getAccounts().then(function (accounts) {
          let acc = accounts[0];

          if ($('#get-user--address').val().length > 0)
            acc = $('#get-user--address').val();

          contract.methods.users(acc).call()
            .then(function (result) {
              console.log("name:" + result.name + "\n" + "docHash:" + result.docHash + "\n" + "district:" + result.district + "\n" + "isVerified:" + result.isVerified);
            }).catch(function (err) {
              console.log(err)
            });

        });
      });

      // get admin
      $('#submit-get-admin').click(function () {
        web3.eth.getAccounts().then(function (accounts) {
          let acc = accounts[0];

          if ($('#get-admin--address').val().length > 0)
            acc = $('#get-admin--address').val();

          contract.methods.admins(acc).call()
            .then(function (result) {
              console.log("name:" + result.name + "\n" + "district:" + result.district);
            }).catch(function (err) {
              console.log(err)
            });

        });
      });


      // get land data
      $('#submit-get-land').click(function () {
        const sno = $('#get-land--sno').val();
        const sno_byte32 = web3.utils.asciiToHex(sno);

        web3.eth.getAccounts().then(function (accounts) {

          contract.methods.lands(sno_byte32).call()
            .then(function (result) {
              console.log("serveyNo:" + result.serveyNo + "\n" + "location:" + result.location + "\n" + "area:" + result.area + "\n" + "purchaseEpoch:" + result.purchaseEpoch + "\n" + "owner:" + result.owner + "\n" + "district:" + result.district + "\n" + "isVerified:" + result.isVerified + "\n" + "availableForSale:" + result.availableForSale);
            }).catch(function (err) {
              console.log(err)
            });

        });
      });

      // get sell
      $('#submit-get-sell').click(function () {
        const district = $('#get-sell--district').val();
        const index = $('#get-sell--index').val();

        web3.eth.getAccounts().then(function (accounts) {

          contract.methods.allSells(district, index).call()
            .then(function (result) {
              console.log("serveyNo:" + result.serveyNo + "\n" + "owner:" + result.owner + "\n" + "buyer:" + result.buyer + "\n" + "price:" + result.price + "\n" + "sellerApproval:" + result.sellerApproval + "\n" + "adminApproval:" + result.adminApproval);
            }).catch(function (err) {
              console.log(err)
            });

        });
      });

      ////////////////////////////////////////////////

      contract.events.RegUser({
        // filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
        fromBlock: "latest"
      }, function (error, event) { /* console.log(event); */ })
        .on("connected", function (subscriptionId) {
          // console.log("RegUser event subscriptionId: " + subscriptionId);
        })
        .on('data', function (event) {
          console.log(event.returnValues); // same results as the optional callback above
        })
        .on('changed', function (event) {
          // remove event from local database
        })
        .on('error', function (error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
          // ...
        });


    } else {
      alert("Error: not able to retrieve abi and contract address.")
    }
  });

});