import { Component, OnInit } from '@angular/core';
import { CoinService } from '../coin.service';
import { DecimalPipe } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-coinwidget',
  templateUrl: './coinwidget.component.html',
  styleUrls: ['./coinwidget.component.css'],
  providers: [CoinService, DecimalPipe],
})
export class CoinwidgetComponent implements OnInit {
  basecoin: any;
  currency: any;
  widgetchange24:any=25;

  constructor(private coinservice: CoinService, private decimalpipe: DecimalPipe) { }

  ngOnInit() {
    const url = window.location.pathname;
    const segment = url.split('/');
    this.basecoin = segment[2];
    this.currency = segment[3];
    this.getWidget();
  }

  getWidget() {
    this.coinservice.coinwidget(this.currency, this.basecoin).subscribe(resData => {
      if (resData.status === true) {
        this.widgetchange24 = resData.data.change24;
        $('#coinrank').html('<i class="fas fa-star"></i> Rank '+resData.data.rank);
        $('#coinname').html(resData.data.name+' ('+this.basecoin+')');
        const coin_price = this.decimalpipe.transform(resData.data.price, '1.0-2');
        $('#coinprice').html(coin_price+' '+this.currency);
        $('#coinchange24').html("("+resData.data.change24+"%)");
        $('#coinmarket').html('$'+resData.data.market_cap);
        $('#coinvolume24').html('$'+resData.data.volume24h);
      }
    });
  }

}
