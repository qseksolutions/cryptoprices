import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import * as myGlobals from './../global';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {
  default_lang:any=myGlobals.default_lang;
  constructor(private translateService: TranslateService) {
    this.translateService.use(this.default_lang);
  }

  ngOnInit() {
  }

}
