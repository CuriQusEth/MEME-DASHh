/**
 * ERC-8021 Transaction Attribution Details
 * Base Mainnet standard for attributing builder transactions.
 */

export const BUILDER_CODE = 'bc_khqax80a';
export const APP_ID = '691635e0669aee60603bdd84';

export interface AttributionRecord {
  appId: string;
  builderCode: string;
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
