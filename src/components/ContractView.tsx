import { Contract } from "ethers";
import { Fragment } from "ethers/lib/utils";
import { Box, Text } from "ink";

import React, { FC, useEffect, useMemo, useState } from "react";

type ContractState = Array<{
	fragment: Fragment;
	result: any;
	isError?: boolean;
}>;
const ContractView: FC<{ contract: Contract }> = ({ contract }) => {
	const [state, setState] = useState<ContractState>([]);

	const fragmentItems: Array<Fragment> = useMemo(
		() =>
			contract.interface.fragments.filter(
				(fragment) =>
					fragment.type === "function" && fragment.inputs.length === 0
			),
		[contract]
	);

	useEffect(() => {
		if (!fragmentItems) return;
		const contractState: ContractState = [];
		Promise.all(
			fragmentItems.map(async (f) => {
				const result = await contract.callStatic[f.name]!();
				contractState.push({
					fragment: f,
					result,
				});
			})
		).then(() => {
			setState(
				contractState.sort((a, b) =>
					a.fragment.name.localeCompare(b.fragment.name)
				)
			);
		});
	}, [fragmentItems]);

	return (
		<Box borderStyle="single" flexDirection="column">
			{state.map((value, index) => (
				<Box key={index}>
					<Text>{value.fragment.name + "() = "}</Text>
					<Text>{JSON.stringify(value.result)}</Text>
				</Box>
			))}
		</Box>
	);
};

export default ContractView;
