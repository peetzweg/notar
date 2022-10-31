import { Contract, providers } from 'ethers';
import React, { useCallback, useContext, useState } from 'react';
import { ABIItem } from '../components/ABISelect';
import { SelectedNetwork } from '../components/NetworkSelect';
import { useConfig } from '../hooks/useConfig';

interface NotarState {
  address?: string;
  abi?: ABIItem;
  network?: SelectedNetwork;
  provider?: providers.JsonRpcProvider;
  contract?: Contract;
}

type UpdateStateFunction = (newContext: Partial<NotarState>) => void;

interface NotarContext {
  updateContext: UpdateStateFunction;
  state: NotarState;
}

const initialValue: NotarContext = {
  updateContext: () => {},
  state: {},
};

const Context = React.createContext<NotarContext>(initialValue);

interface NotarContextProviderProps {
  children: React.ReactNode;
  address?: string;
  abi?: string;
  network?: string;
}

export const NotarContextProvider = ({
  children,
  address: addressArg,
  abi: abiArg,
  network: networkArg,
}: NotarContextProviderProps) => {
  const config = useConfig();
  const [state, setState] = useState<NotarState>({});
  const updateContext = useCallback(
    (newContext: Partial<NotarState>) => {
      setState((prevState) => {
        const newState = { ...prevState, ...newContext };

        // Create Provider and Contract if everything is available
        if (newState.address && newState.abi && newState.network) {
          newState.provider = new providers.JsonRpcProvider(
            newState.network.rpc
          );

          newState.contract = new Contract(
            newState.address,
            newState.abi.value,
            newState.provider
          );
        }
        return newState;
      });
    },
    [setState]
  );

  return (
    <Context.Provider
      value={{
        updateContext,
        state,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useNotar = (): [NotarState, UpdateStateFunction] => {
  const { state, updateContext } = useContext(Context);
  return [state, updateContext];
};
