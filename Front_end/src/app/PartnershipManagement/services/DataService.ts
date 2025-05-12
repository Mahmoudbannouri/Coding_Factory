import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";

@Injectable({
    providedIn: 'root',
  })
  export class DataService {
    private top5ResultsSubject = new BehaviorSubject<any[]>([]);
    top5Results$ = this.top5ResultsSubject.asObservable();
  
    setTop5Results(results: any[]) {
      this.top5ResultsSubject.next(results);
    }
  }
  