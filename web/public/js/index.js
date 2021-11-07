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
			});

			// reload window on account change
			// window.ethereum.on('accountsChanged', function (accounts) {
			// 	window.location.reload();
			// })


			/************************
			****** Super Admin ******
			*************************/

			// create admin
			$('#submit-admin-new').click(function () {
				const address = $('#address-admin-new').val();
				const name = $('#name-admin-new').val();
				const district = $('#district-admin-new').val();

				if (address && name && district) {
					web3.eth.getAccounts().then(function (accounts) {
						const acc = accounts[0];

						contract.methods.createModifyAdmin(address, name, district)
							.send({
								from: acc
							})
							.then(function (result) {
								alert("Admin Created/Modified Successfully.");
							}).catch(function (err) {
								console.log(err)
							});

					});
				} else {
					alert("New Admin: Invalid Admin Data");
				}
			});

			/************************
			********* Admin *********
			*************************/

			$('.submit-btn-user-verify').click(function () {
				const address = $('#address-user-verify').val();
				const name = $('#name-user-verify').val();
				const dochash = $('#dochash-user-verify').val();
				const district = $('#district-user-verify').val();

				const isVerified = $(this).attr('id') === "submit-user-verify-accept" ? true : false;

				if (address && name && district && dochash) {
					web3.eth.getAccounts().then(function (accounts) {
						const acc = accounts[0];

						contract.methods.modifyUser(address, name, dochash, district, isVerified)
							.send({
								from: acc
							})
							.then(function (result) {
								alert("User Verified Successfully.");
							}).catch(function (err) {
								console.log(err)
							});
					});
				}

				else {
					alert("Verify User: Invalid User Data");
				}
			});

			// verify land
			$('.submit-btn-land-verify').click(function () {
				const serveyNo = $("#sno-land-verify").val();
				const location = $("#location-land-verify").val();
				const area = $("#area-land-verify").val();
				const purchaseEpoch = $("#epoch-land-verify").val();

				const isVerified = $(this).attr('id') === "submit-land-verify-accept" ? true : false;

				if (serveyNo && location && area > 0 && purchaseEpoch > 0) {
					web3.eth.getAccounts().then(function (accounts) {
						const acc = accounts[0];

						contract.methods.modifyLand(serveyNo, location, area, purchaseEpoch, isVerified)
							.send({
								from: acc
							})
							.then(function (result) {
								alert("Land Verified Successfully.");
							}).catch(function (err) {
								console.log(err)
							});

					});
				} else {
					alert("Verify Land: Invalid Land Data");
				}
			});

			// approve sell
			$('#submit-land-appsell-admin').click(function () {
				const serveyNo = $("#sno-land-appsell-admin").val();

				if (serveyNo) {
					web3.eth.getAccounts().then(function (accounts) {
						const acc = accounts[0];

						contract.methods.approveAdmin(serveyNo)
							.send({
								from: acc
							})
							.then(function (result) {
								alert("Admin Land Approve Sell Request Successfull.");
							}).catch(function (err) {
								console.log(err)
							});
					});
				} else {
					alert("Admin Land Approve Sell: Invalid Land Data");
				}
			});


			/************************
			********* User **********
			*************************/

			// register user
			$('#submit-user-new').click(function () {
				const name = $('#name-user-new').val();
				const district = $('#district-user-new').val();
				const dochash = $('#dochash-user-new').val();
				// sample 29001015306bed5c090106e842a37a5f10265bca4e9fb373fe4468e268cbb88e

				if (name && district && dochash) {
					web3.eth.getAccounts().then(function (accounts) {
						const acc = accounts[0];

						contract.methods.regUser(name, dochash, district)
							.send({
								from: acc
							})
							.then(function (result) {
								alert("User Registered Successfully.");
							}).catch(function (err) {
								console.log(err)
							});

					});
				} else {
					alert("New User: Invalid User Data");
				}
			});

			// register land
			$('#submit-land-new').click(function () {
				const serveyNo = $("#sno-land-new").val();
				const location = $("#location-land-new").val();
				const area = $("#area-land-new").val();
				const purchaseEpoch = $("#epoch-land-new").val();
				const district = $("#district-land-new").val();

				if (serveyNo && location && area > 0 && purchaseEpoch > 0 && district) {
					web3.eth.getAccounts().then(function (accounts) {
						const acc = accounts[0];

						contract.methods.regLand(serveyNo, location, area, purchaseEpoch, district)
							.send({
								from: acc
							})
							.then(function (result) {
								alert("Land Registered Successfully.");
							}).catch(function (err) {
								console.log(err)
							});

					});
				} else {
					alert("New Land: Invalid Land Data");
				}
			});

			// set land availability status
			$('.submit-btn-land-avail').click(function () {
				const status = $(this).attr('id') === "submit-land-avail-avail" ? true : false;
				const serveyNo = $("#sno-land-avail").val();

				if (serveyNo) {
					web3.eth.getAccounts().then(function (accounts) {
						const acc = accounts[0];

						if (status) {
							contract.methods.makeAvailable(serveyNo)
								.send({
									from: acc
								})
								.then(function (result) {
									alert("Land Availability staus - True");
								}).catch(function (err) {
									console.log(err)
								});
						} else {
							contract.methods.cancelAvailable(serveyNo)
								.send({
									from: acc
								})
								.then(function (result) {
									alert("Land Availability staus - False");
								}).catch(function (err) {
									console.log(err)
								});
						}

					});
				} else {
					alert("Land Availability: Invalid Land Data");
				}
			});

			// request to buy
			$('#submit-land-buy').click(function () {
				const serveyNo = $("#sno-land-buy").val();
				const price = $("#price-land-buy").val();

				if (serveyNo && price > 0) {
					web3.eth.getAccounts().then(function (accounts) {
						const acc = accounts[0];

						contract.methods.requestToBuy(serveyNo, price)
							.send({
								from: acc
							})
							.then(function (result) {
								alert("Land Buy Request Successfull.");
							}).catch(function (err) {
								console.log(err)
							});
					});
				} else {
					alert("Land Buy: Invalid Land Data");
				}
			});

			// approve sell
			$('#submit-land-appsell').click(function () {
				const serveyNo = $("#sno-land-appsell").val();

				if (serveyNo) {
					web3.eth.getAccounts().then(function (accounts) {
						const acc = accounts[0];

						contract.methods.approveSell(serveyNo)
							.send({
								from: acc
							})
							.then(function (result) {
								alert("Land Approve Sell Request Successfull.");
							}).catch(function (err) {
								console.log(err)
							});
					});
				} else {
					alert("Land Approve Sell: Invalid Land Data");
				}
			});

			// confirm sell
			$('#submit-land-consell').click(function () {
				const serveyNo = $("#sno-land-consell").val();

				if (serveyNo) {
					web3.eth.getAccounts().then(function (accounts) {
						const acc = accounts[0];

						contract.methods.confirmSell(serveyNo)
							.send({
								from: acc
							})
							.then(function (result) {
								alert("Land Confirm Sell Request Successfull.");
							}).catch(function (err) {
								console.log(err)
							});
					});
				} else {
					alert("Land Confirm Sell: Invalid Land Data");
				}
			});
		} else {
			alert("Error: not able to retrieve abi and contract address.")
		}
	});

});