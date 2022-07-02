import { Contract, ContractInterface, ethers } from "ethers";
import { Box, Text } from "ink";
import React, { FC, useEffect, useMemo, useState } from "react";
import ABISelect from "./ABISelect";
import AddressInput from "./AddressInput";
import FunctionSelect from "./FunctionSelect";

const App: FC<{ address?: string }> = ({ address: argAddress }) => {
	const [address, setAddress] = useState<undefined | string>();
	const [abi, setABI] = useState<
		undefined | { label: string; value: ContractInterface }
	>();
	const [contract, setContract] = useState<Contract | undefined>(undefined);
	const provider = useMemo(
		() => new ethers.providers.JsonRpcProvider(process.env["PROVIDER_URL"]),
		[]
	);

	useEffect(() => {
		if (address && abi) {
			setContract(new Contract(address, abi.value, provider));
		}
	}, [address, abi, provider]);

	return (
		<Box flexDirection="column">
			<Box borderStyle="single" flexDirection="column">
				<Text>Provider: 'env.PROVIDER_URL'</Text>
				<Text>Address: {address || ""}</Text>
				<Text>ABI: {abi?.label || ""}</Text>
			</Box>

			{!address ? (
				<AddressInput onSuccess={setAddress} address={argAddress} />
			) : !abi ? (
				<ABISelect onSuccess={setABI} />
			) : contract && abi?.value ? (
				<FunctionSelect contract={contract} />
			) : null}
		</Box>
	);
};

module.exports = App;
export default App;
