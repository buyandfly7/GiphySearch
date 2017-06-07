import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../user-auth.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user;
  isIn = false;
  constructor(private authservice: UserAuthService) {
    this.user = authservice.user;
  }

  login(){
    this.authservice.login();
  }
  logout(){
    this.authservice.logout();
  }
  toggleState() {
    const bool = this.isIn;
    this.isIn = bool === false;
  }
  ngOnInit() {
  }

}
