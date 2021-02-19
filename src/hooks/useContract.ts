import { Contract } from '@ethersproject/contracts'
import { abi as STAKING_REWARDS_ABI } from '@materia-dex/materia-contracts-liquidity-mining/build/StakingRewards.json'
import { abi as MERKLE_DISTRIBUTOR_ABI } from '@materia-dex/materia-contracts-distributor/build/MerkleDistributor.json'
import { ChainId } from '@materia-dex/sdk'
import { abi as IMateriaPairABI } from '@materia-dex/materia-contracts-core/build/IMateriaPair.json'
import { abi as IERC20WrapperV1_ABI } from '@materia-dex/materia-contracts-proxy/build/IERC20WrapperV1.json'
import { useMemo } from 'react'
import { MERKLE_DISTRIBUTOR_ADDRESS, ERC20WRAPPER } from '../constants'
import {
  ARGENT_WALLET_DETECTOR_ABI,
  ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS
} from '../constants/abis/argent-wallet-detector'
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json'
import ENS_ABI from '../constants/abis/ens-registrar.json'
import { ERC20_BYTES32_ABI, ETHITEM_KNOWLEDGE_BASE_ABI, ETHITEM_ORCHESTRATOR_ABI, WERC20_ABI } from '../constants/abis/erc20'
import ERC20_ABI from '../constants/abis/erc20.json'
import { MIGRATOR_ABI, MIGRATOR_ADDRESS } from '../constants/abis/migrator'
import UNISOCKS_ABI from '../constants/abis/unisocks.json'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'

import { getContract } from '../utils'
import { useActiveWeb3React } from './index'
import { Interface } from 'ethers/lib/utils'

const ERC20_INTERFACE = new Interface(ERC20_ABI)

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

function useUnmemoizedContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()
  if (!address || !ABI || !library) return null
  try {
    return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
  } catch (error) {
    console.error('Failed to get contract', error)
    return null
  }
}

export function useV2MigratorContract(): Contract | null {
  return useContract(MIGRATOR_ADDRESS, MIGRATOR_ABI, true)
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useWERC20TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, WERC20_ABI, withSignerIfPossible)
}

export function useEthItemKnowledgeBaseContract(ethItemKnowledgeBaseAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(ethItemKnowledgeBaseAddress, ETHITEM_KNOWLEDGE_BASE_ABI, withSignerIfPossible)
}

export function useIETHContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? ERC20WRAPPER[chainId] : undefined, IERC20WrapperV1_ABI, withSignerIfPossible)
}

export function useArgentWalletDetectorContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(
    chainId === ChainId.MAINNET ? ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS : undefined,
    ARGENT_WALLET_DETECTOR_ABI,
    false
  )
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
      case ChainId.GÖRLI:
      case ChainId.ROPSTEN:
      case ChainId.RINKEBY:
        address = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
        break
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IMateriaPairABI, withSignerIfPossible)
}

export function useUnmemoizedPairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useUnmemoizedContract(pairAddress, IMateriaPairABI, withSignerIfPossible)
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}

export function useMerkleDistributorContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? MERKLE_DISTRIBUTOR_ADDRESS[chainId] : undefined, MERKLE_DISTRIBUTOR_ABI, true)
}

export function useStakingContract(stakingAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(stakingAddress, STAKING_REWARDS_ABI, withSignerIfPossible)
}

export function useSocksController(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(
    chainId === ChainId.MAINNET ? '0x65770b5283117639760beA3F867b69b3697a91dd' : undefined,
    UNISOCKS_ABI,
    false
  )
}
