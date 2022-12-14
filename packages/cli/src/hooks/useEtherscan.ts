import { ContractInterface } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { useNotar } from '../context/NotarContext';
import { useConfig } from './useConfig';
import axios from 'axios';

interface UserEtherscanResult {
  abi?: ContractInterface;
  isLoading: boolean;
  error?: any;
}

export const useEtherscan = (): UserEtherscanResult => {
  const [{ provider, address, network }] = useNotar();
  const config = useConfig();
  const { scan_api_key, scan_url } = useMemo(
    () => config[network.name],
    [config, network]
  );
  const [state, setState] = useState<UserEtherscanResult>({
    isLoading: false,
    abi: undefined,
    error: false,
  });

  useEffect(() => {
    if (!scan_api_key || !scan_url) {
      return;
    }
    setState({ isLoading: true });
    const getURL = `${scan_url}/api?module=contract&action=getabi&address=${address}&apikey=${scan_api_key}`;
    axios
      .get(getURL)
      .then((response) => {
        const abi = JSON.parse(response.data.result);
        setState({ isLoading: false, abi });
      })
      .catch((error) => {
        console.error({ error });
        setState({ isLoading: false, error });
      });
  }, [scan_api_key, scan_url]);

  return state;
};
