import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import {TranslateService} from '@ngx-translate/core';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';

declare var $ : any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  providers: [CoinService],
})
export class FooterComponent implements OnInit {

  private toasterService: ToasterService;

  public base_url: any = myGlobals.base_url;
  adds: any;
  curl: any;
  regex: any;
  email: any;
  default_lang:any=myGlobals.default_lang;

  constructor(private translateService: TranslateService, toasterService: ToasterService, private coinservice: CoinService, private router: Router, private http: Http) {
    this.toasterService = toasterService;
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

  subscribenewsletter() {
    this.regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (this.email == '' || this.email == undefined) {
      this.toasterService.pop('error', 'Required', 'Please enter email');
    } else if (this.email.length == 0 || !this.regex.test(this.email)) {
      this.toasterService.pop('error', 'Required', 'Please enter valid email');
    } else {
      this.coinservice.newsletter(this.email).subscribe(resData => {
        if (resData.status === true) {
          this.toasterService.pop('success', 'Success', resData.message);
          $('#newemail').val();
        } else {
          this.toasterService.pop('error', 'Error', resData.message);
        }
      });
    }
  }

}
