import { Component, OnInit } from '@angular/core';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { defer } from 'q';
import { Title, Meta } from '@angular/platform-browser';
import { DecimalPipe } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css'],
  providers: [CoinService, DecimalPipe],
})
export class WidgetComponent implements OnInit {

  maincurrencylist: any;
  allcoin: any;
  currency: any;
  basecoin: any;
  widgetchange24: any;

  constructor(private coinservice: CoinService, private title: Title, private meta: Meta, private decimalpipe: DecimalPipe) {
    localStorage.setItem('sorton', null);
    localStorage.setItem('sortby', null);
  }

  ngOnInit() {
    this.coinservice.getmaincurrencylist('').subscribe(resData => {
      if (resData.status === true) {
        this.maincurrencylist = resData.data;
        console.log(this.maincurrencylist);
      } else {
        this.maincurrencylist = '';
      }
    });
    this.coinservice.getallcoin('').subscribe(resData => {
      if (resData.status === true) {
        this.allcoin = resData.data;
        console.log(resData.data);
      }
    });
    setTimeout(() => {
      $('#sel_curr').select2('destroy');
      $('#sel_coin').select2('destroy');
      for (let i = 0; i < this.maincurrencylist.length; i++) {
        if (this.maincurrencylist[i]['currency_symbol'] == 'USD') {
          $('#sel_curr').val(this.maincurrencylist[i]['currency_symbol']);
        }
      }
      for (let i = 0; i < this.allcoin.length; i++) {
        if (this.allcoin[i]['symbol'] == 'BTC') {
          $('#sel_coin').val(this.allcoin[i]['symbol']);
        }
      }
      $('#sel_curr').select2();
      $('#sel_coin').select2();
      this.currency = $('#sel_curr').val();
      this.basecoin = $('#sel_coin').val();
      this.getWidget();
    }, 2000);
  }

  ngAfterViewInit() {
    $('#sel_curr').on('change', (e) => {
      this.currency = $(e.target).val();
      this.getWidget();
    });

    $('#sel_coin').on('change', (e) => {
      this.basecoin = $(e.target).val();
      this.getWidget();
    });

  };

  getWidget() {
    this.coinservice.coinwidget(this.currency, this.basecoin).subscribe(resData => {
      if (resData.status === true) {
        this.widgetchange24 = resData.data.change24;
        console.log(this.widgetchange24);
        $('#coinrank').html('<i class="fas fa-star"></i> Rank '+resData.data.rank);
        $('#coinname').html(resData.data.name);
        const coin_price = this.decimalpipe.transform(resData.data.price, '1.0-2');
        $('#coinprice').html(coin_price+' '+this.currency);
        $('#coinchange24').html("("+resData.data.change24+")");
        $('#coinmarket').html('$'+resData.data.market_cap);
        $('#coinvolume24').html('$'+resData.data.volume24h);
      }
    });
  }

}
