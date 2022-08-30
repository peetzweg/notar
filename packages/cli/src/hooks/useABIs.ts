import { useEffect, useState } from 'react';

import { readdir, readFile } from 'fs/promises';
import { resolve, basename } from 'path';
import { useConfig } from './useConfig';

async function getFiles(dir: string): Promise<Array<string>> {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    })
  );
  return Array<string>.prototype.concat(...files);
}

const readABIs = async (path: string) => {
  const filepaths = (await getFiles(path)).filter((path) =>
    path.endsWith('.json')
  );
  const ABIs: Record<string, Array<Object>> = {};
  await Promise.all(
    filepaths.map((f) =>
      readFile(f, { encoding: 'utf8' }).then((buffer) => {
        ABIs[basename(f, '.json')] = JSON.parse(buffer.toString())['abi'];
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
    if (config['abi_dir'] && typeof config['abi_dir'] === 'string') {
      readABIs(config['abi_dir']).then((abis) => {
        setABIs(abis);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [config]);
  return { isLoading, abis };
};