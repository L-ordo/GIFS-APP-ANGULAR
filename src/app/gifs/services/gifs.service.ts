import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs,interfaces';

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey:       string = 'z5kxQ2pe0gfAiWIj27rKSeqD9sQQDlhZ';
  private serviceUrl:   string= 'https://api.giphy.com/v1/gifs';

  constructor( private http: HttpClient ) {
    this.loadLocalStorage();
  }

  get tagsHistory(){
    return [...this._tagsHistory];
  }


  private organizeHistory( tag : string ){

    tag = tag.toLowerCase();

    // vemos si tag ya existe y si existe lo ponemos al inicio

    if( this._tagsHistory.includes(tag) ){
      this._tagsHistory = this._tagsHistory.filter( (oldTag) => oldTag !== tag )
    }

    this._tagsHistory.unshift( tag );
    this._tagsHistory = this.tagsHistory.splice(0,10);
    this.saveLocalStorage();

  }

  // Metodo para guardar el historial de busqueda en el localStorage
  private saveLocalStorage(): void{

   localStorage.setItem( 'history', JSON.stringify( this._tagsHistory ) );
  }


  // Metodo para cargar el localStorage

  private loadLocalStorage(): void {
    if( !localStorage.getItem('history') ) return;
    this._tagsHistory= JSON.parse(localStorage.getItem('history') ! );

    if( this._tagsHistory.length === 0 ) return;
    this.searchTag( this._tagsHistory[0] );
  }

    searchTag( tag: string): void{
      if( tag.length === 0 ) return ;
      this.organizeHistory(tag);

      const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', tag )


      this.http.get<SearchResponse>(`${this.serviceUrl}/search`, { params })
       .subscribe( resp =>{

        this.gifList = resp.data;
        // console.log({gifs: this.gifList});

       } );


    }
}
