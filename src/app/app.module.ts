import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowsingComponent} from './components/browsing/browsing.component';
import {RequestService} from "./services/request.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxSliderModule} from '@angular-slider/ngx-slider';
import {SearchComponent} from './components/search/search.component';
import {CreateAuctionComponent} from './components/create-auction/create-auction.component';
import {MapComponent} from './components/map/map.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {GeoLocationComponent} from './components/geo-location/geo-location.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {AdminComponent} from './components/admin/admin.component';
import {MatRadioModule} from "@angular/material/radio";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {UserInfoComponent} from './components/user-info/user-info.component';
import {MyAuctionsComponent} from './components/my-auctions/my-auctions.component';
import {MyPurchasesComponent} from './components/my-purchases/my-purchases.component';
import {MyBidsComponent} from './components/my-bids/my-bids.component';
import {PanelComponent} from './components/panel/panel.component';
import {MatTabsModule} from "@angular/material/tabs";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {HomeComponent} from './components/home/home.component';
import {AuthService} from "./services/auth.service";
import {TokenInterceptor} from "./Interceptors/token.interceptor";
import {ErrorInterceptor} from "./Interceptors/error.interceptor";
import {CalendarComponent} from './components/calendar/calendar.component';
import {MyMessagesComponent} from "./components/my-messages/my-messages.component";
import {ViewAuctionComponent} from "./components/view-auction/view-auction.component";
import {MaterialModule} from "./material.module";
import {NgSelectModule} from "@ng-select/ng-select";
import {InboxComponent} from "./components/inbox/inbox.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MessageDialogComponent} from "./components/message-dialog/message-dialog.component";
import {CreateMessageComponent} from "./components/create-message/create-message.component";
import {AuctionBidsComponent} from "./components/auction-bids/auction-bids.component";
import {DaterangeComponent} from "./components/daterange/daterange.component";
import {ExportComponent} from "./components/export/export.component";
import {UtilService} from "./services/util.service";
import {DeleteDialogComponent} from "./components/delete-dialog/delete-dialog.component";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {ImageSliderComponent} from "./components/image-slider/image-slider.component";

@NgModule({

  // COMPONENTS, DIRECTIVES, PIPES ..
  declarations: [
    AppComponent,
    BrowsingComponent,
    SearchComponent,
    CreateAuctionComponent,
    MapComponent,
    GeoLocationComponent,
    AdminComponent,
    UserInfoComponent,
    MyAuctionsComponent,
    MyPurchasesComponent,
    MyBidsComponent,
    PanelComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    CalendarComponent,
    MyMessagesComponent,
    ViewAuctionComponent,
    InboxComponent,
    MessageDialogComponent,
    CreateMessageComponent,
    AuctionBidsComponent,
    DaterangeComponent,
    ExportComponent,
    DeleteDialogComponent,
    ImageSliderComponent
  ],
  // MODULES
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        NgxSliderModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatRadioModule,
        MatCardModule,
        MatButtonModule,
        MatTabsModule,
        BrowserAnimationsModule,
        MaterialModule,
        FormsModule,
        NgSelectModule,
        MatDialogModule,
        MatCheckboxModule,
    ],
  // SERVICES , INTERCEPTORS
  providers: [
    RequestService,
    AuthService,
    UtilService,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents:[MessageDialogComponent]
})
export class AppModule {}

// ng serve --ssl true --ssl-key localhost-key.pem --ssl-cert localhost.pem
