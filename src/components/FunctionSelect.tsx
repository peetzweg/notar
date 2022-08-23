import { BigNumber, Contract, utils } from "ethers";
import { Fragment } from "ethers/lib/utils";
import { Box, Static, Text } from "ink";
import SelectInput from "ink-select-input";

import TextInput from "ink-text-input";

import React, { FC, useCallback, useEffect, useMemo, useState } from "react";

interface Item {
	label: string;
	value: Fragment;
}

interface CallOutput {
	fragment: Fragment;
	inputs: Array<any>;
	result: any;
	isError?: boolean;
}

const FunctionSelect: FC<{ contract: Contract }> = ({ contract }) => {
	const [fragment, setFragment] = useState<Fragment | undefined>();
	const [input, setInput] = useState<string>("");
	const [inputs, setInputs] = useState<Array<any>>([]);
	const [outputs, setOutputs] = useState<Array<CallOutput>>([]);

	const fragmentItems: Array<Item> = useMemo(
		() =>
			contract.interface.fragments
				.filter((fragment) => fragment.type != "event")
				.map((fragment, index) => ({
					label: `${fragment.name}(${fragment.inputs
						.map((i) => i.name || i.type)
						.join(", ")})`,
					key: fragment.name + fragment.type + index,
					value: fragment,
				})),
		[contract]
	);

	const handleFragmentSelect = useCallback((item: Item) => {
		setFragment(item.value);
	}, []);

	const handleInputSubmit = useCallback(
		(input: string) => {
			setInputs((inputs) => [...inputs, input]);
			setInput("");
		},
		[fragment]
	);

	useEffect(() => {
		if (fragment && inputs.length === fragment.inputs.length) {
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
		}
	}, [fragment, inputs]);

	return (
		<Box flexDirection="column">
			{!fragment && (
				<Box flexDirection="column">
					<Text backgroundColor={"white"}>Fn:</Text>
					<SelectInput
						items={fragmentItems}
						onSelect={handleFragmentSelect}
						limit={10}
					/>
					{fragmentItems.length > 10 && <Text>...</Text>}
				</Box>
			)}

			{fragment && (
				<Box marginBottom={1}>
					<Text bold={true}>
						{`${fragment.name}(${fragment.inputs
							.map((input, index) => inputs[index] || input.type)
							.join(", ")})`}
					</Text>
				</Box>
			)}

			{fragment && inputs.length < fragment.inputs.length && (
				<Box>
					<Text>
						{`#${inputs.length} ${
							fragment.inputs[inputs.length]?.name || "unnamed"
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
					<Box key={index}>
						<Text color={output.isError ? "red" : "green"}>{`${
							output.fragment.name
						}(${output.fragment.inputs
							.map((input, index) => inputs[index] || input.type)
							.join(", ")})`}</Text>

						<Text bold color={output.isError ? "red" : "green"}>
							{" "}
							= {renderResult(output)}
						</Text>
					</Box>
				)}
			</Static>
		</Box>
	);
};

function renderResult(output: CallOutput) {
	if (output.isError) {
		if (output.result.code) {
			return output.result.code;
		} else {
			("ERROR");
		}
	}

	if (BigNumber.isBigNumber(output.result)) {
		return output.result.toString();
	}

	return JSON.stringify(output.result);
}

export default FunctionSelect;
