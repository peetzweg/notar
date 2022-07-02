#!/usr/bin/env node
import "dotenv/config";
import React from "react";
import { render } from "ink";
import meow from "meow";
import App from "./App";

const cli = meow(
	`
	Usage
	  $ notar
`,
	{
		flags: {
			address: {
				type: "string",
			},
		},
	}
);

render(<App address={cli.flags.address} />);
