# Materia Interface

UI Interface for Materia, Multi-standard Decentralized Exchange governed by decentralized flexible organization.

- Website: [materiadex.com](https://materiadex.com)
- Interface: [materia.exchange](https://materia.exchange)
- Docs: [materiadex.com/docs](https://materiadex.com/docs/materia)
- Twitter: [@DexMateria](https://twitter.com/DexMateria)
- Reddit: [/r/materiadex](https://www.reddit.com/r/materiadex)
- Discord: [Materia](https://discord.gg/b9UUZzC82d)

## Accessing the Materia Interface

To access Materia DEX interface visit [materia.exchange](https://materia.exchange).

## Listing a token

Please see the [@materia-dex/materia-token-list](https://github.com/materia-dex/materia-token-list) repository.

## Development

### Install Dependencies

```bash
npm install
```

### Run

```bash
npm run start
```

### Configuring the environment (optional)

To have the interface default to a different network when a wallet is not connected:

1. Make a copy of `.env` named `.env.local`
2. Change `REACT_APP_NETWORK_ID` to `"{YOUR_NETWORK_ID}"`
3. Change `REACT_APP_NETWORK_URL` to e.g. `"https://{YOUR_NETWORK_ID}.infura.io/v3/{YOUR_INFURA_KEY}"` 

Note that the interface only works on testnets where both [Materia](https://materiadex.com/docs/materia/smart-contracts) and 
[multicall](https://github.com/makerdao/multicall) are deployed. The interface will not work on other networks.
