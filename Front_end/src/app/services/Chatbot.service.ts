import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private flaskApiUrl = 'http://localhost:5000';
  private springApiUrl = 'http://localhost:8081/api/chatbot';

  constructor(private http: HttpClient) {}

  // Prédiction du niveau
  predictCourseLevel(data: any): Observable<any> {
    return this.http.post(`${this.flaskApiUrl}/predict`, data).pipe(
      catchError(this.handleError)
    );
  }

  // Sauvegarder l'historique
  saveChatHistory(history: any): Observable<any> {
    return this.http.post(`${this.springApiUrl}/history`, history).pipe(
      catchError(this.handleError)
    );
  }

  // Récupérer l'historique paginé
  getChatHistory(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
  
    return this.http.get(`${this.springApiUrl}/history`, { params }).pipe(
      map((response: any) => {
        // Transformation pour assurer la compatibilité
        return {
          content: Array.isArray(response) ? response : 
                  (response.content || response.items || []),
          totalElements: response.totalElements || 
                       response.total || 
                       (response.content ? response.content.length : 0)
        };
      }),
      catchError(this.handleError)
    );
  }

  // Récupérer les feedbacks
  getFeedbacks(search?: string): Observable<any> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get(`${this.springApiUrl}/feedback`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // Sauvegarder le feedback
  saveFeedback(id: number, feedback: string): Observable<any> {
    return this.http.post(
      `${this.springApiUrl}/feedback/${id}`, 
      null, 
      { params: new HttpParams().set('feedback', feedback) }
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erreur API:', error);
    
    let errorMessage = 'Une erreur inconnue est survenue';
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code: ${error.status}\nMessage: ${error.message}`;
      
      if (error.status === 0) {
        errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
      } else if (error.status === 404) {
        errorMessage = 'Ressource non trouvée';
      } else if (error.status >= 500) {
        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}