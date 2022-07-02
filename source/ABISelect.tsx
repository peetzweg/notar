import { ERC20ABI, ERC721ABI, ERC4626ABI } from "@abimate/solmate";
import { Box, Text } from "ink";
import SelectInput from "ink-select-input";
import React, { FC, useCallback } from "react";

interface ABISelectProps {
	onSuccess: (item: any) => void;
}
const ABISelect: FC<ABISelectProps> = ({ onSuccess }) => {
	const items = [
		{
			label: "ERC20",
			key: "ERC20",
			value: ERC20ABI,
		},
		{
			label: "ERC721",
			key: "ERC721",
			value: ERC721ABI,
		},
		{
			label: "ERC4626",
			key: "ERC4626",
			value: ERC4626ABI,
		},
	];
	const handleSelect = useCallback(
		(item: any) => {
			onSuccess(item);
		},
		[onSuccess]
	);

	return (
		<Box>
			<Box marginRight={1}>
				<Text>ABI:</Text>
			</Box>

			<SelectInput items={items} onSelect={handleSelect} />
		</Box>
	);
};

export default ABISelect;
