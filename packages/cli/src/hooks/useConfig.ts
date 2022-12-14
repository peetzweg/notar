import { useMemo } from 'react';
import os from 'os';
import path from 'path';
import fs from 'fs';
import ini from 'ini';

export interface NetworkConfig {
  rpc: `https://${string}`;
  abi_dir?: string;
  scan_url?: `https://${string}`;
  scan_api_key?: string;
}

export interface NotarConfig {
  [networkName: string]: NetworkConfig;
}

export function useConfig(): NotarConfig {
  return useMemo(() => {
    const pathToConfig = path.join(os.homedir() + '/.notarrc');

    if (!fs.existsSync(pathToConfig)) return {};

    const fileData = fs.readFileSync(pathToConfig, 'utf-8');
    try {
      return ini.parse(fileData);
    } catch (error) {
      console.error('Config unable to be loaded. Invalid ini file.', error);
      return {};
    }
  }, []);
}
