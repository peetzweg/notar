import { render } from 'ink';
import React from 'react';
import App from './App';
import commandLineArgs from 'command-line-args';

const options = commandLineArgs([
  { name: 'address', alias: 'a', type: String, defaultOption: true },
  { name: 'network', alias: 'n', type: String },
  { name: 'abi', alias: 'i', type: String },
]);

render(<App {...options} />);
