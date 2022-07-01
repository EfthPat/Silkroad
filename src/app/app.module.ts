import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AuctionBrowsingPanelComponent} from './components/auction-browsing-panel/auctionBrowsingPanel.component';
import {RequestService} from "./services/request.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxSliderModule} from '@angular-slider/ngx-slider';
import {SearchBarComponent} from './components/search-bar/searchBar.component';
import {CreateAuctionPanelComponent} from './components/create-auction-panel/createAuctionPanel.component';
import {MapComponent} from './components/map/map.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {GeoLocationComponent} from './components/geo-location/geo-location.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {AdministrationPanelComponent} from './components/administration-panel/administrationPanel.component';
import {MatRadioModule} from "@angular/material/radio";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {UserInformationPanelComponent} from './components/user-information-panel/userInformationPanel.component';
import {MyAuctionsTabComponent} from './components/my-auctions-tab/myAuctionsTab.component';
import {MyPurchasesTabComponent} from './components/my-purchases-tab/myPurchasesTab.component';
import {MyBidsTabComponent} from './components/my-bids-tab/myBidsTab.component';
import {NavigationPanelComponent} from './components/navigation-panel/navigationPanel.component';
import {MatTabsModule} from "@angular/material/tabs";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LoginPanelComponent} from './components/login-panel/loginPanel.component';
import {RegisterPanelComponent} from './components/register-panel/registerPanel.component';
import {HomePanelComponent} from './components/home-panel/homePanel.component';
import {AuthService} from "./services/auth.service";
import {TokenInterceptor} from "./interceptors/token.interceptor";
import {ViewAuctionComponent} from "./components/view-auction/view-auction.component";
import {MaterialModule} from "./material.module";
import {NgSelectModule} from "@ng-select/ng-select";
import {MessagePanelComponent} from "./components/message-panel/messagePanel.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MessageDialogComponent} from "./components/message-dialog/message-dialog.component";
import {CreateMessageComponent} from "./components/create-message-panel/createMessagePanel.component";
import {AuctionBidsPanelComponent} from "./components/auction-bids-panel/auctionBidsPanel.component";
import {AuctionExportDialogComponent} from "./components/auction-export-dialog/auctionExportDialog.component";
import {UtilService} from "./services/util.service";
import {ApprovalDialogComponent} from "./components/approval-dialog/approvalDialog.component";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {ImageSliderComponent} from "./components/image-slider/image-slider.component";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {DataService} from "./services/data.service";
import {AlertDialogComponent} from "./components/alert-dialog/alert-dialog.component";
import {DateTimePickerComponent} from "./components/date-time-picker/dateTimePicker.component";
import {MatInputModule} from "@angular/material/input";
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from "@angular-material-components/datetime-picker";

@NgModule({

  // COMPONENTS, DIRECTIVES, PIPES ..
  declarations: [
    AppComponent,
    AuctionBrowsingPanelComponent,
    SearchBarComponent,
    CreateAuctionPanelComponent,
    MapComponent,
    GeoLocationComponent,
    AdministrationPanelComponent,
    UserInformationPanelComponent,
    MyAuctionsTabComponent,
    MyPurchasesTabComponent,
    MyBidsTabComponent,
    NavigationPanelComponent,
    LoginPanelComponent,
    RegisterPanelComponent,
    HomePanelComponent,
    ViewAuctionComponent,
    MessagePanelComponent,
    MessageDialogComponent,
    CreateMessageComponent,
    AuctionBidsPanelComponent,
    AuctionExportDialogComponent,
    ImageSliderComponent,
    AlertDialogComponent,
    DateTimePickerComponent,
    ApprovalDialogComponent
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
    NgMultiSelectDropDownModule.forRoot(),
    MatInputModule,
    NgxMatTimepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule
  ],
  // SERVICES , INTERCEPTORS
  providers: [
    RequestService,
    AuthService,
    UtilService,
    DataService,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [MessageDialogComponent]
})
export class AppModule {
}

// ng serve --ssl true --ssl-key ./ssl/localhost-key.pem --ssl-cert ./ssl/localhost.pem
