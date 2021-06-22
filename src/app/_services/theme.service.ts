import { Injectable } from "@angular/core";

import { StyleManagerService } from "@app/_services";

@Injectable({ providedIn: 'root' })
export class ThemeService {
  constructor(private styleManager: StyleManagerService) {}

  setTheme(themeToSet) {
    this.styleManager.setStyle(
      'theme',
      `assets/css/${themeToSet}.css`
    );
  }
}
