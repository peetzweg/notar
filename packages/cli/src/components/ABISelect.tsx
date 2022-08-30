import { ERC20ABI, ERC4626ABI, ERC721ABI, ERC1155ABI } from '@abimate/solmate';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import React, { FC, useCallback, useMemo } from 'react';

import { useABIs } from '../hooks/useABIs';

const DEFAULT_ABIs = [
  {
    label: 'ERC20 (solmate)',
    key: 'ERC20 (solmate)',
    value: ERC20ABI,
  },
  {
    label: 'ERC721 (solmate)',
    key: 'ERC721 (solmate)',
    value: ERC721ABI,
  },
  {
    label: 'ERC1155 (solmate)',
    key: 'ERC1155 (solmate)',
    value: ERC1155ABI,
  },
  {
    label: 'ERC4626 (solmate)',
    key: 'ERC4626 (solmate)',
    value: ERC4626ABI,
  },
];

interface ABISelectProps {
  onSuccess: (item: any) => void;
}

const ABISelect: FC<ABISelectProps> = ({ onSuccess }) => {
  const { abis, isLoading } = useABIs();
  const items = useMemo(() => {
    return [
      ...Object.entries(abis).map(([label, value]) => ({
        label,
        value,
        key: label,
      })),
      ...DEFAULT_ABIs,
    ].sort((a, b) => a.label.localeCompare(b.label));
  }, [abis, isLoading]);

  const handleSelect = useCallback(
    (item: any) => {
      onSuccess(item);
    },
    [onSuccess]
  );

  return (
    <Box>
      <Box marginRight={1}>
        <Text>ABI:</Text>
      </Box>

      {items && (
        <SelectInput items={items} onSelect={handleSelect} limit={10} />
      )}
    </Box>
  );
};

export default ABISelect;
