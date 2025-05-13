export interface Proposal {
    idProposal?: number;
    proposalName: string;
    proposalDescription: string;
    startDate: Date | string;  // Allow both Date and string for flexibility
    endDate: Date | string;    // Allow both Date and string for flexibility
    plannedAmount: number;
    proposalStatus: string;
    proposalType: string;
    user?: any;               // Added optional user field
    applications?: any[];     // Added optional applications field
    center?: any;            // Added optional center field
}