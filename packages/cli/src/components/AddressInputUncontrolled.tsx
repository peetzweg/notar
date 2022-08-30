import { utils } from 'ethers';
import { Box, Text } from 'ink';
import { UncontrolledTextInput } from 'ink-text-input';
import React, { FC, useCallback, useEffect, useState } from 'react';

interface InputProps {
  address?: string;
  onSuccess: (address: string) => void;
}
const AddressInput: FC<InputProps> = ({ address, onSuccess }) => {
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

      <UncontrolledTextInput initialValue={address} onSubmit={handleSubmit} />
    </Box>
  );
};

export default AddressInput;
