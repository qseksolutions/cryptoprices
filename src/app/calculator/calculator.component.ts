import { Component, OnInit } from '@angular/core';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { defer } from 'q';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css'],
  providers: [CoinService],
})
export class CalculatorComponent implements OnInit {

  maincurrencylist: any;
  allcoin: any;

  constructor(private coinservice: CoinService) { }

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
