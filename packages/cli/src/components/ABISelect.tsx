import { ERC20ABI, ERC4626ABI, ERC721ABI, ERC1155ABI } from '@abimate/solmate';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import React, { FC, useCallback, useEffect, useMemo } from 'react';

import { useABIs } from '../hooks/useABIs';

const DEFAULT_ABIs = {
  ERC20: ERC20ABI,
  ERC721: ERC721ABI,
  ERC1155: ERC1155ABI,
  ERC4626: ERC4626ABI,
};

interface ABISelectProps {
  onSuccess: (item: any) => void;
  abi?: string;
}

const ABISelect: FC<ABISelectProps> = ({ onSuccess, abi }) => {
  const { abis, isLoading } = useABIs();

  const items = useMemo(() => {
    return Object.entries({ ...DEFAULT_ABIs, ...abis })
      .map(([label, value]) => ({
        label,
        value,
        key: label,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [abis, isLoading]);

  const handleSelect = useCallback(
    (item: any) => {
      onSuccess(item);
    },
    [onSuccess]
  );

  useEffect(
    function selectABIArgument() {
      if (abi && items && !isLoading) {
        const abiItem = items.find((item) => item.label === abi);
        if (abiItem) {
          handleSelect(abiItem);
        }
      }
    },
    [abi, items, handleSelect, isLoading]
  );

  return (
    <Box flexDirection="column">
      <Text bold>ABI:</Text>

      {items && (
        <Box flexDirection="column">
          <SelectInput items={items} onSelect={handleSelect} limit={10} />
          {items.length > 10 && <Text>{'\t↓'}</Text>}
        </Box>
      )}
    </Box>
  );
};

export default ABISelect;
