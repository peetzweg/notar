import { render } from 'ink';
import React from 'react';
import App from './App';
import commandLineArgs from 'command-line-args';
import { NotarContextProvider } from './context/NotarContext';

const options: {
  address: string;
  network: string;
  abi: string;
} = commandLineArgs([
  { name: 'address', alias: 'a', type: String, defaultOption: true },
  { name: 'network', alias: 'n', type: String },
  { name: 'abi', alias: 'i', type: String },
]);

render(
  <NotarContextProvider>
    <App
      {...options}
      network="bsc"
      address="0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d"
    />
  </NotarContextProvider>
);
