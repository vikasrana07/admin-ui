import { Component, OnInit } from '@angular/core';
declare global { interface Window { feather: any; } }

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // Enable feather-icons with SVG markup
    window.feather.replace();
  }

}