import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aeropuerto } from '../models/aeropuerto.model';


@Injectable({
  providedIn: 'root'
})
export class AeropuertosService {

  private apiUrl: string = environment.apiUrl +'aeropuertos/';

  constructor(private http: HttpClient){ }

    getAeropuertos():Observable<Aeropuerto[]>{
      return this.http.get<Aeropuerto[]>(this.apiUrl);

    }
    createAeropuerto(aeropuerto: Aeropuerto):Observable<Aeropuerto>{
      return this.http.post<Aeropuerto>(this.apiUrl,aeropuerto);
    }

    
    updateAeropuerto(aeropuerto: Aeropuerto): Observable<Aeropuerto>{
      return this.http.put<Aeropuerto>(`${this.apiUrl}${aeropuerto.id}`,aeropuerto);

    }

    deleteAeropuerto(idAeropuerto: number): Observable<Aeropuerto>{
      return this.http.delete<Aeropuerto>(`${this.apiUrl}${idAeropuerto}`);
    
    }
}
