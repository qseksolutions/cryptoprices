import { Component, OnInit } from '@angular/core';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { defer } from 'q';
import { Title, Meta } from '@angular/platform-browser';
import { DecimalPipe } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css'],
  providers: [CoinService, DecimalPipe],
})
export class CalculatorComponent implements OnInit {

  maincurrencylist: any;
  allcoin: any;
  currency: any;
  basecoin: any;
  convcoin: any;
  showloader: any;

  constructor(private coinservice: CoinService, private title: Title, private meta: Meta, private decimalpipe: DecimalPipe) {
    localStorage.setItem('sorton', null);
    localStorage.setItem('sortby', null);
    this.showloader = true;
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
      $('#sel_base').select2('destroy');
      $('#sel_convert').select2('destroy');
      for (let i = 0; i < this.maincurrencylist.length; i++) {
        if (this.maincurrencylist[i]['currency_symbol'] == 'USD') {
          $('#sel_curr').val(this.maincurrencylist[i]['currency_symbol']);
        }
      }
      for (let i = 0; i < this.allcoin.length; i++) {
        if (this.allcoin[i]['symbol'] == 'BTC') {
          $('#sel_base').val(this.allcoin[i]['symbol']);
          $('#sel_convert').val(this.allcoin[i]['symbol']);
        }
      }
      $('#sel_curr').select2();
      $('#sel_base').select2();
      $('#sel_convert').select2();
      this.currency = $('#sel_curr').val();
      this.basecoin = $('#sel_base').val();
      this.convcoin = $('#sel_convert').val();
      this.changevalue();
    }, 2000);
  }

  changeamount() {
    this.changevalue();
  }

  ngAfterViewInit() {
    $('#sel_curr').on('change', (e) => {
      this.currency = $(e.target).val();
      this.changevalue();
    });

    $('#sel_base').on('change', (e) => {
      this.basecoin = $(e.target).val();
      this.changevalue();
    });

    $('#sel_convert').on('change', (e) => {
      this.convcoin = $(e.target).val();
      this.changevalue();
    });
  };

  changevalue() {
    this.showloader = true;
    this.coinservice.coincalculator(this.currency, this.basecoin, this.convcoin).subscribe(resData => {
      if (resData.status === true) {
        
        const amount = $('#amt').val();
        $('#amout').html(amount);
        const convert_coin = this.decimalpipe.transform(resData.data.convertCoin * amount, '1.0-8');
        $('#convert_coin').html(convert_coin);
        const convert_curr = this.decimalpipe.transform(resData.data.convertCurrency * amount, '1.0-2');
        $('#convert_curr').html(convert_curr + '<span class="calc-curr-symbol"> ' + this.currency + '</span>');
        this.showloader = false;
      }
    });
  }
}
