import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';
import { StockChart } from 'angular-highcharts';
import { defer } from 'q';
import { DatePipe } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import * as moment from 'moment';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-coin',
  templateUrl: './coin.component.html',
  styleUrls: ['./coin.component.css'],
  providers: [CoinService, DatePipe],
})
export class CoinComponent implements OnInit {

  private toasterService: ToasterService;

  public toasterconfig: ToasterConfig =
    new ToasterConfig({
      showCloseButton: true,
      tapToDismiss: false,
      timeout: 2000
    });

  chart: StockChart;
  market_cap: any;
  price_usd: any;
  volume_usd: any;
  coin: any = Array();
  tempgraph: any = Array();
  selectedIndex: any = 6;
  perioddata: any;
  public follow: any;
  public base_url: any = myGlobals.base_url;
  public loginData: any = myGlobals.login_ses;
  public userid: any = myGlobals.userid;
  public basecurr: any = myGlobals.basecurr;
  public base_sing: any = myGlobals.base_sing;
  default_lang:any=myGlobals.default_lang;

  // tslint:disable-next-line:max-line-length
  constructor(private translateService: TranslateService,private coinservice: CoinService, private router: Router, toasterService: ToasterService, private http: Http, private titleService: Title, private datePipe: DatePipe, private meta: Meta) {
    this.translateService.use(this.default_lang);
    localStorage.setItem('sorton', null);
    localStorage.setItem('sortby', null);
    this.toasterService = toasterService;

    this.perioddata = localStorage.getItem('period');
    if (this.perioddata === 'hour') {
      this.selectedIndex = 1;
    } else if (this.perioddata === 'day') {
      this.selectedIndex = 2;
    } else if (this.perioddata === 'week') {
      this.selectedIndex = 3;
    } else if (this.perioddata === 'month') {
      this.selectedIndex = 4;
    } else if (this.perioddata === 'year') {
      this.selectedIndex = 5;
    } else if (this.perioddata === 'all') {
      this.selectedIndex = 6;
    } else {
      this.selectedIndex = 1;
      this.perioddata = 'hour';
    }
  }

  toggleClass(period, index: number) {
    // event.target.classList.toggle('active');
    // tslint:disable-next-line:triple-equals
    if (this.selectedIndex == index) {
      this.selectedIndex = -1;
    } else {
      this.selectedIndex = index;
      this.realTimeGraph(period);
    }
  }

  followcoin(coin) {
    this.coinservice.cointrackbyuser(coin.followstatus, coin.coin_id, coin.name).subscribe(resData => {
      if (resData.status === true) {
        if (this.follow === 1) {
          this.follow = 0;
          coin.followstatus = 0;
        } else {
          this.follow = 1;
          coin.followstatus = 1;
        }
        this.toasterService.pop('success', 'Success', resData.message);
      } else {
        this.toasterService.pop('error', 'Error', 'Something went wrong please try after sometime !');
      }
    });
  }

  getsinglecoinData() {
    const url = window.location.pathname;
    const turl = url.split('/');
    const coinid = turl[2].split('-');
    coinid.splice(coinid.length - 2, 2);
    const coinurl = coinid.join('-');
    this.coinservice.getSingleCoin(coinurl).subscribe(resData => {
      if (resData.status === true) {
        this.follow = resData.data.followstatus;
        this.coin = resData.data;
        console.log(this.coin);
        this.titleService.setTitle(resData.data.name + ' (' + resData.data.symbol + ') Price');
      }
    });
  }

  ngOnInit() {
    this.getsinglecoinData();
    this.realTimeGraph(this.perioddata);
    /* const curl = window.location.href;
    const turl = curl.split('/');
    const ccoin = turl[4].split('-');
    const durl = curl.replace('/' + ccoin[0], '');
    this.coinservice.getSingleCoin(ccoin[0]).subscribe(responce => {
      if (responce.status === true) {
        this.coin = responce.data;
        this.coinservice.gettestseometa(durl).subscribe(resData => {
          if (resData.status === true) {
            const temptitle = resData.data.title;
            const title = temptitle.replace('[COIN]', this.coin.name);
            resData.data.title = title.replace('[COIN_SYMBOL]', this.coin.symbol);
            this.titleService.setTitle(resData.data.title);
            const tempdesc = resData.data.description;
            const desc = tempdesc.replace('[COIN]', this.coin.name);
            resData.data.description = desc.replace('[COIN_SYMBOL]', this.coin.symbol);
            this.meta.addTag({ name: 'description', content: resData.data.description });
            const tempkeyw = resData.data.description;
            const keyw = tempkeyw.replace('[COIN]', this.coin.name);
            resData.data.keywords = keyw.replace('[COIN_SYMBOL]', this.coin.symbol);
            this.meta.addTag({ name: 'keywords', content: resData.data.keywords });
            this.meta.addTag({ name: 'author', content: 'cryptoprices' });
            this.meta.addTag({ name: 'robots', content: resData.data.robots });
            this.meta.addTag({ name: 'title', content: 'www.cryptoprices.io' });
          }
        });
      }
    }); */
  }

  realTimeGraph(period) {
    localStorage.setItem('period', period);
    this.perioddata = localStorage.getItem('period');
    const url = window.location.pathname;
    const turl = url.split('/');
    const coinid = turl[2].split('-');
    coinid.splice(coinid.length - 2, 2);
    const coinurl = coinid.join('-');
    this.coinservice.getGraphData('all', coinurl).subscribe(response => {
      this.market_cap = response.market_cap;
      this.price_usd = response.price_usd;
      this.volume_usd = response.volume_usd;
      this.chart = new StockChart({
        chart: {
          // type: 'area',
          backgroundColor: null,
        },
        rangeSelector: {
          buttons: [
          {
            type: 'week',
            count: 1,
            text: '1w',
          }, {
            type: 'month',
            count: 1,
            text: '1m',
          }, {
            type: 'month',
            count: 3,
            text: '3m'
          }, {
            type: 'month',
            count: 6,
            text: '6m'
          }, {
            type: 'ytd',
            text: 'YTD'
          }, {
            type: 'year',
            count: 1,
            text: '1y'
          }, {
            type: 'all',
            text: 'All'
          }]
        },
        title: {
          text: this.coin.name + ' (' + this.coin.symbol + ') Price Chart',
          align:'left'
        },
        xAxis: {
          fillColor: {
            linearGradient: { x1: 0.5, y1: 0, x2: 0.5, y2: 1 },
            stops: [
              [0, 'rgba(61, 51, 121, 1)'],
              [0.40, 'rgba(61, 51, 121, 1)'],
              [1, 'rgba(255,128,51, .5)']
            ]
          },
        },
        plotOptions: {
          area: {
            lineWidth: 1,
            marker: {
              enabled: false
            },
            states: {
              hover: {
                lineWidth: 2
              }
            },
            series: {
              shadow: true
            },
            threshold: null
          }
        },
        credits: {
          enabled: false
        },
        yAxis: [
          {
            title: {
              text: "Price in USD",
              style: {
                color: '#F7931A'
              }
            },
          },
          {
            title: {
              text: "Market Cap",
              style: {
                color: '#808080'
              }
            },
            opposite: false,
          },
          {
            title: {
              text: "Volume in USD",
              style: {
                color: '#C0C0C0'
              }
            },
            opposite: false,
          },
        ],
        series: [{
          tooltip: {
            valueDecimals: 2
          },
          color: '#F7931A',
          name: 'Price in USD',
          data: this.price_usd,
          yAxis: 0,
        },
        {
          tooltip: {
            valueDecimals: 2
          },
          color: '#808080',
          name: 'Market Cap',
          data: this.market_cap,
          yAxis: 1,
        },
        {
          tooltip: {
            valueDecimals: 2
          },
          color: '#C0C0C0',
          name: 'Volume in USD',
          data: this.volume_usd,
          yAxis: 2,
        }]
      });
      this.tempgraph = this.coin;
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
