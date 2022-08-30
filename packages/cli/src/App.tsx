import { Contract, ContractInterface, providers } from 'ethers';
import { Box, Text } from 'ink';
import React, { FC, useEffect, useMemo, useState } from 'react';
import ABISelect from './components/ABISelect';
import AddressInput from './components/AddressInput';
import FunctionSelect from './components/FunctionSelect';
import NetworkSelect, { SelectedNetwork } from './components/NetworkSelect';

const App: FC<{ address?: string }> = ({ address: argAddress }) => {
  const [address, setAddress] = useState<undefined | string>();
  const [network, selectNetwork] = useState<undefined | SelectedNetwork>();
  const [abi, setABI] = useState<
    undefined | { label: string; value: ContractInterface }
  >();
  const [contract, setContract] = useState<Contract | undefined>(undefined);
  const provider = useMemo(() => {
    if (!network) return;
    return new providers.JsonRpcProvider(network.rpc);
  }, [network]);

  useEffect(() => {
    if (address && abi) {
      setContract(new Contract(address, abi.value, provider));
    }
  }, [address, abi, provider]);

  return (
    <Box flexDirection="column" width={'100%'}>
      <Box flexDirection="column" width={'50%'}>
        <Box borderStyle="single" flexDirection="column">
          <Text>Network: {network ? network.name : ''}</Text>
          <Text>Address: {address || ''}</Text>
          <Text>ABI: {abi?.label || ''}</Text>
        </Box>
      </Box>
      <Box flexDirection="column" width={'100%'}>
        {!provider ? (
          <NetworkSelect onSuccess={selectNetwork} />
        ) : !address ? (
          <AddressInput onSuccess={setAddress} address={argAddress} />
        ) : !abi ? (
          <ABISelect onSuccess={setABI} />
        ) : contract && abi?.value ? (
          <FunctionSelect contract={contract} />
        ) : null}
      </Box>
    </Box>
  );
};

export default App;
