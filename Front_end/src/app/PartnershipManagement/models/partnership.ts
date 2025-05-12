import { Assessment } from "./assessment.model";
import { Entreprise } from "./entreprise";
import { Proposal } from "./proposal";

export interface Partnership {
    idPartnership?: number;
    partnershipStatus: string;
    score?: number;

    entreprise:Entreprise;  // Just the ID here, not the full object
    proposals?: Proposal;  // Replace with proper Proposal model if available
    Assesements?: Assessment[]; // Replace with proper Assessment model if available
  }
  