import { ERC20ABI, ERC4626ABI, ERC721ABI } from "@abimate/solmate";
import { Box, Text } from "ink";
import SelectInput, { Item } from "ink-select-input";
import React, { FC, useCallback, useMemo } from "react";

import { useABIs } from "./hooks/useABIs";
import { useConfig } from "./hooks/useConfig";

const DEFAULT_NETWORKS = {
	ethereum: {
		rpc: "https://rpc.ankr.com/eth",
	},
};

export interface SelectedNetwork {
	rpc: string;
	name: string;
}

interface NetworkSelectProps {
	onSuccess: (item: SelectedNetwork) => void;
}

const NetworkSelect: FC<NetworkSelectProps> = ({ onSuccess }) => {
	const config = useConfig();
	const items = useMemo(() => {
		return Object.entries({
			...DEFAULT_NETWORKS,
			...config,
		})
			.map(([networkName, networkConfig]) => ({
				key: networkName,
				label: networkName,
				value: { name: networkName, ...networkConfig },
			}))
			.sort((a, b) => a.label.localeCompare(b.label));
	}, [config]);

	const handleSelect = useCallback(
		(item: any) => {
			onSuccess(item.value as SelectedNetwork);
		},
		[onSuccess]
	);

	return (
		<Box>
			<Box marginRight={1}>
				<Text>Network:</Text>
			</Box>

			{items && (
				<SelectInput items={items} onSelect={handleSelect} limit={10} />
			)}
		</Box>
	);
};

export default NetworkSelect;
