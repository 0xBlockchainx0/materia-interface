# Materia Interface


An open source interface for Materia -- a protocol for decentralized exchange of Ethereum tokens.

- Website: [materiadex.com](https://materiadex.com/)
- Interface: [materia.exchange](https://materia.exchange)
- Docs: [materiadex.com/docs/](https://materiadex.com/docs/)
- Twitter: [@MateriaDex](https://twitter.com/MateriaDex)
- Reddit: [/r/Materia](https://www.reddit.com/r/Materia/)
- Email: [contact@materiadex.com](mailto:contact@materiadex.com)
- Discord: [Materia](https://discord.gg/jdYMZrv)

## Accessing the Materia Interface

To access the Materia Interface, use an IPFS gateway link from the
[latest release](https://github.com/materia-dex/materia-interface/releases/latest), 
or visit [materia.exchange](https://materia.exchange).

## Listing a token

Please see the
[@materia-dex/default-token-list](https://github.com/materia-dex/default-token-list) 
repository.

## Development

### Install Dependencies

```bash
yarn
```

### Run

```bash
yarn start
```

### Configuring the environment (optional)

To have the interface default to a different network when a wallet is not connected:

1. Make a copy of `.env` named `.env.local`
2. Change `REACT_APP_NETWORK_ID` to `"{YOUR_NETWORK_ID}"`
3. Change `REACT_APP_NETWORK_URL` to e.g. `"https://{YOUR_NETWORK_ID}.infura.io/v3/{YOUR_INFURA_KEY}"` 

Note that the interface only works on testnets where both 
[Materia](https://materiadex.com/docs/smart-contracts/factory/) and 
[multicall](https://github.com/makerdao/multicall) are deployed.
The interface will not work on other networks.

## Contributions

**Please open all pull requests against the `master` branch.** 
CI checks will run against all PRs.
