import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {AdminComponent} from "./components/admin/admin.component";
import {BrowsingComponent} from "./components/browsing/browsing.component";
import {UserInfoComponent} from "./components/user-info/user-info.component";
import {MyAuctionsComponent} from "./components/my-auctions/my-auctions.component";
import {MyPurchasesComponent} from "./components/my-purchases/my-purchases.component";
import {MyBidsComponent} from "./components/my-bids/my-bids.component";
import {PanelComponent} from "./components/panel/panel.component";
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {HomeComponent} from "./components/home/home.component";
import {GuestGuard} from "./Guards/guest.guard";
import {AuthGuard} from "./Guards/auth.guard";
import {AdminGuard} from "./Guards/admin.guard";
import {CreateAuctionComponent} from "./components/create-auction/create-auction.component";
import {ViewAuctionComponent} from "./components/view-auction/view-auction.component";
import {InboxComponent} from "./components/inbox/inbox.component";
import {CreateMessageComponent} from "./components/create-message/create-message.component";
import {AuctionBidsComponent} from "./components/auction-bids/auction-bids.component";
import {ImageSliderComponent} from "./components/image-slider/image-slider.component";


const routes: Routes = [

  //----------------------------------- PANEL PAGE -------------------------------------------------------------------//

  // PANEL/ADMINISTRATION/USERS
  {path: 'panel/administration/users', component: PanelComponent, canActivate: [AdminGuard],
    children: [
      {path: '', component: AdminComponent, outlet: 'administration'}
    ]
  },

  // PANEL/ADMINISTRATION/USERS --> ADMINISTRATION/USERS/:USERNAME
  {path: 'administration/users/:username', component: UserInfoComponent, canActivate: [AdminGuard]},


  // PANEL/MESSAGES/INBOX
  {path: 'panel/messages/inbox', component: PanelComponent, canActivate: [AuthGuard],
    children:[
      {path: '', component: InboxComponent, data: [false], outlet: 'messages'}
    ]
  },

  // PANEL/MESSAGES/OUTBOX
  {path: 'panel/messages/outbox', component: PanelComponent, canActivate: [AuthGuard],
    children:[
      {path: '', component: InboxComponent, data: [true], outlet: 'messages'}
    ]
  },

  // PANEL/MESSAGES/SEND
  {path: 'panel/messages/send', component: PanelComponent, canActivate: [AuthGuard],
    children:[
      {path: '', component: CreateMessageComponent, outlet: 'messages'}
    ]
  },

  // PANEL/ACTIVITY/MY-BIDS
  {path: 'panel/activity/my-bids', component: PanelComponent, canActivate: [AuthGuard],
    children: [
      {path: '', component: MyBidsComponent, outlet: 'activity'}
    ]
  },

  // PANEL/ACTIVITY/MY-PURCHASES
  {path: 'panel/activity/my-purchases', component: PanelComponent, canActivate: [AuthGuard],
    children: [
      {path: '', component: MyPurchasesComponent, outlet: 'activity'}
    ]
  },

  // PANEL/ACTIVITY/MY-AUCTIONS
  {path: 'panel/activity/my-auctions', component: PanelComponent, canActivate: [AuthGuard],
    children: [
      {path: '', component: MyAuctionsComponent, outlet: 'activity'}
    ]
  },


  // PANEL-RELATED REDIRECTIONS
  {path: 'panel/administration', redirectTo:'panel/administration/users' },
  {path: 'panel/messages', redirectTo: 'panel/messages/inbox'},
  {path: 'panel/activity', redirectTo:'panel/activity/my-bids' },
  {path: 'panel', redirectTo:'panel/activity/my-bids' },


  //---------------------------- CREATE / UPDATE / AUCTION BIDS / VIEW AUCTION ---------------------------------------//

  {path: 'auctions/create', component: CreateAuctionComponent, canActivate: [AuthGuard]},
  {path: 'auctions/:auctionID/update', component: CreateAuctionComponent, canActivate: [AuthGuard]},
  {path: 'auctions/:auctionID/bids', component: AuctionBidsComponent, canActivate: [AuthGuard]},
  {path: 'auctions/:auctionID/view', component: ViewAuctionComponent},

  //------------------------------ LOGIN / REGISTER ------------------------------------------------------------------//

  {path: 'login', component: LoginComponent, canActivate: [GuestGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [GuestGuard]},

  //------------------------------ BROWSE / HOME ---------------------------------------------------------------------//

  {path: 'browse', component: BrowsingComponent},
  {path: 'home', component: HomeComponent},



  // TODO : DELETE LATER

  {path:'slider',component: ImageSliderComponent},


  //---------------------------- ANY OTHER LINK REDIRECTS TO BROWSE PAGE ---------------------------------------------//
  {path: '**', redirectTo: '/browse'}




]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
