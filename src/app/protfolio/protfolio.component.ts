import { Component, OnInit } from '@angular/core';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { defer } from 'q';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';
import { Title, Meta } from '@angular/platform-browser';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TranslateService } from "@ngx-translate/core";

declare var $: any;
declare var bootbox: any;

@Component({
  selector: 'app-protfolio',
  templateUrl: './protfolio.component.html',
  styleUrls: ['./protfolio.component.css'],
  providers: [CoinService, DatePipe, DecimalPipe],
})
export class ProtfolioComponent implements OnInit {

  private toasterService: ToasterService;
  
  public base_url: any = myGlobals.base_url;
  public loginData: any = myGlobals.login_ses;
  public base_sing: any = myGlobals.base_sing;
  allcoin: any;
  allcurrency: any;
  portfoliolist: any;
  profitlosslist: any;
  public model: any;
  public modelcur: any;
  public modeldate: any;
  showloader: any;
  totalcost: any = 0;
  value: any = 0;
  overolsum: any = 0;
  overolper: any = 0;
  coin: any;
  currency: any;
  port = {
    port_id: '',
    coin: '',
    date: '',
    currency: '',
    amount: '',
    value_coin: ''
  };
  default_lang:any=myGlobals.default_lang;

  constructor(private translateService: TranslateService,private coinservice: CoinService, toasterService: ToasterService, private title: Title, private meta: Meta, private decimalpipe: DecimalPipe, private datePipe: DatePipe) {
    this.translateService.use(this.default_lang);
    this.showloader = true;
    localStorage.setItem('sorton', null);
    localStorage.setItem('sortby', null);
    this.toasterService = toasterService;
    if (this.loginData == null) {
      window.location.href = this.base_url;
    }
  }

  ngOnInit() {
    this.showloader = true;
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
    this.coinservice.profitlosslist().subscribe(resData => {
      if (resData.status === true) {
        for (let i = 0; i < resData.data.length; i++) {
          this.totalcost += resData.data[i]['totalcost'];
          this.value += resData.data[i]['current_price'] * resData.data[i]['coin_amount'];
        }
        this.overolsum = this.value;
        this.overolper = (this.value - this.totalcost) / this.totalcost * 100;
        this.profitlosslist = resData.data;
      } else {
        this.profitlosslist = '';
      }
    });
    this.coinservice.portfoliolist().subscribe(resData => {
      if (resData.status === true) {
        this.portfoliolist = resData.data;
        this.showloader = false;
      } else {
        this.portfoliolist = '';
        this.showloader = false;
      }
    });
    this.coinservice.getallcoin('').subscribe(resData => {
      if (resData.status === true) {
        this.allcoin = resData.data;
        if (this.allcoin.length > 0) {
          setTimeout(() => {
            $('#coin').select2('destroy');
            for (let i = 0; i < this.allcoin.length; i++) {
              if (this.allcoin[i]['symbol'] == 'BTC') {
                $('#coin').val(this.allcoin[i]['symbol']);
              }
            }
            $('#coin').select2();
            this.coin = $('#coin').val();
          }, 2000);
        }
      }
    });
    this.coinservice.getmaincurrencylist('').subscribe(resData => {
      if (resData.status === true) {
        this.allcurrency = resData.data;
        if (this.allcurrency.length > 0) {
          setTimeout(() => {
            $('#currency').select2('destroy');
            for (let i = 0; i < this.allcurrency.length; i++) {
              if (this.allcurrency[i]['currency_symbol'] == 'USD') {
                $('#currency').val(this.allcurrency[i]['currency_symbol']);
              }
            }
            $('#currency').select2();
            this.currency = $('#currency').val();
          }, 2000);
        }
      }
    });
  }

  ngAfterViewInit() {
    $('#coin').on('change', (e) => {
      this.coin = $(e.target).val();
    });

    $('#currency').on('change', (e) => {
      this.currency = $(e.target).val();
    });
  };

  getcoinprice(trans) {
    // tslint:disable-next-line:max-line-length
    trans.port_id = $('#port_id').val();
    trans.coin = this.coin;
    trans.currency = this.currency;
    if (trans.date != '' && trans.coin != '' && trans.currency != '' && trans.amount != '' && trans.port_id == '') {
      this.coinservice.getcoinprice(trans).subscribe(resData => {
        if (resData.Response === 'Error') {
          $('#value_coin').val('0');
        } else {
          $('#value_coin').val(resData[trans.coin][trans.currency] * trans.amount);
        }
      });
    } else {
      trans.date = $('#date').val();
      trans.coin = this.coin;
      trans.currency = this.currency;
      trans.amount = $('#amount').val();
      trans.value_coin = $('#value_coin').val();
      if (trans.date != '' && trans.coin != '' && trans.currency != '' && trans.amount != '') {

        this.coinservice.getcoinprice(trans).subscribe(resData => {
          if (resData.Response === 'Error') {
            $('#value_coin').val('0');
          } else {
            $('#value_coin').val(resData[trans.coin][trans.currency] * trans.amount);
          }
        });
      }
    }
  }

  onSubmitAddtransaction(trans) {
    trans.coin = this.coin;
    trans.currency = this.currency;
    trans.value_coin = $('#value_coin').val();
    trans.port_id = $('#port_id').val();
    if (trans.port_id === '') {
      this.coinservice.addtrade(trans).subscribe(resData => {
        if (resData.status === true) {
          this.toasterService.pop('success', 'Success', resData.message);
          setTimeout(() => {
            location.reload();
          }, 2000);
        } else {
          this.toasterService.pop('error', 'Error', resData.message);
        }
      });
    } else {
      trans.date = $('#date').val();
      trans.coin = $('#coin').val();
      trans.curr = $('#currency').val();
      trans.amount = $('#amount').val();
      trans.rate = $('#value_coin').val();
      this.coinservice.updatetrade(trans).subscribe(resData => {
        if (resData.status === true) {
          this.toasterService.pop('success', 'Success', resData.message);
          setTimeout(() => {
            location.reload();
          }, 2000);
        } else {
          this.toasterService.pop('error', 'Error', resData.message);
        }
      });
    }
  }

  edittrade(id) {
    this.coinservice.gettradesingledata(id).subscribe(resData => {
      if (resData.status === true) {
        const date = this.datePipe.transform(resData.data.transaction_date, 'yyyy-MM-dd');
        $('#date').val(date);
        $('#coin').select2('destroy');
        $('#coin').val(resData.data.buy_coin);
        $('#coin').select2();
        $('#currency').select2('destroy');
        $('#currency').val(resData.data.b_currency);
        $('#currency').select2();
        $('#amount').val(resData.data.coin_amount);
        $('#value_coin').val(resData.data.bc_price);
        $('#port_id').val(resData.data.id);
        $('#add-transaction').modal('toggle');
      } else {
        this.toasterService.pop('error', 'Error', resData.message);
      }
    });
  }

  traderemove(tradeid) {
    let th = this;
    this.translateService.get(['PORTFOLIO']).subscribe(translations => {
      bootbox.confirm({
        closeButton: false,
        title: translations.PORTFOLIO.confirmtitle,
        message: translations.PORTFOLIO.confirmmessage,
        buttons: {
          confirm: {
            label: translations.PORTFOLIO.confirmbtn,
            className: 'btn-success'
          },
          cancel: {
            label: translations.PORTFOLIO.cancelbtn,
            className: 'btn-danger'
          }
        },
        callback: function (result) {
          if (result) {
            th.coinservice.removetrade(tradeid).subscribe(resData => {
              if (resData.status === true) {
                th.toasterService.pop('success', 'Success', resData.message);
                location.reload();
              } else {
                th.toasterService.pop('error', 'Error', resData.message);
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
