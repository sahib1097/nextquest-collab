
export interface XPBoost {
  id: string;
  multiplier: number;
  duration: number; // in milliseconds
  expiresAt: string;
  type: XPBoostType;
  isActive: boolean;
}

export enum XPBoostType {
  STANDARD = "standard",
  PREMIUM = "premium",
  ULTRA = "ultra"
}
