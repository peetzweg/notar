import { useMemo } from "react";
import os from "os";
import path from "path";
import fs from "fs";
import ini from "ini";

interface Config {
	[networkName: string]: {
		rpc: string;
		abi_dir?: string;
	};
}

export function useConfig(): Config {
	return useMemo(() => {
		const pathToConfig = path.join(os.homedir() + "/.lensrc");

		if (!fs.existsSync(pathToConfig)) return {};

		const fileData = fs.readFileSync(pathToConfig, "utf-8");
		try {
			return ini.parse(fileData);
		} catch (error) {
			console.error("Config unable to be loaded. Invalid ini file.", error);
			return {};
		}
	}, []);
}
