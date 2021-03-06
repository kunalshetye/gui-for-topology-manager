import { Injectable, EventEmitter, Output } from '@angular/core';
import { Headers, Response, Http } from '@angular/http';
// import { environment } from './../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/toPromise';

import { TopologyEnvironment } from './../shared/models/topologyenvironment';


@Injectable()
export class TopologyEnvironmentService {
    private _url;
    private _headers;
    private _http: Http;

    private _observable: Observable<TopologyEnvironment[]>;
    private deleteSubject = new Subject<TopologyEnvironment>();
    private createSubject = new Subject<TopologyEnvironment>();
    private updateSubject = new Subject<TopologyEnvironment>();

    constructor(http: Http) {
        this._http = http;
        this._url = process.env.API_URL + 'TopologyEnvironment';
        this._headers = new Headers();
        this._headers.append('Content-Type', 'application/json');
    }


    public GetAll(): Observable<TopologyEnvironment[]> {
        if (this._observable) {
            return this._observable;
        } else {
            this._observable = this._http.get(this._url, { headers: this._headers, withCredentials: true  })
                                    .map(this.extractData)
                                    .publishReplay(50)
                                    .refCount();
            return this._observable;
        }
    }
    public Get(name: string): Observable<TopologyEnvironment> {
         return this.GetAll()
                    .map(env => env.find(e => e.Name === name));
    }

    public Create(data: TopologyEnvironment): void {
        const body = JSON.stringify(data);
        this._http.post(this._url, body, { headers: this._headers, withCredentials: true })
                    .toPromise()
                    .then(res => {
                        if (res.status === 201) {
                            const m = res.json() as TopologyEnvironment;
                            this.createSubject.next(m);
                        }
                    })
                    .catch(this.handleError);
    }

    public Put(data: TopologyEnvironment): void {
        const body = JSON.stringify(data);
        console.log('path');
        const url = this._url + '/' + data.Id;
        this._http.put(url, body, { headers: this._headers, withCredentials: true })
                    .toPromise()
                    .then(res => {
                        if (res.status === 200) {
                            const m = res.json() as TopologyEnvironment;
                            this.updateSubject.next(m);
                        }
                    })
                    .catch(this.handleError);
    }

      public Delete(data: TopologyEnvironment): void {
        const url = this._url + '/' + data.Id;
        this._http.delete(url, { headers: this._headers, withCredentials: true })
                    .toPromise()
                    .then(res => {
                        if (res.status === 204) {
                            this.deleteSubject.next(data);
                        }
                    })
                    .catch(this.handleError);
    }

    private extractData(res: Response): TopologyEnvironment[] {
        console.log(res.json());
        return res.json() as TopologyEnvironment[];
        // return this._cacheResults;
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        // this._messageService.SendMessage('error', error.message, 5000);
        return Promise.reject(error.message || error);
    }
    public GetDeletedMessage(): Observable<TopologyEnvironment> {
        return this.deleteSubject.asObservable();
    }

    public GetUpdateMessage(): Observable<TopologyEnvironment> {
        return this.updateSubject.asObservable();
    }

    public GetCreateMessage(): Observable<TopologyEnvironment> {
        return this.createSubject.asObservable();
    }
}
