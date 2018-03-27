import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';
// import { AuthService } from 'angular4-social-login';
import { SocialUser } from 'angular4-social-login';
// import { FacebookLoginProvider, GoogleLoginProvider } from 'angular4-social-login';
import { defer } from 'q';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { window } from 'rxjs/operator/window';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [CoinService],
})
export class HeaderComponent implements OnInit {
  lang_name: any;
  default_lang: any;

  private toasterService: ToasterService;
  public toasterconfig: ToasterConfig =
    new ToasterConfig({
      showCloseButton: true,
      tapToDismiss: false,
      timeout: 2000
    });

  public base_url: any = myGlobals.base_url;
  public loginData: any = myGlobals.login_ses;
  public basecurr: any = myGlobals.basecurr;
  public base_sing: any = myGlobals.base_sing;
  public token: any = myGlobals.token;
  public login_ses: any = 0;
  maincurrencylist: any;
  subcurrencylist: any;
  private user: SocialUser;
  private loggedIn: boolean;
  public model: any;
  public forgot: any;
  regex: any;
  curl: any;
  allcoin: any;
  values: any;
  sociallogin: any = 0;
  public coincount: any;
  public totalcoin: any;
  public totalmarket: any = 0;
  public totaltrade: any = 0;
  public btcmarketcap: any;

  login = {
    email: '',
    password: ''
  };
  register = {
    username: '',
    useremail: '',
    userpass: '',
    userconpass: ''
  };
  selectedImg:any=myGlobals.default_lang;
  selectedLang:any=myGlobals.lang_name;
  language : any=[{"image":"english", "lang":"Engish"}, {"image":"chinese", "lang":"简体中文"}, {"image":"japanese", "lang":"日本語"}, {"image":"korean", "lang":"한국어"}, {"image":"vietnamese", "lang":"Tiếng Việt"}, {"image":"spanish", "lang":"Español"}, {"image":"portugueseBrazil", "lang":"Brazil Português"}, {"image":"german", "lang":"Deutsche"}, {"image":"russian", "lang":"русский"}, {"image":"italian", "lang":"Italiano"}, {"image":"french", "lang":"Français"}, {"image":"hindi", "lang":"हिंदी"}];

  // tslint:disable-next-line:max-line-length
  constructor(private translateService: TranslateService,private coinservice: CoinService, private router: Router, toasterService: ToasterService) {
    console.log('token = ' + this.token);
    const href = location.href;
    const url = href.split('/');
    if (url[3] === '') {
      this.curl = 'home';
    } else {
      this.curl = url[3];
    }

    this.toasterService = toasterService;
    if (this.basecurr == null) {
      localStorage.setItem('base', 'USD');
      localStorage.setItem('base_sing', '$');
      this.basecurr = 'USD';
    } else {
      localStorage.setItem('base', this.basecurr);
      localStorage.setItem('base_sing', this.base_sing);
    }
    this.regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    // tslint:disable-next-line:triple-equals
    if (this.loginData == null) {
      this.login_ses = 1;
    } else {
      this.login_ses = 0;
    }


  }

  ngOnInit() {
    this.coinservice.getCoinCountsecond().subscribe(responceData => {
    });
    this.coinservice.getCoinCount().subscribe(responceData => {
      if (responceData.status === true) {
        this.totalmarket = responceData.data['totalmarketcap_' + this.basecurr];
        this.totaltrade = responceData.data['totalvolume_' + this.basecurr];
        this.btcmarketcap = responceData.data.btc_marketcap;
        const total = responceData.data.totalcoins / 50;
        this.coincount = Math.ceil(total);
        this.totalcoin = responceData.data.totalcoins;
      } else {
        this.totalmarket = 0;
        this.totaltrade = 0;
        this.coincount = 0;
        this.totalcoin = 0;
      }
    });
    this.coinservice.getmaincurrencylist('').subscribe(resData => {
      if (resData.status === true) {
        this.maincurrencylist = resData.data;
      } else {
        this.maincurrencylist = '';
      }
    });
    this.coinservice.getallcoin('').subscribe(resData => {
      if (resData.status === true) {
        this.allcoin = resData.data;
      }
    });
  }

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .map(term => term === '' ? []
        : this.allcoin.filter(v => v.fullname.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))

  formattersearch = (x: { name: string, symbol: string }) => x.name + ' (' + x.symbol + ')';

  keyDownFunction(event) {
    if (event.keyCode === 13) {
      location.href = this.base_url + 'cryptocurrency/' + this.model.id + '-' + this.model.symbol.toLowerCase() + '-price';
    }
  }

  getcurrency(event: any) {
    this.values = event.target.value;
    this.coinservice.getmaincurrencylist(this.values).subscribe(resData => {
      if (resData.status === true) {
        this.maincurrencylist = resData.data;
      } else {
        this.maincurrencylist = '';
      }
    });
    this.coinservice.getsubcurrencylist(this.values).subscribe(resData => {
      if (resData.status === true) {
        this.subcurrencylist = resData.data;
      } else {
        this.subcurrencylist = '';
      }
    });
  }

  onSubmitLogin() {
    if (this.login.email === '') {
      this.toasterService.pop('error', 'Required', 'Please enter email');
    } else if (this.login.email.length === 0 || !this.regex.test(this.login.email)) {
      this.toasterService.pop('error', 'Required', 'Please enter valid email');
    } else if (this.login.password === '') {
      this.toasterService.pop('error', 'Required', 'Please enter password');
    } else {
      this.coinservice.loginuserdata(this.login).subscribe(resData => {
        if (resData.status === true) {
          console.log(resData);
          this.coinservice.getbasesign(resData.data.d_currency).subscribe(res => {
            if (res.status === true) {
              this.toasterService.pop('success', 'Success', resData.message);
              localStorage.setItem('login_ses', resData.status);
              localStorage.setItem('id', resData.data.id);
              localStorage.setItem('email', resData.data.email);
              localStorage.setItem('name', resData.data.name);
              localStorage.setItem('usertype', resData.data.usertype);
              localStorage.setItem('status', resData.data.status);
              localStorage.setItem('base', resData.data.d_currency);
              localStorage.setItem('user_base', resData.data.d_currency);
              localStorage.setItem('base_sing', res.data.currency_sign);
              localStorage.setItem('token', resData.data.token);
              setTimeout(() => {
                location.reload();
              }, 1000);
            }
          });
        } else {
          this.toasterService.pop('error', 'Error', resData.message);
        }
      });
    }
  }

  onSubmitRegister() {
    if (this.register.username === '') {
      this.toasterService.pop('error', 'Required', 'Please enter name');
    } else if (this.register.useremail === '') {
      this.toasterService.pop('error', 'Required', 'Please enter email');
    } else if (this.register.useremail.length === 0 || !this.regex.test(this.register.useremail)) {
      this.toasterService.pop('error', 'Required', 'Please enter valid email');
    } else if (this.register.userpass === '') {
      this.toasterService.pop('error', 'Required', 'Please enter password');
    } else if (this.register.userpass !== this.register.userconpass) {
      this.toasterService.pop('error', 'Required', 'Password does not match !');
    } else {
      this.coinservice.newuserregister(this.register).subscribe(resData => {
        // tslint:disable-next-line:triple-equals
        if (resData.status == true) {
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

  onSubmitforgotpassword() {
    if (this.forgot === '' || this.forgot === undefined) {
      this.toasterService.pop('error', 'Required', 'Please enter email');
    } else {
      this.coinservice.forgotpassword(this.forgot).subscribe(resData => {
        // tslint:disable-next-line:triple-equals
        if (resData.status == true) {
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

  destroyUser() {
    // this.authService.signOut();
    localStorage.clear();
    location.href = this.base_url;
    localStorage.setItem('default_lang','english');
    localStorage.setItem('lang_name','English');
  }

  closeNav(basecur, base_sing) {
    localStorage.setItem('base', basecur);
    localStorage.setItem('base_sing', base_sing);
    location.reload();
  }
  
  changeLang(lang, lnName: string) {
    this.selectedLang = lang;
    this.selectedImg = lnName;
    // this.translateService.setDefaultLang(lnName);
    localStorage.setItem('default_lang',lnName);
    localStorage.setItem('lang_name',lang);
    this.translateService.use(lnName);
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
