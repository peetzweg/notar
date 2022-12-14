import { Box, Text } from 'ink';
import React, { FC } from 'react';
import ABISelect from './components/ABISelect';
import AddressInput from './components/AddressInput';
import FunctionSelect from './components/FunctionSelect';
import NetworkSelect from './components/NetworkSelect';
import { useNotar } from './context/NotarContext';

interface AppProps {
  address?: string;
  abi?: string;
  network?: string;
}
const App: FC<AppProps> = ({
  address: addressArg,
  abi: abiArg,
  network: networkArg,
}) => {
  const [{ address, abi, network, contract }, setState] = useNotar();

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
        {abi && (
          <Box>
            <Text
              backgroundColor={'#585858'}
              color="white"
              bold
            >{`❯ ${abi.label} `}</Text>
          </Box>
        )}
      </Box>
      <Box flexDirection="column" width={'100%'}>
        {!network ? (
          <NetworkSelect
            onSuccess={(network) =>
              setState({
                network,
              })
            }
            network={networkArg}
          />
        ) : !address ? (
          <AddressInput
            onSuccess={(address) => {
              setState({ address });
            }}
            address={addressArg}
          />
        ) : !abi ? (
          <ABISelect onSuccess={(abi) => setState({ abi })} abi={abiArg} />
        ) : contract ? (
          <FunctionSelect contract={contract} />
        ) : null}
      </Box>
    </Box>
  );
};

export default App;
