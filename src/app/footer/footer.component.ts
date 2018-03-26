import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  providers: [CoinService],
})
export class FooterComponent implements OnInit {

  public base_url: any = myGlobals.base_url;
  adds: any;
  curl: any;
  default_lang:any=myGlobals.default_lang;

  constructor(private translateService: TranslateService,private coinservice: CoinService, private router: Router, private http: Http) {
    const href = location.href;
    const url = href.split('/');
    if (url[3] === '') {
      this.curl = 'home';
    } else {
      this.curl = url[3];
    }

    this.translateService.use(this.default_lang);

  }

  ngOnInit() {
    /* this.coinservice.getadvertiseforpage('bottom add').subscribe(resData => {
      if (resData.status === true) {
        this.adds = resData.data;
      }
    });
    this.coinservice.getCoinCount().subscribe(responceData => {
      if (responceData.status === true) {
        this.totalmarket = responceData.data['totalmarketcap_' + this.basecurr];
        this.totaltrade = responceData.data['totalvolume_' + this.basecurr];
        const total = responceData.data.totalcoins / 50;
        this.coincount = Math.ceil(total);
        this.totalcoin = responceData.data.totalcoins;
      } else {
        this.totalmarket = 0;
        this.totaltrade = 0;
        this.coincount = 0;
        this.totalcoin = 0;
      }
    }); */
  }

}
