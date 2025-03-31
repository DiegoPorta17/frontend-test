import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Division } from '../models/division.model';
import {environment} from '../../enviroment/enviroment';

;

@Injectable({
  providedIn: 'root',
})
export class DivisionService {
  private apiUrl = `${environment.apiUrl}/divisions`;

  constructor(private http: HttpClient) {}

  getDivisions(): Observable<Division[]> {
    return this.http.get<Division[]>(this.apiUrl);
  }

  getDivisionById(id: number): Observable<Division> {
    return this.http.get<Division>(`${this.apiUrl}/${id}`);
  }

  getSubdivisions(id: number): Observable<Division[]> {
    return this.http.get<Division[]>(`${this.apiUrl}/${id}/subdivisions`);
  }

  createDivision(division: Partial<Division>): Observable<Division> {
    return this.http.post<Division>(this.apiUrl, division);
  }

  updateDivision(id: number, division: Division): Observable<Division> {
    return this.http.put<Division>(`${this.apiUrl}/${id}`, division);
  }

  deleteDivision(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
