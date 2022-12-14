import ERC1155 from '@abimate/solmate/ERC1155';
import ERC20 from '@abimate/solmate/ERC20';
import { ContractInterface } from 'ethers';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { useABIs } from '../hooks/useABIs';
import { useEtherscan } from '../hooks/useEtherscan';

const DEFAULT_ABIs = {
  ERC20,
  ERC1155,
};

export interface ABIItem {
  label: string;
  value: ContractInterface;
}

interface ABISelectProps {
  onSuccess: (item: ABIItem) => void;
  abi?: string;
}

const ABISelect: FC<ABISelectProps> = ({ onSuccess, abi }) => {
  const { abis, isLoading } = useABIs();
  const { abi: etherscan, isLoading: etherscanLoading } = useEtherscan();

  const items: ABIItem[] = useMemo(() => {
    const abisFromFiles = Object.entries({ ...DEFAULT_ABIs, ...abis })
      .map(([label, value]) => ({
        label,
        value,
        key: label,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    if (!etherscan) {
      return [
        {
          label: 'etherscan (loading)',
          value: etherscan,
          key: 'etherscan-loading',
        },
        ...abisFromFiles,
      ];
    }
    return [
      { label: 'etherscan', value: etherscan, key: 'etherscan' },
      ...abisFromFiles,
    ];
  }, [abis, etherscan, isLoading]);

  const handleSelect = useCallback(
    (item: ABIItem) => {
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
