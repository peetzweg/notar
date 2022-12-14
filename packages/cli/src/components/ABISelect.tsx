import ERC1155 from '@abimate/solmate/ERC1155';
import ERC20 from '@abimate/solmate/ERC20';
import ERC721 from '@abimate/solmate/ERC721';
import { ContractInterface } from 'ethers';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { useABIs } from '../hooks/useABIs';
import { useEtherscan } from '../hooks/useEtherscan';

const DEFAULT_ABIs = {
  ERC1155,
  ERC20,
  ERC721,
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
  const { abis: abiFiles, isLoading } = useABIs();
  const { abi: etherscanABI } = useEtherscan();

  const selectItemsOfABIFiles: ABIItem[] = useMemo(
    () =>
      Object.entries({ ...DEFAULT_ABIs, ...abiFiles })
        .map(([label, value]) => ({
          label,
          value,
          key: label,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [abiFiles]
  );
  const selectItemABIEtherscan: ABIItem = useMemo(() => {
    if (etherscanABI)
      return {
        label: 'ABI from Etherscan',
        value: etherscanABI,
        key: 'etherscan',
      };
  }, [etherscanABI]);

  const allSelectItems: ABIItem[] = useMemo(() => {
    return [...selectItemsOfABIFiles, selectItemABIEtherscan].filter(Boolean);
  }, [selectItemsOfABIFiles, selectItemABIEtherscan]);

  const handleSelect = useCallback(
    (item: ABIItem) => {
      onSuccess(item);
    },
    [onSuccess]
  );

  useEffect(
    function selectABIArgument() {
      if (abi && allSelectItems && !isLoading) {
        const abiItem = allSelectItems.find((item) => item.label === abi);
        if (abiItem) {
          handleSelect(abiItem);
        }
      }
    },
    [abi, allSelectItems, handleSelect, isLoading]
  );

  return (
    <Box flexDirection="column">
      <Text bold>ABI:</Text>

      {allSelectItems && (
        <Box flexDirection="column">
          <SelectInput
            items={allSelectItems}
            onSelect={handleSelect}
            limit={10}
          />
          {allSelectItems.length > 10 && <Text>{'\t↓'}</Text>}
        </Box>
      )}
    </Box>
  );
};

export default ABISelect;
