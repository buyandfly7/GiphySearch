import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import {AngularFireAuth} from "angularfire2/auth";

@Injectable()
export class UserAuthService {
  user: Observable<firebase.User>;
  constructor(public afAuth: AngularFireAuth) {
    this.user = afAuth.authState;
  }
  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        this.favoritesSnap.subscribe(snapshots => {
          snapshots.forEach(snapshot => {
            this.favoritesLink += snapshot.key + ',';
            console.log(this.favoritesLink)
          });
          this.gifsById();
        });
      }
    });
  }
  logout() {
    this.afAuth.auth.signOut();
  }
}
