### Truffle Steps

- `truffle init`
- Add Contracts to "contracts" folder
- `truffle compile`
- Add/Create  migrations file
- `truffle migrate --network ganache`

---
####ROUGH####

```
Remove-Item .\build\contracts\*
truffle compile
truffle migrate --network ganache
```

### Change abi at 3 places: index.js, test.js, .env
### remove public from superAdmin in solidity contarct
### change network id in script (5777)

---

## STEPS

### Initial

cd truffle

set correct network parameters in "truffle-config.js"

set deployer address in migration file for deploying contracts

run run-ganache.ps1 (it will start ganache test network)

run dep-mig-copy.ps1 (it will deploy the contract)

\
\
`cd web`

create `.env` file by taking the reference of `.env.sample` file (in the same folder where .env.sample is present)

*if you don't want to modify any file in web folder

`node app.js` (it will copy the new abi and new contract address in public/contract_details.json file)

\
*if you want to modify files in web folder

`npm run dev`

### After contract update

`cd web`

restart web server (it will copy the new abi and new contract address in public/contract_details.json file)
