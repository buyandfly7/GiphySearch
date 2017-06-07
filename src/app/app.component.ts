import {Component, Input, OnInit} from '@angular/core';
import { Http, Response } from '@angular/http';
import {AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  link = 'https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=';
  linkByID = 'https://api.giphy.com/v1/gifs?api_key=dc6zaTOxFJmzC';
  http: Http;
  giphies = [];
  giphiesById = [];
  inputField = '';
  isIn = false;
  @Input() selectedImageUrl;
    public maxSize = 5;
    public bigTotalItems: number;
    public bigCurrentPage = 1;
    public itemsPerPage = 20;
    public checkModel = false;
    public showFavorites = false;
    favoritesLink = '&ids=';

    favorites: FirebaseListObservable<any[]>;
    favoritesSnap: FirebaseListObservable<any[]>;
    user: Observable<firebase.User>;

    constructor(http: Http, db: AngularFireDatabase, public afAuth: AngularFireAuth) {
      this.http = http;
      this.favoritesSnap = db.list('/favorites', { preserveSnapshot: true });
      this.favorites = db.list('/favorites', {
          query: {
              limitToLast: 10,
              orderByKey: true,
          }
        });
      this.user = afAuth.authState;
    }
    ngOnInit(){

        this.gifsById()
        this.favoritesLink = '&ids=';
        this.favoritesSnap.subscribe(snapshots => {
            snapshots.forEach(snapshot => {
                this.favoritesLink += snapshot.key + ',';
                console.log(this.favoritesLink)
            });
        });
    }
    addToFavorites(id) {
            firebase.database().ref('favorites/' + id).set({
                id: id
            });
            this.favoritesLink = '&ids=';
            this.favoritesSnap.subscribe(snapshots => {
                snapshots.forEach(snapshot => {
                    this.favoritesLink += snapshot.key + ',';
                    console.log(this.favoritesLink)
                });
            });
        this.gifsById();
    }
    removeFromFavorites(id) {
        firebase.database().ref('favorites/' + id).remove();
        this.favoritesLink = '&ids=';
        this.favoritesSnap.subscribe(snapshots => {
            snapshots.forEach(snapshot => {
                this.favoritesLink += snapshot.key + ',';
                console.log(this.favoritesLink)
            });
        });
        this.gifsById()
    }
    performSearch(searchTerm): void {
        setTimeout(() => {
            const apiLink = this.link + searchTerm.value;
            this.giphies = [];
            this.http.request(apiLink)
                .subscribe((res: Response) => {
                    this.giphies = res.json().data;
                    this.bigTotalItems = res.json().pagination.total_count;
                    console.log(res.json());
                });
            this.bigCurrentPage = 1;
        }, 300)
  }
    performSearchCollection(searcCol: HTMLInputElement): void {
        const apiLink = this.linkByID + this.favoritesLink + '?search?q=' + searcCol.value;
        this.http.request(apiLink)
            .subscribe((res: Response) => {
                this.giphiesById = [];
                this.giphiesById = res.json().data;
                this.bigTotalItems = res.json().pagination.total_count;
                console.log(res.json());
            });
    }
    gifsById(): void {
        setTimeout(() => {
        const apiLink = this.linkByID + this.favoritesLink;
        this.http.request(apiLink)
            .subscribe((res: Response) => {
                this.giphiesById = [];
                this.giphiesById = res.json().data;
                console.log(apiLink);
                console.log(res.json());
            });
        }, 500)
    }
    pageChanged(event: any): void {
        const apiLink = this.link + this.inputField + '&limit=20' + '&offset=' + event.page * 20;
        this.http.request(apiLink)
            .subscribe((res: Response) => {
                this.giphies = [];
                this.giphies = res.json().data;
                this.bigTotalItems = res.json().pagination.total_count;
                console.log(res.json());
            });
    }
    setSelectedImage(image){
        this.selectedImageUrl = image;
    }
    toggleState() {
        const bool = this.isIn;
        this.isIn = bool === false;
    }
}
