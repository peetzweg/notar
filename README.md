# notar (npm-package: `notar-cli`)

=> [npmjs.com/package/notar-cli](https://www.npmjs.com/package/notar-cli)

Concept piece of software to interact with smart-contracts on EVM based chains directly from your terminal. This allows for quick access and shortcut building using the shell powers like [`alias`](https://man7.org/linux/man-pages/man1/alias.1p.html).


![demo](demo.gif)


## How to Install

```
npm install --global notar-cli

notar
```

or use it via `npx`

```
npx notar-cli
```

## How to Use

```
  Usage
    $ notar

  Options
    --address, -a  preselect smart contract address
    --network, -n  preselect network
    --abi, -i  preselect abi

  Examples
    $ notar -n ethereum -a 0x956F47F50A910163D8BF957Cf5846D573E7f87CA -i ERC20
```

## Configuration

`notar` can be configured by creating a `.notarrc` file in your `$HOME` directory. The configuration should follow the [`ini` format](https://en.wikipedia.org/wiki/INI_file).



Example Config
```ini
; Global
abi_dir=~/.abis ; Folder which contains `ethers` compatible ABIs

; Sections
[bsc] ; Section header => network name
rpc=https://bsc-dataseed.binance.org/ ; rpc url

[moonbeam]
rpc=https://moonbeam.public.blastapi.io

[polygon]
rpc=https://rpc-mainnet.matic.quiknode.pro
```



## Special Thanks

This cli is built with [ink](https://github.com/vadimdemedes/ink), [abimate](https://github.com/peetzweg/abimate) and [ethers](https://github.com/ethers-io/ethers.js/).