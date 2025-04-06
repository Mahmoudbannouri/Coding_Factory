export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number; // current page number
    numberOfElements: number; // number of items in current page
  }