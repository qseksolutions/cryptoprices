import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';
import {TranslateService} from '@ngx-translate/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'my-app',
  templateUrl: './app.component.html'
})
export class AppComponent {

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
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
    translate.use('en');
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
