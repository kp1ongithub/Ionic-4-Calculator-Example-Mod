import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';


export interface People {
    id:         number;
    email:      string;
    first_name: string;
    last_name:  string;
    avatar:     string;
}

@Injectable({
    // declares that this service should be created
    // by the root application injector.
    providedIn: 'root'
})
export class UserService {
	
    private baseUrl:string    = 'https://reqres.in/api';
    private serviceUrl:string = '/users';

    private httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    private connected:boolean;
  
    constructor(private http: HttpClient) {
      this.connected = true;
      this.log('constructed');
    }

    private log(message: any) {

        var output = true; // TODO 

        if(output)
            console.log(' RestService : ' + message);
    }

    /**
    * Handle Http operation that failed.
    * Let the app continue.
    * @param operation - name of the operation that failed
    * @param result - optional value to return as the observable result
    */
    private handleError<T>(operation = 'operation', result?: T) {

        return (error: any): Observable<T> => {

            this.connected = false;

            console.error(error);
            this.log(`ERROR ${operation} failed: ${error.message}`);
            
            return of(result as T);
        };
    }

    /** Get users from the rest service */
    private requestRestService(url: string): Observable<People[]> {

        return this.http.get<People[]>(url)
            .pipe(
                tap(daten => {
                    this.connected = true;
                    this.log('service response ' + daten);
            }), catchError(
                    this.handleError<People[]>('requestRestService', [])
                )
            );
    }

    private requestUsers() {

        this.log('request ' + this.baseUrl + this.serviceUrl);

        var serviceResponse = this.requestRestService(this.baseUrl + this.serviceUrl);
        this.connected = false;
        if (this.connected) {
            serviceResponse.subscribe((daten: any) => {
                this.log('subscribe ' + daten.data);
                return daten.data;
            });
        }
        else {
            this.log('not connected');
            return this.getLocalData();
        }
    }

    saveToLocalData(users: any): any {
        // TODO implement saving to local user storage 
        this.log('save users to local data : ' + users);
    }

    private getLocalData() {

        this.log('using local data');

        // TODO implement local user storage 
        var userListData = [{ "id": 1, "email": "george.bluth@reqres.in", "first_name": "George", "last_name": "Bluth", "avatar": "https://reqres.in/img/faces/1-image.jpg" },
                            { "id": 2, "email": "janet.weaver@reqres.in", "first_name": "Janet", "last_name": "Weaver", "avatar": "https://reqres.in/img/faces/2-image.jpg" },
                            { "id": 3, "email": "emma.wong@reqres.in", "first_name": "Emma", "last_name": "Wong", "avatar": "https://reqres.in/img/faces/3-image.jpg" },
                            { "id": 4, "email": "eve.holt@reqres.in", "first_name": "Eve", "last_name": "Holt", "avatar": "https://reqres.in/img/faces/4-image.jpg" },
                            { "id": 5, "email": "charles.morris@reqres.in", "first_name": "Charles", "last_name": "Morris", "avatar": "https://reqres.in/img/faces/5-image.jpg" },
                            { "id": 6, "email": "tracey.ramos@reqres.in", "first_name": "Tracey", "last_name": "Ramoos", "avatar": "https://reqres.in/img/faces/6-image.jpg" }];

        return userListData;;
    }

    getUsers(forceUpdate: boolean, comp: string) {

        this.log((forceUpdate ? 'update forced by ' : '') + 'requesting component: ' + comp );

        var isDue = false; // TODO: isDue needs to be implemented e.g. as a function to time

        if (forceUpdate || isDue) {
            this.log('update data from service');
            return this.requestUsers();
        }
        else {
            this.log('update data from storage - omit service');
            return this.getLocalData();
        }
    }
}