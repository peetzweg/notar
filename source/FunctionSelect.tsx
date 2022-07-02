import { Contract } from "ethers";
import { Fragment } from "ethers/lib/utils";
import { Box, Static, Text } from "ink";
import SelectInput from "ink-select-input";

import TextInput from "ink-text-input";

import React, { FC, useCallback, useEffect, useMemo, useState } from "react";

interface Item {
	label: string;
	value: Fragment;
}

const FunctionSelect: FC<{ contract: Contract }> = ({ contract }) => {
	const [fragment, setFragment] = useState<Fragment | undefined>();
	const [input, setInput] = useState<string>("");
	const [inputs, setInputs] = useState<Array<any>>([]);
	const [outputs, setOutputs] = useState<
		Array<{
			fragment: Fragment;
			inputs: Array<any>;
			result: any;
			isError?: boolean;
		}>
	>([]);

	const fragmentItems: Array<Item> = useMemo(
		() =>
			contract.interface.fragments
				.filter((fragment) => fragment.type != "event")
				.map((fragment) => ({
					label: `${fragment.name} (${fragment.type})`,
					key: fragment.name + fragment.type,
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
				<Box>
					<Text>Fn:</Text>
					<SelectInput items={fragmentItems} onSelect={handleFragmentSelect} />
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
							={" "}
							{output.isError
								? output.result.code
									? output.result.code
									: "ERROR"
								: JSON.stringify(output.result)}
						</Text>
					</Box>
				)}
			</Static>
		</Box>
	);
};

export default FunctionSelect;
