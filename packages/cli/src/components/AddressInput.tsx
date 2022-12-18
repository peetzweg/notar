import { utils } from 'ethers';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useOnBack } from '../hooks/useOnBack';

interface InputProps {
  address?: string;
  onSuccess: (address: string) => void;
  onBack: () => void;
}
const AddressInput: FC<InputProps> = ({ address, onSuccess, onBack }) => {
  useOnBack(onBack);
  const [value, setValue] = useState(address || '');
  const handleSubmit = useCallback(
    (rawAddress: string) => {
      if (rawAddress === undefined || rawAddress.trim().length === 0) return;
      try {
        const validAddress = utils.getAddress(rawAddress);
        if (validAddress) {
          onSuccess(validAddress);
        }
      } catch (e) {
        console.error(`'${rawAddress}' is not valid address.`);
        setValue('');
      }
    },
    [onSuccess]
  );

  useEffect(() => {
    if (address) {
      handleSubmit(address);
    }
  }, [address]);

  return (
    <Box>
      <Box marginRight={1}>
        <Text bold>Address:</Text>
      </Box>

      <TextInput
        onChange={setValue}
        value={value}
        onSubmit={() => handleSubmit(value)}
      />
    </Box>
  );
};

export default AddressInput;
