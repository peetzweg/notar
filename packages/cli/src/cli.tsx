#!/usr/bin/env node
import { render } from 'ink';
import React from 'react';
import App from './App';
import meow from 'meow';

const cli = meow(
  `
	Usage
	  $ notar

	Options
	  --address, -a  preselect smart contract address
	  --network, -n  preselect network
	  --abi, -i  preselect abi

	Examples
	  $ notar -n ethereum -a 0x956F47F50A910163D8BF957Cf5846D573E7f87CA -i ERC20

`,
  {
    flags: {
      address: {
        type: 'string',
        alias: 'a',
      },
      network: {
        type: 'string',
        alias: 'n',
      },
      abi: {
        type: 'string',
        alias: 'i',
      },
    },
  }
);
render(<App {...cli.flags} />);
