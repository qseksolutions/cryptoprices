import { Component, OnInit } from '@angular/core';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { defer } from 'q';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';
import { Title, Meta } from '@angular/platform-browser';

declare var $: any;

@Component({
  selector: 'app-protfolio',
  templateUrl: './protfolio.component.html',
  styleUrls: ['./protfolio.component.css'],
  providers: [CoinService],
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

  constructor(private coinservice: CoinService, toasterService: ToasterService, private title: Title, private meta: Meta) {
    localStorage.setItem('sorton', null);
    localStorage.setItem('sortby', null);
    this.toasterService = toasterService;
    if (this.loginData == null) {
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
      } else {
        this.portfoliolist = '';
      }
    });
    this.coinservice.getallcoin('').subscribe(resData => {
      if (resData.status === true) {
        this.allcoin = resData.data;
        console.log(this.allcoin);
      }
    });
    this.coinservice.getmaincurrencylist('').subscribe(resData => {
      if (resData.status === true) {
        this.allcurrency = resData.data;
        console.log(this.allcurrency);
      }
    });
    setTimeout(() => {
      $('#currency').select2('destroy');
      $('#coin').select2('destroy');
      for (let i = 0; i < this.allcurrency.length; i++) {
        if (this.allcurrency[i]['currency_symbol'] == 'USD') {
          $('#currency').val(this.allcurrency[i]['currency_symbol']);
        }
      }
      for (let i = 0; i < this.allcoin.length; i++) {
        if (this.allcoin[i]['symbol'] == 'BTC') {
          $('#coin').val(this.allcoin[i]['symbol']);
        }
      }
      $('#currency').select2();
      $('#coin').select2();
      this.currency = $('#currency').val();
      this.coin = $('#coin').val();
    }, 5000);
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
    console.log(trans);
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
      /* trans.date = $('#date').val();
      trans.coin = this.coin;
      trans.currency = this.currency;
      trans.amount = $('#amount').val();
      trans.value_coin = $('#value_coin').val();
      if (trans.date != '' && trans.coin != '' && trans.currency != '' && trans.amount != '') {

        this.coinservice.getcoinprice(trans).subscribe(resData => {
          if (resData.Response === 'Error') {
            $('#rate').val('0');
          } else {
            $('#rate').val(resData[trans.coin][trans.currency] * trans.amount);
          }
        });
      } */
    }
  }

  onSubmitAddtransaction(trans) {
    console.log(trans);
    trans.coin = this.coin;
    trans.currency = this.currency;
    trans.value_coin = $('#value_coin').val();
    this.coinservice.addtrade(trans).subscribe(resData => {
      if (resData.status === true) {
        console.log(resData);
        this.toasterService.pop('success', 'Success', resData.message);
        this.ngOnInit();
        this.port = {
          port_id: '',
          coin: '',
          date: '',
          currency: '',
          amount: '',
          value_coin: ''
        };
        setTimeout(() => {
          $('#add-transaction').modal('toggle');
        }, 2000);
      } else {
        this.toasterService.pop('error', 'Error', resData.message);
      }
    });
  }

  traderemove(tradeid) {
    this.coinservice.removetrade(tradeid).subscribe(resData => {
      if (resData.status === true) {
        this.toasterService.pop('success', 'Success', resData.message);
        this.ngOnInit();
      } else {
        this.toasterService.pop('error', 'Error', resData.message);
      }
    });
  }

}
