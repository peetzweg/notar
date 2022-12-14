import { whatsabi } from '@shazow/whatsabi';
import { ContractInterface } from 'ethers';
import { useEffect, useState } from 'react';
import { useNotar } from '../context/NotarContext';

interface UseWhatsabiResult {
  abi?: ContractInterface;
  isLoading: boolean;
  error?: any;
}

export const useWhatsabi = (): UseWhatsabiResult => {
  const [{ provider, address }] = useNotar();
  const [state, setState] = useState<UseWhatsabiResult>({ isLoading: false });
  useEffect(
    function decodeABI() {
      if (!provider || !address) {
        setState({ isLoading: false, abi: undefined });
        return;
      }
      setState({ isLoading: true, abi: undefined });

      provider.getCode(address).then((code) => {
        const abi = whatsabi.abiFromBytecode(code);
        const signatureLookup = new whatsabi.loaders.SamczunSignatureLookup();
        Promise.all(
          abi.map(async (element) => {
            if (element.type !== 'function') return element;

            const [functionName] = await signatureLookup.loadFunctions(
              element.selector
            );
            if (!functionName) return element;

            const [name, argumentsString] = functionName
              .slice(0, -1)
              .split('(');
            const inputs = argumentsString
              .split(',')
              .map((value) => (value ? { type: value } : undefined))
              .filter((input) => !!input);

            return {
              type: element.type,
              name,
              inputs,
              stateMutability: 'view',
              outputs: [{ type: 'bytes32' }],
            };
          })
        ).then((result) => {
          setState({
            isLoading: false,
            abi: result
              .filter((r) => r.type === 'function')
              .filter((r) => !!r.name),
          });
        });
      });
    },
    [provider, address]
  );
  return state;
};
