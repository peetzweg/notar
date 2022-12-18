import ERC1155 from '@abimate/solmate/ERC1155';
import ERC20 from '@abimate/solmate/ERC20';
import ERC721 from '@abimate/solmate/ERC721';
import { ContractInterface } from 'ethers';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import TextInput from 'ink-text-input';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useABIs } from '../hooks/useABIs';
import { useEtherscan } from '../hooks/useEtherscan';
import { useOnBack } from '../hooks/useOnBack';
import Fuse from 'fuse.js';

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
  key: string;
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
  const [search, setSearch] = useState<string>('');

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
  const fuse = useMemo(
    () =>
      new Fuse(allSelectItems, {
        keys: ['label'],
      }),
    [allSelectItems]
  );
  const filteredSelectItems = useMemo(() => {
    if (search.length > 0) return fuse.search(search).map((r) => r.item);
    return allSelectItems;
  }, [allSelectItems, search, fuse]);

  const handleSelect = useCallback(
    (item: ABIItem) => {
      if (item.value) onSuccess(item);
    },
    [onSuccess]
  );

  useEffect(
    function selectABIArgument() {
      if (abi && allSelectItems && !isLoading) {
        const lowerCaseAbi = abi.toLowerCase();
        const abiItem = allSelectItems.find(
          (item) =>
            (item.label.toLowerCase() === lowerCaseAbi ||
              item.key.toLowerCase() === lowerCaseAbi) &&
            item.value !== undefined
        );
        if (abiItem) {
          handleSelect(abiItem);
        }
      }
    },
    [abi, allSelectItems, handleSelect, isLoading]
  );

  return (
    <Box flexDirection="column">
      <Box flexDirection="row">
        <Box flexDirection="row" marginRight={1}>
          <Text bold>ABI:</Text>
        </Box>
        <TextInput onChange={(v) => setSearch(v)} value={search} />
      </Box>

      {filteredSelectItems && (
        <Box flexDirection="column">
          <SelectInput
            items={filteredSelectItems}
            onSelect={handleSelect}
            limit={10}
          />
          {filteredSelectItems.length > 10 && <Text>{'\t↓'}</Text>}
        </Box>
      )}
    </Box>
  );
};

export default ABISelect;
