import ERC1155 from '@abimate/solmate/ERC1155';
import ERC20 from '@abimate/solmate/ERC20';
import ERC721 from '@abimate/solmate/ERC721';
import { ContractInterface } from 'ethers';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { useABIs } from '../hooks/useABIs';
import { useEtherscan } from '../hooks/useEtherscan';
import { useOnBack } from '../hooks/useOnBack';

const SELECT_ITEMS_DEFAULT_ABIs = [
  {
    label: 'ERC1155 (solmate)',
    value: ERC1155,
    key: 'ERC1155 (solmate)',
  },
  {
    label: 'ERC721 (solmate)',
    value: ERC721,
    key: 'ERC721 (solmate)',
  },
  {
    label: 'ERC20 (solmate)',
    value: ERC20,
    key: 'ERC20 (solmate)',
  },
];

export interface ABIItem {
  label: string;
  value: ContractInterface;
}

interface ABISelectProps {
  onSuccess: (item: ABIItem) => void;
  onBack: () => void;
  abi?: string;
}

const ABISelect: FC<ABISelectProps> = ({ onSuccess, abi, onBack }) => {
  useOnBack(onBack);
  const { abis: abiFiles, isLoading } = useABIs();
  const {
    abi: etherscanABI,
    isLoading: etherscanLoading,
    error: etherscanError,
  } = useEtherscan();

  const selectItemsOfABIFiles: ABIItem[] = useMemo(
    () =>
      Object.entries({ ...abiFiles })
        .map(([label, value]) => ({
          label,
          value: value as ContractInterface,
          key: label,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [abiFiles]
  );
  const selectItemABIEtherscan: ABIItem = useMemo(() => {
    let label = 'ABI from Etherscan';
    if (etherscanLoading) {
      label += ' (loading)';
    }
    if (etherscanError) {
      label += ` (${etherscanError})`;
    }

    return {
      label,
      value: etherscanABI,
      key: 'etherscan',
    };
  }, [etherscanABI, etherscanError, etherscanLoading]);

  const allSelectItems: ABIItem[] = useMemo(() => {
    return [
      selectItemABIEtherscan,
      ...selectItemsOfABIFiles,
      ...SELECT_ITEMS_DEFAULT_ABIs,
    ].filter(Boolean);
  }, [
    selectItemsOfABIFiles,
    selectItemABIEtherscan,
    SELECT_ITEMS_DEFAULT_ABIs,
  ]);

  const handleSelect = useCallback(
    (item: ABIItem) => {
      if (item.value) onSuccess(item);
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
