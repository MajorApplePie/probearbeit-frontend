import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'probe';


  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');

    translate.use(this.getLangFromStorage());

  }

  getLangFromStorage(): string {
    const storedLanguage = localStorage.getItem('langKey');
    return storedLanguage || 'en';
  }
}
