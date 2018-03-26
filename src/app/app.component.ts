import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';
import {TranslateService} from '@ngx-translate/core';
import * as myGlobals from './global';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'my-app',
  templateUrl: './app.component.html'
})
export class AppComponent {

  public lang_name: any = myGlobals.lang_name;
  public default_lang: any = myGlobals.default_lang;

  private toasterService: ToasterService;

  public toasterconfig: ToasterConfig =
    new ToasterConfig({
      showCloseButton: true,
      tapToDismiss: false,
      timeout: 2000
    });

  showHeader: any;
  public location = '';

  constructor(private translate: TranslateService,private router: Router, toasterService: ToasterService) {
    this.toasterService = toasterService;
    if(this.default_lang == null || this.default_lang == undefined) {
      this.default_lang = localStorage.setItem('default_lang','english');
      this.lang_name = localStorage.setItem('lang_name','English');
    }
    translate.addLangs(["english", "chinese", "japanese", "korean", "vietnamese", "spanish", "portugueseBrazil", "portugal", "german", "romanian", "russian", "turkish","ukraine", "italian", "dutch", "french", "greek", "hindi", "indonesian", "danish", "arabic"]);
    translate.setDefaultLang(this.default_lang);
    translate.use(this.default_lang);
  }
  changeLang(lang: string) {
    this.translate.use(lang);
  }
  ngOnInit() {
    // listenging to routing navigation event
    this.router.events.subscribe(event => this.modifyHeader(event));
  }

  modifyHeader(location) {
    const url = window.location.pathname;
    const segment = url.split('/');
    if (location.url === '/coin-widget/'+segment[2]+'/'+segment[3]) {
      this.showHeader = false;
    } else {
      this.showHeader = true;
    }
  }
}
