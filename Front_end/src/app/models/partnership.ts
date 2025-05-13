import { Entreprise } from "./entreprise";
import { Proposal } from "./proposal";

export interface Partnership {
    idPartnership?: number;
    partnershipStatus: string;
    entreprise:Entreprise;  // Just the ID here, not the full object
    proposals?: Proposal;  // Replace with proper Proposal model if available
  }
  