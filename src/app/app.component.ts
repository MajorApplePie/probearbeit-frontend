import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'probe';
  languageOptions = [{
    key: 'de',
    name: 'German'
  }, {
    key: 'en',
    name: 'English'
  }];

  languageSelect: FormControl;

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
    const userLang = this.getLangFromStorage();
    translate.use(userLang);
    console.log(this.languageOptions.find(i => i.key === userLang));
    this.languageSelect = new FormControl(this.languageOptions.find(i => i.key === userLang));
    this.languageSelect.valueChanges
      .subscribe(value => {
        console.log(value);
        this.changeLanguage(value.key);
      });

  }

  changeLanguage(lang: string) {
    localStorage.setItem('langKey', lang);
    this.translate.use(lang)
  }

  getLangFromStorage(): string {
    const storedLanguage = localStorage.getItem('langKey');
    return storedLanguage || 'en';
  }
}
