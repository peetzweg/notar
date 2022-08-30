import { Contract, ContractInterface, providers } from 'ethers';
import { Box, Text } from 'ink';
import React, { FC, useEffect, useMemo, useState } from 'react';
import ABISelect from './components/ABISelect';
import AddressInput from './components/AddressInput';
import FunctionSelect from './components/FunctionSelect';
import NetworkSelect, { SelectedNetwork } from './components/NetworkSelect';

interface AppProps {
  address?: string;
  abi?: string;
  network?: string;
}
const App: FC<AppProps> = ({
  address: argAddress,
  abi: argABI,
  network: argNetwork,
}) => {
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
    <Box flexDirection="column" width={'100%'} height={'100%'}>
      <Box flexDirection="row" width={'100%'}>
        {network && (
          <Box>
            <Text
              backgroundColor={'#585858'}
              color="white"
              bold
            >{` ${network.name} `}</Text>
          </Box>
        )}
        {address && (
          <Box>
            <Text
              backgroundColor={'#585858'}
              color="white"
              bold
            >{`❯ ${address} `}</Text>
          </Box>
        )}
        {abi && abi.label && (
          <Box>
            <Text
              backgroundColor={'#585858'}
              color="white"
              bold
            >{`❯ ${abi?.label} `}</Text>
          </Box>
        )}
      </Box>
      <Box flexDirection="column" width={'100%'}>
        {!provider ? (
          <NetworkSelect onSuccess={selectNetwork} network={argNetwork} />
        ) : !address ? (
          <AddressInput onSuccess={setAddress} address={argAddress} />
        ) : !abi ? (
          <ABISelect onSuccess={setABI} abi={argABI} />
        ) : contract && abi?.value ? (
          <FunctionSelect contract={contract} />
        ) : null}
      </Box>
    </Box>
  );
};

export default App;
