import { BigNumber, Contract } from 'ethers';
import { FunctionFragment } from 'ethers/lib/utils';
import Fuse from 'fuse.js';
import { Box, Static, Text } from 'ink';
import SelectInput from 'ink-select-input';
import TextInput from 'ink-text-input';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useOnBack } from '../hooks/useOnBack';

interface Item {
  label: string;
  value: FunctionFragment;
}

interface CallOutput {
  fragment: FunctionFragment;
  inputs: Array<any>;
  result: any;
  isError?: boolean;
}

interface FunctionSelectProps {
  onBack: () => void;
  contract: Contract;
}

const FunctionSelect = ({ contract, onBack }: FunctionSelectProps) => {
  useOnBack(onBack);
  const [fragment, setFragment] = useState<FunctionFragment | undefined>();
  const [input, setInput] = useState<string>('');
  const [inputs, setInputs] = useState<Array<any>>([]);
  const [outputs, setOutputs] = useState<Array<CallOutput>>([]);
  const [search, setSearch] = useState<string>('');

  const fragmentItems: Array<Item> = useMemo(
    () =>
      contract.interface.fragments
        .filter((fragment) => fragment.type === 'function')
        .map((fragment, index) => ({
          label: `${fragment.name}(${fragment.inputs
            .map((i) => i.name || i.type)
            .join(', ')})`,
          key: fragment.name + fragment.type + index,
          value: fragment as FunctionFragment,
        })),
    [contract]
  );

  const fuse = useMemo(
    () =>
      new Fuse(fragmentItems, {
        keys: ['label'],
      }),
    [fragmentItems]
  );
  const filteredFragmentItems = useMemo(() => {
    if (search.length > 0) return fuse.search(search).map((r) => r.item);
    return fragmentItems;
  }, [fragmentItems, search, fuse]);

  const handleFragmentSelect = useCallback((item: Item) => {
    setSearch('');
    setFragment(item.value);
  }, []);

  const handleInputSubmit = useCallback(
    (input: string) => {
      setInputs((inputs) => [...inputs, input]);
      setInput('');
    },
    [fragment]
  );

  useEffect(() => {
    if (fragment && inputs.length === fragment.inputs.length) {
      try {
        contract.callStatic[fragment.name]!(...inputs)
          .then((result) => {
            setOutputs((outputs) => [
              ...outputs,
              {
                fragment,
                inputs,
                result,
              },
            ]);
          })
          .catch((error) => {
            setOutputs((outputs) => [
              ...outputs,
              {
                fragment,
                inputs,
                result: error,
                isError: true,
              },
            ]);
          })
          .finally(() => {
            setFragment(undefined);
            setInputs([]);
          });
      } catch (exception) {
        console.warn('Something unexpected happened.', exception);
        setFragment(undefined);
        setInputs([]);
      }
    }
  }, [fragment, inputs]);

  return (
    <Box flexDirection="column">
      <Box flexDirection="row">
        <Text bold>Fn:</Text>
        <Box marginLeft={1}>
          {fragment ? (
            <Text bold={true}>
              {`${fragment.name}(${fragment.inputs
                .map((input, index) => inputs[index] || input.type)
                .join(', ')})`}
            </Text>
          ) : (
            <TextInput onChange={(v) => setSearch(v)} value={search} />
          )}
        </Box>
      </Box>
      {!fragment && (
        <Box flexDirection="column">
          <SelectInput
            items={filteredFragmentItems}
            onSelect={handleFragmentSelect}
            limit={10}
          />
          {filteredFragmentItems.length > 10 && <Text>{'\t↓'}</Text>}
        </Box>
      )}

      {fragment && inputs.length < fragment.inputs.length && (
        <Box>
          <Text>
            {`#${inputs.length} ${
              fragment.inputs[inputs.length]?.name || 'unnamed'
            } (${fragment.inputs[inputs.length]?.type})`}
            :
          </Text>

          <TextInput
            onSubmit={handleInputSubmit}
            onChange={setInput}
            value={input}
          />
        </Box>
      )}

      <Static items={outputs}>
        {(output, index) => (
          <Box key={index} flexDirection="column">
            <Text color={output.isError ? 'red' : 'green'}>{`${
              output.fragment.name
            }(${output.fragment.inputs
              .map((input, index) => inputs[index] || input.type)
              .join(', ')}) =>`}</Text>

            <Text>{renderResult(output)}</Text>
          </Box>
        )}
      </Static>
    </Box>
  );
};

function renderResult(output: CallOutput): string {
  if (output.isError) {
    if (output.result.code) {
      const transformedError = transform({
        reason: output.result.reason,
        code: output.result.code,
        data: output.result.data,
        transaction: output.result.transaction,
      });
      return JSON.stringify(transformedError, null, 2);
    } else {
      console.error(output.result);
      return 'UNKNOWN_ERROR';
    }
  }

  const { result } = output;

  const transformedResult = transform(result);

  return JSON.stringify(transformedResult, null, 2);
}

function transform(value: unknown) {
  if (Array.isArray(value)) {
    const entries = Object.entries(value);

    return entries.reduce((acc, [k, v], index) => {
      return { ...acc, [k]: transform(v) };
    }, {});
  } else {
    if (BigNumber.isBigNumber(value)) {
      return `${value.toString()} (${value.toHexString()})`;
    }
    return value;
  }
}

export default FunctionSelect;
