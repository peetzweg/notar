# notar (npm-package: `notar-cli`)

=> [npmjs.com/package/notar-cli](https://www.npmjs.com/package/notar-cli)

Concept piece of software to interact with smart-contracts on EVM based chains directly from your terminal. This allows for quick access and shortcut building using the shell builtins like [`alias`](https://man7.org/linux/man-pages/man1/alias.1p.html).

![demo](https://user-images.githubusercontent.com/7098556/192083999-e831199f-2479-4ed3-aef9-2f849975f2ae.gif)

Create custom `token` command to inspect ERC20 tokens:

![demo_alias](https://user-images.githubusercontent.com/7098556/192084005-57dd3ee0-51ef-4f14-9e81-0f9a7ed69ff8.gif)

## How to Install

```sh
npm install --global notar-cli
```

or use it via `npx`

```sh
npx notar-cli
```

## How to Use

```sh
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

`notar` has an default ethereum RPC setup (https://rpc.ankr.com/eth) and packaged with some [ABIs](https://github.com/peetzweg/notar/blob/6647ccdb9b5b6532bcf681580bbb93477a219aa9/packages/cli/src/components/ABISelect.tsx#L8-L13) out of the box.

However, `notar` can be configured to your liking by creating a `.notarrc` file in your `$HOME` directory. The configuration should follow the [`ini` format](https://en.wikipedia.org/wiki/INI_file). You can easily add your own ABI files as well as connect to other EVM compatible networks.

Example Config

`~/.notarrc`

```ini
; Global
abi_dir=~/.abis ; Folder which contains `ethers` compatible ABIs

; Sections
[bsc] ; Section header => network name
rpc=https://bsc-dataseed.binance.org/ ; rpc url


[polygon]
rpc=https://rpc-mainnet.matic.quiknode.pro

[moonbeam]
rpc=https://moonbeam.public.blastapi.io
```

## Fetch ABIs from Etherscan

Notar is able to fetch ABIs of verified contracts directly from [Etherscan](https://etherscan.io/) and others alike. In order to do this it needs the API url of the scanner and a valid API key. It's setup like this to support all chains which have an Etherscan equivalent.

`~/.notarrc`

```ini
[ethereum]
rpc=https://rpc.ankr.com/eth
scan_url=https://api.etherscan.io/
scan_api_key=YOUR_API_KEY
```

## Special Thanks

This cli is built with [ink](https://github.com/vadimdemedes/ink), [abimate](https://github.com/peetzweg/abimate) and [ethers](https://github.com/ethers-io/ethers.js/).
