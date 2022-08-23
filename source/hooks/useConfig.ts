import { useMemo } from "react";
import os from "os";
import path from "path";
import fs from "fs";

interface Config {
	[networkName: string]: {
		rpc: string;
	};
}

export function useConfig(): Config {
	return useMemo(() => {
		const fileData = fs.readFileSync(path.join(os.homedir() + "/.notarrc"));
		return JSON.parse(fileData.toString());
	}, []);
}
