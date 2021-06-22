const MATERIA_LIST = 'https://list.materia.exchange/materia-default.tokenlist.json'
const UNISWAP_LIST = 'https://gateway.ipfs.io/ipns/tokens.uniswap.org'
const SUSHISWAP_LIST = 'https://unpkg.com/@sushiswap/default-token-list@latest/build/sushiswap-default.tokenlist.json'
const ETHITEM_LIST = 'https://raw.githubusercontent.com/b-u-i-d-l/ITEMswap/master/src/constants/ethItemLists/dist/tokensList.json'

export const DEFAULT_TOKEN_LIST_URL = MATERIA_LIST

export const DEFAULT_LIST_OF_LISTS: string[] = [
  DEFAULT_TOKEN_LIST_URL,
  UNISWAP_LIST,
  SUSHISWAP_LIST,
  // ETHITEM_LIST
]
