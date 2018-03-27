import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { CoinService } from '../coin.service';
import * as myGlobals from './../global';
import { ToasterContainerComponent, ToasterService, ToasterConfig } from 'angular2-toaster';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css'],
  providers: [CoinService],
})
export class ContactusComponent implements OnInit {

  private toasterService: ToasterService;

  default_lang: any = myGlobals.default_lang;
  public base_url: any = myGlobals.base_url;
  regex: any;
  contact = {
    cname: '',
    cemail: '',
    message: '',
  };

  constructor(private translateService: TranslateService, private coinservice: CoinService, toasterService: ToasterService) {
    this.translateService.use(this.default_lang);
    localStorage.setItem('sorton', null);
    localStorage.setItem('sortby', null);
    this.toasterService = toasterService;
  }

  ngOnInit() {
  }

  onsubmitsendcontactus() {
    console.log(this.contact);
    this.regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (this.contact.cname === '') {
      this.toasterService.pop('error', 'Required', 'Please enter name');
    } else if (this.contact.cemail === '') {
      this.toasterService.pop('error', 'Required', 'Please enter email');
    } else if (this.contact.cemail.length === 0 || !this.regex.test(this.contact.cemail)) {
      this.toasterService.pop('error', 'Required', 'Please enter valid email');
    } else if (this.contact.message === '') {
      this.toasterService.pop('error', 'Required', 'Please enter message');
    } else {
      this.coinservice.addcontactus(this.contact).subscribe(resData => {
        if (resData.status === true) {
          this.toasterService.pop('success', 'Success', resData.message);
          setTimeout(() => {
            location.reload();
          }, 1000);
        } else {
          this.toasterService.pop('error', 'Required', 'Something went wrong please try after sometime !');
        }
      });
    }
  }

}
