import { Component, OnInit } from '@angular/core';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';
import { Title, Meta } from '@angular/platform-browser';
import { defer } from 'q';
import {TranslateService} from '@ngx-translate/core';

declare var $;

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
  providers: [CoinService],
})
export class NewsComponent implements OnInit {

  private toasterService: ToasterService;

  public base_url: any = myGlobals.base_url;
  public login_ses: any = myGlobals.login_ses;
  public basecurr: any = myGlobals.basecurr;
  public base_sing: any = myGlobals.base_sing;
  newslist: any = Array();
  default_lang:any=myGlobals.default_lang;

  constructor(private translateService: TranslateService,private coinservice: CoinService, toasterService: ToasterService, private title: Title, private meta: Meta) {
    localStorage.setItem('sorton', null);
    localStorage.setItem('sortby', null);
    this.toasterService = toasterService;
    this.translateService.use(this.default_lang);
  }

  ngOnInit() {
    /* const curl = window.location.href;
    this.coinservice.gettestseometa(curl).subscribe(resData => {
      if (resData.status === true) {
        this.title.setTitle(resData.data.title);
        this.meta.addTag({ name: 'description', content: resData.data.description });
        this.meta.addTag({ name: 'keywords', content: resData.data.keywords });
        this.meta.addTag({ name: 'author', content: 'coinlisting' });
        this.meta.addTag({ name: 'robots', content: resData.data.robots });
        this.meta.addTag({ name: 'title', content: ' www.coinlisting.io' });
      }
    }); */
    // tslint:disable-next-line:max-line-length
    this.coinservice.newslist().subscribe(resData => {
      if (resData.status === true) {
        this.newslist = resData.data;
      } else {
        this.newslist = '';
      }
    });
  }

}
