import { AcceptanceStatus } from "./AcceptanceStatus";
import { Partnership } from "./partnership";
import { Status } from "./Status";

export interface Assessment {
    idAssessment: number; 
    score: number; 
    status: Status;
    acceptanceStatus: AcceptanceStatus;
    adminAcceptance: boolean; 
    partnerAcceptance: boolean; 
    feedback: string; 
    partnership?: Partnership;
    createdAt?: Date;
    updatedAt?: Date;
  }
  