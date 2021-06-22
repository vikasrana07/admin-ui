import { Component, OnInit } from '@angular/core';
import { ThemeService } from '@app/_services';

@Component({
  selector: 'app-sidebar',
  templateUrl: './app-sidebar.component.html',
  styleUrls: ['./app-sidebar.component.css']
})
export class AppSidebarComponent implements OnInit {
  showSidebar = false;
  showThemeSelection = false;
  body = document.getElementsByTagName('body')[0];
  constructor(private readonly themeService: ThemeService) {}

  ngOnInit() {
    
  }

  themeChangeHandler(themeToSet) {
    this.themeService.setTheme(themeToSet);
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
    if (this.showSidebar){
      this.body.classList.add('sidebar-folded');
    }else{
      this.body.classList.remove('sidebar-folded');
    }
  }

  toggleThemeSelection(){
    this.showThemeSelection = !this.showThemeSelection;
    if (this.showThemeSelection){
      this.body.classList.add('settings-open');
    }else{
      this.body.classList.remove('settings-open');
    }
  }

  handleChange(value){
    if (value === 'sidebar-light'){
      this.body.classList.add('sidebar-light');
      this.body.classList.remove('sidebar-dark');
    }else{
      this.body.classList.add('sidebar-dark');
      this.body.classList.remove('sidebar-light');
    }
  }
}
