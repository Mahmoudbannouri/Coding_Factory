import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Pfe } from '../models/pfe';
import { formatDate } from '@angular/common';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PfeService {

  public apiUrl = 'http://localhost:8081/api/pfe'; 
  constructor(private http: HttpClient) {}

  // Récupérer tous les PFE
  getAllPfe(): Observable<Pfe[]> {
    return this.http.get<Pfe[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des PFEs:', error);
        return throwError(() => new Error('Une erreur est survenue lors du chargement des données'));
      })
    );
  }

  getPfeById(id: number): Observable<Pfe> {
    if (!id || isNaN(id)) {
      throw new Error('ID invalide fourni');
    }

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('auth_token'), // Exemple
      'Content-Type': 'application/json'
    });

    return this.http.get<Pfe>(`${this.apiUrl}/${id}`, { headers });
  }


  

  // Créer un PFE
   // Créer un PFE
   createPfe(pfe: any): Observable<Pfe> {
    if (!this.isValidCategory(pfe.category)) {
      return throwError(() => new Error('Catégorie invalide'));
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    return this.http.post<Pfe>(`${this.apiUrl}/create`, pfe, { headers })
      .pipe(
        catchError(error => {
          console.error('Erreur dans le service:', error);
          return throwError(() => error);
        })
      );
      
  }
  private isValidCategory(category: string): boolean {
    const validCategories = [
      'WEB_DEVELOPMENT', 
      'DATA_SCIENCE', 
      'SECURITY', 
      'AI', 
      'CLOUD'
    ];
    return validCategories.includes(category);
  }
  
  // Mettre à jour un PFE
  updatePfe(id: number, pfe: Pfe): Observable<Pfe> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer your-token',
      'Content-Type': 'application/json'
    });
    return this.http.put<Pfe>(`${this.apiUrl}/${id}`, pfe, { headers });
  }

  // Supprimer un PFE
  deletePfe(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
  }

  // Ajouter un document à un PFE
  addDocument(pfeId: number, documentUrl: string): Observable<Pfe> {
    return this.http.post<Pfe>(`${this.apiUrl}/${pfeId}/documents`,  { url: documentUrl });
  }

  // Récupérer les documents d'un PFE
  getDocuments(pfeId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${pfeId}/documents`);
  }
  uploadDocument(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}//documents`, formData);
  }
  // Supprimer un document d'un PFE
  removeDocument(pfeId: number, documentName: string): Observable<Pfe> {
    return this.http.delete<Pfe>(`${this.apiUrl}/${pfeId}/documents`, { body: documentName });
  }
  downloadDocument(docId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}//documents/${docId}`, {
      responseType: 'blob'
    });
  }
  










  // Ajouter une date de réunion à un PFE
  addMeetingDate(pfeId: number, meetingDate: Date): Observable<Pfe> {
    return this.http.post<Pfe>(`${this.apiUrl}/${pfeId}/meeting`, meetingDate);
  }

  // Récupérer les dates de réunion d'un PFE
  getMeetingDates(pfeId: number): Observable<Date[]> {
    return this.http.get<Date[]>(`${this.apiUrl}/${pfeId}/meeting`);
  }

  // Supprimer une date de réunion d'un PFE
 // Dans pfe.service.ts
 removeMeetingDate(pfeId: number, meetingDate: Date): Observable<Pfe> {
  // Format date as yyyy-MM-dd
  const formattedDate = formatDate(meetingDate, 'yyyy-MM-dd', 'en-US');
  
  return this.http.delete<Pfe>(
    `${this.apiUrl}/${pfeId}/meeting`,
    {
      params: { meetingDate: formattedDate }
    }
  ).pipe(
    catchError(error => {
      console.error('Detailed error:', error);
      return throwError(() => new Error('Failed to delete meeting'));
    })
  );
}
updateMeetingDate(pfeId: number, oldDate: Date, newDate: Date): Observable<Pfe> {
  const body = {
    oldMeetingDate: formatDate(oldDate, 'yyyy-MM-dd', 'en-US'),
    newMeetingDate: formatDate(newDate, 'yyyy-MM-dd', 'en-US')
  };

  console.log('Envoi de la requête PUT :', { 
    url: `${this.apiUrl}/${pfeId}/meeting`,
    body: body 
  }); // ⚠️ Vérifiez dans la console du navigateur

  return this.http.put<Pfe>(`${this.apiUrl}/${pfeId}/meeting`, body).pipe(
    tap(response => console.log('Réponse du backend :', response)), // Log de la réponse
    catchError(error => {
      console.error('Erreur HTTP :', error); // Log détaillé de l'erreur
      return throwError(() => new Error('Échec de la mise à jour'));
    })
  );
}
 










  // Supprimer un membre du jury d'un PFE
  removeJuryMember(pfeId: number, juryMemberName: string): Observable<Pfe> {
    return this.http.delete<Pfe>(`${this.apiUrl}/${pfeId}/jury`, { body: juryMemberName });
  }
  
 
  // Ajouter un membre du jury à un PFE
  addJuryMember(pfeId: number, juryMember: string): Observable<Pfe> {
    return this.http.post<Pfe>(`${this.apiUrl}/${pfeId}/jury`, juryMember);
  }

  // Récupérer les membres du jury d'un PFE
  getJuryMembers(pfeId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${pfeId}/jury`);
  }


}