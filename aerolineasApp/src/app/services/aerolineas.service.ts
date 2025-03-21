import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Aerolinea } from '../models/aerolinea.models';

@Injectable({
  providedIn: 'root'
})
export class AerolineasService {

  private apiUrl: string = environment.apiUrl +'aerolineas/';

  constructor(private http: HttpClient){ }

    getAerolineas():Observable<Aerolinea[]>{
      return this.http.get<Aerolinea[]>(this.apiUrl);

    }
    createAerolinea(aerolinea: Aerolinea):Observable<Aerolinea>{
      return this.http.post<Aerolinea>(this.apiUrl,aerolinea);
    }

    
    updateAerolinea(aerolinea: Aerolinea): Observable<Aerolinea>{
      return this.http.put<Aerolinea>(`${this.apiUrl}${aerolinea.id}`,aerolinea);

    }


    deleteAerolinea(idAerolinea: number): Observable<Aerolinea>{
      return this.http.delete<Aerolinea>(`${this.apiUrl}${idAerolinea}`);
    
    }
}
