import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ArcGISPluginConfig } from './ArcGISPluginConfig'

export const baseUrl = '/plugins/@ngageoint/mage.arcgis'

@Injectable({
  providedIn: 'root'
  /*
  TODO: figure out how to inject the same http client the
  rest of the core app gets so the http auth interceptor
  applies when this service comes from a non-root module
  providedIn: MageArcServicesModule
  */
})
export class ArcService {

  constructor(private http: HttpClient) {
  }

  fetchArcConfig(): Observable<ArcGISPluginConfig> {
    return this.http.get<ArcGISPluginConfig>(`${baseUrl}/config`)
  }

  putArcConfig(config: ArcGISPluginConfig) {
    const body = JSON.stringify(config)
    this.http.put(`${baseUrl}/config`, body)
  }

  removeUserTrack(userTrackId: string): Observable<ArcGISPluginConfig> {
    return this.http.delete<ArcGISPluginConfig>(`${baseUrl}/config/user_tracks/${userTrackId}`)
  }

  removeOperation(operationId: string): Observable<ArcGISPluginConfig> {
    throw new Error('unimplemented')
  }
}