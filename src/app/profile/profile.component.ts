import { Component, OnInit } from '@angular/core';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { defer } from 'q';
import { Observable } from 'rxjs/Observable';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateService } from "@ngx-translate/core";

declare var $;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [CoinService],
})
export class ProfileComponent implements OnInit {

  private toasterService: ToasterService;

  public login_ses: any = myGlobals.login_ses;
  public base_url: any = myGlobals.base_url;
  profile = {
    name: '',
    email: '',
    d_currency: '',
  };
  prof = {
    uname: '',
    b_curr: ''
  };
  allcurrency: any;
  default_lang:any=myGlobals.default_lang;
  
  constructor(private translateService: TranslateService,private coinservice: CoinService, toasterService: ToasterService, private title: Title, private meta: Meta) {
    this.translateService.use(this.default_lang);
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
    this.coinservice.getprofileupdatedata().subscribe(resData => {
      if (resData.status === true) {
        this.profile = resData.data;
        console.log(this.profile);
      }
    });
    this.coinservice.getallcurrencylist().subscribe(resData => {
      if (resData.status === true) {
        this.allcurrency = resData.data;
        if (this.allcurrency.length > 0) {
          setTimeout(() => {
            $('#sel_curr').select2('destroy');
            for (let i = 0; i < this.allcurrency.length; i++) {
              if (this.allcurrency[i]['currency_symbol'] == this.profile.d_currency) {
                $('#sel_curr').val(this.allcurrency[i]['currency_symbol']);
              }
            }
            $('#sel_curr').select2();
            this.prof.b_curr = $('#sel_curr').val();
          }, 2000);
        }
      }
    });
  }

  ngAfterViewInit() {
    $('#sel_curr').on('change', (e) => {
      this.prof.b_curr = $(e.target).val();
    });
  };

  onSubmitPrafile() {
    this.prof.uname = $('#unmae').val();
    if (this.prof.uname === '') {
      this.toasterService.pop('error', 'Required', 'Please enter name');
    } else {
      this.coinservice.profileupdate(this.prof).subscribe(resData => {
        if (resData.status === true) {
          this.toasterService.pop('success', 'Success', resData.message);
          setTimeout(() => {
            location.reload();
          }, 1000);
        } else {
          this.toasterService.pop('error', 'Error', resData.message);
        }
      });
    }
  }

}
