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
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css'],
  providers: [CoinService],
})
export class ChangepasswordComponent implements OnInit {

  private toasterService: ToasterService;

  public login_ses: any = myGlobals.login_ses;
  public base_url: any = myGlobals.base_url;
  pass = {
    old_pass: '',
    new_pass: '',
    con_pass: ''
  };
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
  }

  onSubmitChangePassword() {
    if (this.pass.old_pass === '') {
      this.toasterService.pop('error', 'Required', 'Please enter old password');
    } else if (this.pass.new_pass === '') {
      this.toasterService.pop('error', 'Required', 'Please enter new password');
    } else if (this.pass.con_pass === '') {
      this.toasterService.pop('error', 'Required', 'Please enter confirm password');
    } else if (this.pass.new_pass !== this.pass.con_pass) {
      this.toasterService.pop('error', 'Required', 'Password does not match !');
    } else {
      this.coinservice.passwordchange(this.pass).subscribe(resData => {
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
