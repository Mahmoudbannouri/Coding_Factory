// src/app/models/entreprise.ts
export interface Entreprise {
    idEntreprise?: number;
    nameEntreprise: string;
    addressEntreprise: string;
    phoneEntreprise: string;
    emailEntreprise: string;
    descriptionEntreprise: string;
    partner?: any; // Replace with proper User model if available
    partnerships?: any[]; // Replace with proper Partnership model if available
  }