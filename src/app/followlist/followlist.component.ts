import { Component, OnInit } from '@angular/core';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';
import { Title, Meta } from '@angular/platform-browser';
import { defer } from 'q';
import { TranslateService } from "@ngx-translate/core";

declare var bootbox: any;

@Component({
  selector: 'app-followlist',
  templateUrl: './followlist.component.html',
  styleUrls: ['./followlist.component.css'],
  providers: [CoinService],
})
export class FollowlistComponent implements OnInit {

  private toasterService: ToasterService;

  public base_url: any = myGlobals.base_url;
  public login_ses: any = myGlobals.login_ses;
  public basecurr: any = myGlobals.basecurr;
  public base_sing: any = myGlobals.base_sing;
  followlist: any = Array();
  showloader: any;
  default_lang:any=myGlobals.default_lang;

  constructor(private translateService: TranslateService,private coinservice: CoinService, toasterService: ToasterService, private title: Title, private meta: Meta) {
    this.translateService.use(this.default_lang);
    this.showloader = true;
    localStorage.setItem('sorton', null);
    localStorage.setItem('sortby', null);
    this.toasterService = toasterService;

    if (this.login_ses == null) {
      window.location.href = this.base_url;
    }
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
    this.coinservice.followlist().subscribe(resData => {
      if (resData.status === true) {
        this.followlist = resData.data;
      } else {
        this.followlist = '';
      }
      this.showloader = false;
    });
  }

  followcoin(coin) {
    let th = this;
    this.translateService.get(['FOLLOWLIST']).subscribe(translations => {
      bootbox.confirm({
        closeButton: false,
        title: translations.FOLLOWLIST.confirmtitle,
        message: translations.FOLLOWLIST.confirmmessage +" "+ coin.name.toLowerCase() + " ?",
        buttons: {
          confirm: {
            label: translations.FOLLOWLIST.confirmbtn,
            className: 'btn-success '
          },
          cancel: {
            label: translations.FOLLOWLIST.cancelbtn,
            className: 'btn-primary'
          }
        },
        callback: function (result) {
          if (result) {
            th.coinservice.cointrackbyuser(1, coin.coin_id, coin.name).subscribe(resData => {
              if (resData.status === true) {
                if (coin.followstatus === 1) {
                  coin.followstatus = 0;
                } else {
                  coin.followstatus = 1;
                }
                th.toasterService.pop('success', 'Success', resData.message);
                setTimeout(() => {
                  th.ngOnInit();
                });
              } else {
                th.toasterService.pop('error', 'Error', 'Something went wrong please try after sometime !');
              }
            });
          }
        }
      });
    });
  }

  isImage(src) {
    const deferred = defer();
    const image = new Image();
    image.onerror = function () {
      deferred.resolve(false);
    };
    image.onload = function () {
      deferred.resolve(true);
    };
    image.src = src;
    return deferred.promise;
  }

  errorHandler(event, name) {
    const imgurl = 'assets/currency-25/' + name.toLowerCase() + '.png';
    this.isImage(imgurl).then(function (test) {
      // tslint:disable-next-line:triple-equals
      if (test == true) {
        return event.target.src = imgurl;
      } else {
        return event.target.src = 'assets/currency-25/not-found-25.png';
      }
    });
  }

}
