// assessment.model.ts

export interface agreement {
    idAssessment: number;
    score: number;
    feedback: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED'; // Example values, update as per your enum
    acceptanceStatus: 'PENDING' | 'ACCEPTED' | 'DECLINED'; // Example values, update as per your enum
    adminAcceptance: boolean;
    partnerAcceptance: boolean;
    partnershipId: number;  // This will hold the ID of the associated partnership
  }
  