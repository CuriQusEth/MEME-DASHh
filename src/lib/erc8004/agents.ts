/**
 * ERC-8004 Trustless Agents Mock Integration
 * Defines on-chain deterministic behavioral agents that interact with the smart contracts.
 */

export interface TrustlessAgent {
  id: string;
  type: 'MEME_TRADER' | 'LIQUIDATOR' | 'HYPE_ORACLE';
  behavior: string;
  status: 'ACTIVE' | 'SLEEPING';
}

export const AGENTS: TrustlessAgent[] = [
  {
    id: 'agent_pepe_001',
    type: 'MEME_TRADER',
    behavior: 'Automatically buys dips when HypeMeter drops below 20%',
    status: 'ACTIVE'
  },
  {
    id: 'agent_sec_002',
    type: 'LIQUIDATOR',
    behavior: 'Rugs positions if viral status is lost for 30 blocks',
    status: 'SLEEPING'
  }
];

export function getActiveAgents(): TrustlessAgent[] {
  return AGENTS.filter(a => a.status === 'ACTIVE');
}
