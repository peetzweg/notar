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
    <App {...options} />
  </NotarContextProvider>
);
