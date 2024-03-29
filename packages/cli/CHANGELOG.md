# Change Log

## [1.3.2] - 2024-02-27

### Fixed

+ handles missing etherscan config fields gracefully
+ skips search for local abis if given abi folder does not exist

## [1.3.1] - 2023-01-17

### Fixed

+ filters out all non `function` type fragments

## [1.3.0] - 2022-12-18

### Added

+ ability to search items of network, abi and function select dialogs.

## [1.2.1] - 2022-12-16

### Fixed

+ using left arrow to navigate back from ABI selection wasn't removing the previous selected abi.

### Changed

+ 'Etherscan' ABI can now be preselected from the cli arguments using the `--abi/-i` flag

## [1.2.0] - 2022-12-14

### Added

+ ability to fetch ABIs from Etherscan services, needs `scan_url` and `scan_api_key` to be set for chain in the `.notarrc` file

+ navigate to previous step via left arrow key

### Changed

+ formats call responses differently. Successfully responses as well as call exceptions should be better readable

## [1.1.4] - 2022-10-02

### Fixed

+ makes sure to mark latest published bundle marked as `latest`


## [1.1.3] - 2022-10-01

### Changed

+ removes gif files from bundled package to reduce it's size

### Fixed

+ prevents crash if a single file in ABI path is not in correct format
