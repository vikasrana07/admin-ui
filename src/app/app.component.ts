import { Component, OnInit } from '@angular/core';
import { ThemeService } from '@app/_services';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Admin UI';

  constructor(private readonly themeService: ThemeService) { }

  ngOnInit() {
    this.themeService.setTheme('light');
  }
}
