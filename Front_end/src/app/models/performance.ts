export interface PerformanceRequest {
    G1: number;
    G2: number;
    studytime: number;
    age?: number;
    Medu?: number;
    Fedu?: number;
    traveltime?: number;
    failures?: number;
    famrel?: number;
    freetime?: number;
    goout?: number;
    Dalc?: number;
    Walc?: number;
    health?: number;
    absences?: number;
    schoolsup?: string;
    famsup?: string;
    paid?: string;
    activities?: string;
    nursery?: string;
    higher?: string;
    internet?: string;
    romantic?: string;
  }
  
  export interface PerformanceResponse {
    prediction: string;
    probabilities: {
      Failed: number;
      Passable: number;
      Good: number;
      'Very Good': number;
      Excellent: number;
    };
    confidence: number;
  }