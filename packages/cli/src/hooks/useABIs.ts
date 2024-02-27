import { useEffect, useState } from 'react';

import { ContractInterface } from 'ethers';
import fs from 'fs';
import { readdir, readFile } from 'fs/promises';
import { basename, resolve } from 'path';
import { useConfig } from './useConfig';

async function getFiles(dir: string): Promise<Array<string>> {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    })
  );
  return [...files].flat();
}

const readABIs = async (path: string) => {
  const filepaths = (await getFiles(path)).filter((path) =>
    path.endsWith('.json')
  );

  const ABIs: Record<string, Array<ContractInterface>> = {};
  await Promise.all(
    filepaths.map((f) =>
      readFile(f, { encoding: 'utf8' })
        .then((buffer) => {
          // TODO check if array of Fragments
          ABIs[basename(f, '.json')] = JSON.parse(buffer.toString())['abi'];
        })
        .catch(() => {
          // TODO only if verbose flag is set
          // console.warn(`${f} does not contain a valid ABI definition`)
        })
    )
  );
  return ABIs;
};
export const useABIs = () => {
  const [isLoading, setLoading] = useState(true);
  const [abis, setABIs] = useState({});
  const config = useConfig();

  useEffect(() => {
    if (
      config['abi_dir'] &&
      typeof config['abi_dir'] === 'string' &&
      fs.existsSync(config['abi_dir'])
    ) {
      readABIs(config['abi_dir']).then((abis) => {
        setABIs(abis);
        setLoading(false);
      });
    } else {
      // TODO could warn user that given abi_dir does not exist
      setLoading(false);
    }
  }, [config]);
  return { isLoading, abis };
};
