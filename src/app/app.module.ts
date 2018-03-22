import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import { ToasterModule } from 'angular2-toaster';
// import { SocialLoginModule, AuthServiceConfig } from 'angular4-social-login';
// import { GoogleLoginProvider, FacebookLoginProvider } from 'angular4-social-login';

/* const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('657460625068-68ekbm870e00v3lio74ueumc718dgir6.apps.googleusercontent.com')
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('1592228807481172')
  }
]); */

/* const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('1068130394280-72jh1ani3q49lrpjpt190bu241bikhuj.apps.googleusercontent.com')
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('805993129602780')
  }
]); */

/* export function provideConfig() {
  return config;
} */

import highstock from 'highcharts/modules/stock.src';
import exporting from 'highcharts/modules/exporting.src';

import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { CoinComponent } from './coin/coin.component';
import { ContactusComponent } from './contactus/contactus.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { WidgetComponent } from './widget/widget.component';
import { NewsComponent } from './news/news.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ProfileComponent } from './profile/profile.component';
import { FaqComponent } from './faq/faq.component';
import { FollowlistComponent } from './followlist/followlist.component';
import { ProtfolioComponent } from './protfolio/protfolio.component';

export function highchartsModules() {
    return [ highstock, exporting ];
}

@NgModule({
  imports:      [
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent,
        pathMatch: 'full'
      },
      {
        path: 'cryptocurrency/:any',
        component: CoinComponent,
        pathMatch: 'full'
      },
      {
        path: 'contact-us',
        component: ContactusComponent,
        pathMatch: 'full'
      },
      {
        path: 'about-us',
        component: AboutusComponent,
        pathMatch: 'full'
      },
      {
        path: 'news',
        component: NewsComponent,
        pathMatch: 'full'
      },
      {
        path: 'calculator',
        component: CalculatorComponent,
        pathMatch: 'full'
      },
      {
        path: 'widget',
        component: WidgetComponent,
        pathMatch: 'full'
      },
      {
        path: 'change-password',
        component: ChangepasswordComponent,
        pathMatch: 'full'
      },
      {
        path: 'profile',
        component: ProfileComponent,
        pathMatch: 'full'
      },
      {
        path: 'faq',
        component: FaqComponent,
        pathMatch: 'full'
      },
      {
        path: 'followlist',
        component: FollowlistComponent,
        pathMatch: 'full'
      },
      {
        path: 'protfolio',
        component: ProtfolioComponent,
        pathMatch: 'full'
      },
    ]),
    BrowserModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    ChartModule,
    ToasterModule,
    // SocialLoginModule,
    // SocialLoginModule.initialize(config)
  ],
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    CoinComponent,
    ContactusComponent,
    CalculatorComponent,
    WidgetComponent,
    NewsComponent,
    AboutusComponent,
    ChangepasswordComponent,
    ProfileComponent,
    FaqComponent,
    FollowlistComponent,
    ProtfolioComponent,
  ],
  providers: [
    // { provide: HIGHCHARTS_MODULES, useFactory: highchartsModules }, { provide: AuthServiceConfig, useFactory: provideConfig }
    { provide: HIGHCHARTS_MODULES, useFactory: highchartsModules }
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
