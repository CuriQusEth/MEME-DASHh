/**
 * ERC-8021 Transaction Attribution Details
 * Base Mainnet (Denim Upgrade, 200ms canonical blocks) standard for attributing builder transactions.
 */

export const NETWORK = 'base-mainnet';
export const CHAIN_ID = 8453;
export const UPGRADE = 'denim-200ms';
export const BUILDER_CODE = '[BUILDER_CODE]';
export const APP_ID = '[ATTRIBUTION_CODE]';

export interface AttributionRecord {
  appId: string;
  builderCode: string;
  network: string;
  timestamp: number;
  transactionType: "SCORE_SUBMIT" | "REVIVE" | "SAY_GM";
}

/**
 * Mocks preparing transaction calldata with attribution parameters according to ERC-8021
 */
export function prepareAttributedTransaction(txType: AttributionRecord["transactionType"]): string {
  const payload = {
    _erc8021_attribution: {
        app_id: APP_ID,
        builder_code: BUILDER_CODE,
        action: txType,
        t: Date.now()
    }
  };
  
  // In a real implementation, this would encode the custom parameters into the contract calldata.
  return JSON.stringify(payload);
}
