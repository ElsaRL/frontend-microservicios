import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Avion } from '../models/avion.models';

@Injectable({
  providedIn: 'root'
})
export class AvionesService {

  private apiUrl: string = environment.apiUrl +'aviones/';

  constructor(private http: HttpClient){ }

    getAviones():Observable<Avion[]>{
      return this.http.get<Avion[]>(this.apiUrl);

    }
    createAvion(avion: Avion):Observable<Avion>{
      return this.http.post<Avion>(this.apiUrl,avion);
    }

    
    updateAvion(avion: Avion): Observable<Avion>{
      return this.http.put<Avion>(`${this.apiUrl}${avion.id}`,avion);

    }

    deleteAvion(idAvion: number): Observable<Avion>{
      return this.http.delete<Avion>(`${this.apiUrl}${idAvion}`);
    
    }
}
