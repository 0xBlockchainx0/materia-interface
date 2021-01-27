import { Interface } from '@ethersproject/abi'
import ERC20_ABI from './erc20.json'
import WERC20_ABI from './werc20.json'
import ERC20_BYTES32_ABI from './erc20_bytes32.json'
import ETHITEM_ORCHESTRATOR_ABI from './ethitem-orchestrator.json'
import ETHITEM_KNOWLEDGE_BASE_ABI from './ethitem-knowledge-base.json'

const ERC20_INTERFACE = new Interface(ERC20_ABI)

const ERC20_BYTES32_INTERFACE = new Interface(ERC20_BYTES32_ABI)

export default ERC20_INTERFACE
export { ERC20_ABI, ERC20_BYTES32_INTERFACE, ERC20_BYTES32_ABI, ETHITEM_ORCHESTRATOR_ABI, ETHITEM_KNOWLEDGE_BASE_ABI, WERC20_ABI }
