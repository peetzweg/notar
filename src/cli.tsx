#!/usr/bin/env node
import "dotenv/config";
import React from "react";
import { render } from "ink";
import meow from "meow";
import App from "./App";

const cli = meow(
	`
	Usage
	  $ lens
`,
	{
		flags: {
			address: {
				type: "string",
			},
			// network, erc4626
			// abi, myPool
		},
	}
);

render(<App address={cli.flags.address} />);
