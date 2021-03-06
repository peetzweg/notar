import { utils } from "ethers";
import { Box, Text } from "ink";
import { UncontrolledTextInput } from "ink-text-input";
import React, { FC, useCallback, useEffect } from "react";

interface InputProps {
	address?: string;
	onSuccess: (address: string) => void;
}
const AddressInput: FC<InputProps> = ({ address, onSuccess }) => {
	const handleSubmit = useCallback(
		(rawAddress: string) => {
			try {
				const validAddress = utils.getAddress(rawAddress);
				if (validAddress) {
					onSuccess(validAddress);
				}
			} catch (e) {
				console.log({ e });
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
				<Text>Enter Address:</Text>
			</Box>

			<UncontrolledTextInput
				initialValue={address || ""}
				onSubmit={handleSubmit}
			/>
		</Box>
	);
};

export default AddressInput;
