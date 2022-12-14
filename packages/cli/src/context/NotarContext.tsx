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

        if (newState.network && !newState.provider) {
          newState.provider = new providers.JsonRpcProvider(
            newState.network.rpc
          );
        }

        if (
          newState.abi &&
          !newState.contract &&
          newState.provider &&
          newState.address
        ) {
          try {
            newState.contract = new Contract(
              newState.address,
              newState.abi.value,
              newState.provider
            );
          } catch (exception) {
            console.error(exception);
          }
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
