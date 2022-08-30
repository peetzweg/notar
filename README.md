# notar

Proof of concept for command line debugging tool using [ink](https://github.com/vadimdemedes/ink) and [abimate](https://github.com/peetzweg/abimate).

Project generated with [create-ink-app](https://github.com/vadimdemedes/create-ink-app).


![demo](demo.gif)

## Configuration

`notar` can be configured by creating a `.notarrc` file in your `$HOME` directory. The configuration should follow the [`ini` format](https://en.wikipedia.org/wiki/INI_file).



Example Config
```ini
; Global definition of folder which contains `ethers` compatible ABIs.
abi_dir=~/.abis

;Section header => network name
[bsc]
;network rpc url
rpc=https://bsc-dataseed.binance.org/

[moonbeam]
rpc=https://moonbeam.public.blastapi.io

[polygon]
rpc=https://rpc-mainnet.matic.quiknode.pro
```



## Install & Contribute

`npm install`

`npm run start`