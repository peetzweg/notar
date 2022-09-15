const { merge } = require('webpack-merge');
const ShebangPlugin = require('webpack-shebang-plugin');

module.exports = (config, context) => {
  return merge(config, {
    target: 'node',
    plugins: [new ShebangPlugin()],
    resolve: {
      alias: {
        ethers: 'ethers/lib',
        '@ethersproject/abi': '@ethersproject/abi/lib',
        '@ethersproject/abstract-provider':
          '@ethersproject/abstract-provider/lib',
        '@ethersproject/abstract-signer': '@ethersproject/abstract-signer/lib',
        '@ethersproject/address': '@ethersproject/address/lib',
        '@ethersproject/base64': '@ethersproject/base64/lib',
        '@ethersproject/basex': '@ethersproject/basex/lib',
        '@ethersproject/bignumber': '@ethersproject/bignumber/lib',
        '@ethersproject/bytes': '@ethersproject/bytes/lib',
        '@ethersproject/constants': '@ethersproject/constants/lib',
        '@ethersproject/contracts': '@ethersproject/contracts/lib',
        '@ethersproject/hash': '@ethersproject/hash/lib',
        '@ethersproject/hdnode': '@ethersproject/hdnode/lib',
        '@ethersproject/json-wallets': '@ethersproject/json-wallets/lib',
        '@ethersproject/keccak256': '@ethersproject/keccak256/lib',
        '@ethersproject/logger': '@ethersproject/logger/lib',
        '@ethersproject/networks': '@ethersproject/networks/lib',
        '@ethersproject/pbkdf2': '@ethersproject/pbkdf2/lib',
        '@ethersproject/properties': '@ethersproject/properties/lib',
        '@ethersproject/providers': '@ethersproject/providers/lib',
        '@ethersproject/random': '@ethersproject/random/lib',
        '@ethersproject/rlp': '@ethersproject/rlp/lib',
        '@ethersproject/sha2': '@ethersproject/sha2/lib',
        '@ethersproject/signing-key': '@ethersproject/signing-key/lib',
        '@ethersproject/solidity': '@ethersproject/solidity/lib',
        '@ethersproject/strings': '@ethersproject/strings/lib',
        '@ethersproject/transactions': '@ethersproject/transactions/lib',
        '@ethersproject/units': '@ethersproject/units/lib',
        '@ethersproject/wallet': '@ethersproject/wallet/lib',
        '@ethersproject/web': '@ethersproject/web/lib',
        '@ethersproject/wordlists': '@ethersproject/wordlists/lib',
      },
    },
  });
};
