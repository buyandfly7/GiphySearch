import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AlertModule, ButtonsModule, ModalModule, PaginationModule} from 'ngx-bootstrap';


import 'hammerjs';
import 'mousetrap';
import { ModalGalleryModule } from 'angular-modal-gallery';
import { HttpModule } from '@angular/http';
import {FormsModule} from '@angular/forms';
import { MasonryModule } from 'angular2-masonry';
import {AngularFireModule} from 'angularfire2';
import {environment} from '../environments/environment';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import { ImagesfilterPipe } from './imagesfilter.pipe';
import { NavbarComponent } from './navbar/navbar.component';
import {UserAuthService} from "./user-auth.service";

@NgModule({
  declarations: [
    AppComponent,
    ImagesfilterPipe,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AlertModule.forRoot(),
    ModalGalleryModule.forRoot(),
    ModalModule.forRoot(),
    MasonryModule,
    PaginationModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    ButtonsModule.forRoot()
  ],
  providers: [UserAuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
