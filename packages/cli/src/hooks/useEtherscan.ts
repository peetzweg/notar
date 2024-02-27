import axios from 'axios';
import { ContractInterface } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { useNotar } from '../context/NotarContext';
import { useConfig } from './useConfig';

interface UserEtherscanResult {
  abi?: ContractInterface;
  isLoading: boolean;
  error?: any;
}

export const useEtherscan = (): UserEtherscanResult => {
  const [{ address, network }] = useNotar();
  const config = useConfig();
  const { scan_api_key, scan_url } = useMemo(
    () =>
      config[network.name] || { scan_api_key: undefined, scan_url: undefined },
    [config, network]
  );

  const [state, setState] = useState<UserEtherscanResult>({
    isLoading: true,
    abi: undefined,
    error: false,
  });

  useEffect(() => {
    if (!scan_api_key || !scan_url) {
      setState({ isLoading: false, error: 'Setup in config first' });
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
        // TODO only on verbose
        // console.error({ error });
        setState({ isLoading: false, error: 'Not available' });
      });
  }, [scan_api_key, scan_url]);

  return state;
};
