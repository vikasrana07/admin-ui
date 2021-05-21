import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class AppHeaderComponent implements OnInit {
  showDropdown: boolean = false;
  constructor(
    private authenticationService: AuthenticationService
  ) {

  }

  ngOnInit() {
  }

  toggleMenu() {
    this.showDropdown = !this.showDropdown;
  }

  logout() {
    this.authenticationService.logout();
  }
}