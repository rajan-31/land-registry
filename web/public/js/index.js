let contract;

$(document).ready(function() {
    const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");

    // contract address
    const address = '0x9D4d04612B078A676CAa740a33bd7f93D69642B3'
    const abi = [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "admins",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "district",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "allSells",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "serveyNo",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "buyer",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "sellerApproval",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "adminApproval",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_serveyNo",
                    "type": "string"
                }
            ],
            "name": "approveAdmin",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_serveyNo",
                    "type": "string"
                }
            ],
            "name": "approveSell",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_serveyNo",
                    "type": "string"
                }
            ],
            "name": "cancelAvailable",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_serveyNo",
                    "type": "string"
                }
            ],
            "name": "confirmSell",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_address",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_district",
                    "type": "string"
                }
            ],
            "name": "createModifyAdmin",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "name": "lands",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "serveyNo",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "location",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "area",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "purchaseEpoch",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "district",
                    "type": "string"
                },
                {
                    "internalType": "bool",
                    "name": "isVerified",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "availableForSale",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_serveyNo",
                    "type": "string"
                }
            ],
            "name": "makeAvailable",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_serveyNo",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_location",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_area",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_purchaseEpoch",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "_isVerified",
                    "type": "bool"
                }
            ],
            "name": "modifyLand",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_address",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_docHash",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_district",
                    "type": "string"
                },
                {
                    "internalType": "bool",
                    "name": "_isVerified",
                    "type": "bool"
                }
            ],
            "name": "modifyUser",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_serveyNo",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_location",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_area",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_purchaseEpoch",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "_district",
                    "type": "string"
                }
            ],
            "name": "regLand",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_docHash",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_district",
                    "type": "string"
                }
            ],
            "name": "regUser",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_serveyNo",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_price",
                    "type": "uint256"
                }
            ],
            "name": "requestToBuy",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "source",
                    "type": "string"
                }
            ],
            "name": "stringToBytes32",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "result",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "pure",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "users",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "docHash",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "district",
                    "type": "string"
                },
                {
                    "internalType": "bool",
                    "name": "isVerified",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]

    contract = new web3.eth.Contract(abi, address);

    // check metamask connection
    web3.eth.getAccounts().then(function(accounts) {
        if (!ethereum.isMetaMask || accounts.length < 1) {
            ethereum.request({
                method: 'eth_requestAccounts'
            });
        } else {
            $('#connectMetamask').html("Metamask Is Connected")
            $('#connectMetamask').prop('disabled', true);
        }
    });

    // connect metamask
    $('#connectMetamask').click(function() {
        if (!ethereum.isMetaMask) {
            ethereum.request({
                method: 'eth_requestAccounts'
            });
        } else {
            alert('Metamask Already connected...');
            $(this).prop('disabled', true);
        }
    });

    // reload window on account change
    window.ethereum.on('accountsChanged', function(accounts) {
        window.location.reload();
    })

    // add campaign
    /* $('#create-new').click(function() {
        const name = $('#name').val();
        const targetAmt = $('#target-amt').val() //web3.utils.toWei($('#target-amt').val(), 'ether');
        const duration = parseInt($('#duration').val());

        if (name && targetAmt > 0 && duration > 0) {
            web3.eth.getAccounts().then(function(accounts) {
                const acc = accounts[0];

                contract.methods.newCF(name, targetAmt, duration)
                    .send({
                        from: acc
                    })
                    .then(function(result) {
                        alert("Campaign Creted Successfully, please refresh the page.");
                        window.location.reload();
                    }).catch(function(err) {
                        console.log(err)
                    });

            });

        }
    }); */

    // register user
    $('#submit-user-new').click(function() {
        
    });

});