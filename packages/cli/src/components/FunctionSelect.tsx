import { BigNumber, Contract } from 'ethers';
import { FunctionFragment } from 'ethers/lib/utils';
import { Box, Static, Text } from 'ink';
import SelectInput from 'ink-select-input';

import TextInput from 'ink-text-input';

import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

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

const FunctionSelect: FC<{ contract: Contract }> = ({ contract }) => {
  const [fragment, setFragment] = useState<FunctionFragment | undefined>();
  const [input, setInput] = useState<string>('');
  const [inputs, setInputs] = useState<Array<any>>([]);
  const [outputs, setOutputs] = useState<Array<CallOutput>>([]);

  const fragmentItems: Array<Item> = useMemo(
    () =>
      contract.interface.fragments
        .filter((fragment) => fragment.type != 'event')
        .map((fragment, index) => ({
          label: `${fragment.name}(${fragment.inputs
            .map((i) => i.name || i.type)
            .join(', ')})`,
          key: fragment.name + fragment.type + index,
          value: fragment as FunctionFragment,
        })),
    [contract]
  );

  const handleFragmentSelect = useCallback((item: Item) => {
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
        console.warn('Something unexpected happened.');
        setFragment(undefined);
        setInputs([]);
      }
    }
  }, [fragment, inputs]);

  return (
    <Box flexDirection="column">
      <Text bold>Fn:</Text>
      {!fragment && (
        <Box flexDirection="column">
          <SelectInput
            items={fragmentItems}
            onSelect={handleFragmentSelect}
            limit={10}
          />
          {fragmentItems.length > 10 && <Text>{'\t↓'}</Text>}
        </Box>
      )}

      {fragment && (
        <Box marginBottom={1}>
          <Text bold={true}>
            {`${fragment.name}(${fragment.inputs
              .map((input, index) => inputs[index] || input.type)
              .join(', ')})`}
          </Text>
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
            <br />
            <Text bold color={output.isError ? 'red' : 'green'}>
              {renderResult(output)}
            </Text>
          </Box>
        )}
      </Static>
    </Box>
  );
};

function renderResult(output: CallOutput): string {
  if (output.isError) {
    console.error(output.result);
    if (output.result.code) {
      return output.result.code;
    } else {
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
      console.log({ k, v });
      return { ...acc, [k]: transform(v) };
    }, {});
  } else {
    if (BigNumber.isBigNumber(value)) {
      return `${value.toString()} (${value.toHexString()})`;
    }
    return value;
  }
}

// function transformPrev(value: unknown) {
//   console.log({ value, entries: Object.entries(value) });
//   if (Array.isArray(value)) {
//     return value.map((element, index) => transform(element));
//   } else {
//     if (BigNumber.isBigNumber(value)) {
//       return `${value.toString()} (${value.toHexString()})`;
//     }
//     return value;
//   }
// }

export default FunctionSelect;
