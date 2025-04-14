import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Centre } from 'app/models/Centre';
import { Event } from 'app/models/Event';
import { User } from 'app/models/User';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl="http://localhost:8090/event";
  

  constructor(private http: HttpClient) {}
  getAllEvents(page: number = 0, size: number = 6): Observable<any> {
    // Make sure the API endpoint supports pagination using 'page' and 'size' as query parameters
    return this.http.get<any>(`${this.apiUrl}/all?page=${page}&size=${size}`);
  }
 /* getAllCenters():Observable<Centre[]>
  {
    return this.http.get<Centre[]>(this.apiUrl+"/centers");
  }*/
  getEventById(id:number):Observable<Event>
  {
    return this.http.get<Event>(this.apiUrl+"/"+id);
  }
  //dont forget to add the id of the user after teh session is implemented
  addEvent(event:Event,userID:number):Observable<Event>
  {
    return this.http.post<Event>(this.apiUrl+"/add/"+userID,event);
  }
  deleteEvent(id:number):Observable<void>
  {
    return this.http.delete<void>(this.apiUrl+"/delete/"+id);
  }
  
  updateEvent(id:number,event:Event):Observable<Event>
  {
    return this.http.put<Event>(this.apiUrl+"/update/"+id,event);
  }
  //dont forget to add the id of the user after teh session is implemented
  enrollToEvent(eventID:Number,accessToken:string,userID:number):Observable<Event>
  {
    return this.http.post<Event>(this.apiUrl+"/enroll/"+eventID+"/"+userID+"/"+accessToken,null);
  }
  deroll(eventId: number,userID:number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deroll/${eventId}/${userID}`);
  }
  getParticipants(eventID:number):Observable<User[]>
  {
    return this.http.get<User[]>(this.apiUrl+'/'+eventID+"/participants");
  }
  generateEventDescription(event: any): Observable<{ description: string }> {
    return this.http.post<{ description: string }>(this.apiUrl + "/generate-description", event);
}
getEventImageUrl(imageUrl: string): Observable<string> {
  const imagePath = `${this.apiUrl}/getImage/${encodeURIComponent(imageUrl)}`;
  return new Observable((observer) => {
    observer.next(imagePath);
    observer.complete();
  });
}

getFilteredEvents(filters: any): Observable<any[]> {
  let params = new HttpParams();

  if (filters.searchQuery) {
    params = params.set('search', filters.searchQuery);
  }

  if (filters.selectedCategory) {
    params = params.set('category', filters.selectedCategory); // Ensure this value is set
  }

  if (filters.startDate) {
    params = params.set('startDate', filters.startDate);
  }

  if (filters.endDate) {
    params = params.set('endDate', filters.endDate);
  }

  if (filters.selectedTimePeriod) {
    params = params.set('timePeriod', filters.selectedTimePeriod);
  }
  if (filters.enrolledUserId) {
    params = params.set('enrolledUserId', filters.enrolledUserId);
  }
  if (filters.createdBy) {
    params = params.set('createdBy', filters.createdBy);
  }
  
  return this.http.get<any[]>(this.apiUrl+"/filtredEvents", { params });
}
downloadIcs(eventId: number): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/download-ics/${eventId}`, {
    responseType: 'blob'
  });
}

getUserCreator(id: number): Observable<User> {
  return this.http.get<User>(`http://localhost:8090/api/v1/auth/user/${id}`);
}

// Get all centers
  getAllCenters(): Observable<Centre[]> {
    return this.http.get<any[]>('http://localhost:8090/Partnership/api/centers/all');
  }

  // Get a center by ID
  getCenterById(id: number): Observable<Centre> {
    return this.http.get<any>(`http://localhost:8090/Partnership/api/centers/getCenterById/${id}`);
  }
}
