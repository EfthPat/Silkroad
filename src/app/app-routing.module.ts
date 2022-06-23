import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {AdminPanelComponent} from "./components/admin-panel/adminPanel.component";
import {AuctionBrowsingPanelComponent} from "./components/auction-browsing-panel/auctionBrowsingPanel.component";
import {UserInformationPanel} from "./components/user-information-panel/userInformationPanel";
import {MyAuctionsTabComponent} from "./components/my-auctions-tab/myAuctionsTab.component";
import {MyPurchasesTabComponent} from "./components/my-purchases-tab/myPurchasesTab.component";
import {MyBidsTabComponent} from "./components/my-bids-tab/myBidsTab.component";
import {NavigationPanelComponent} from "./components/navigation-panel/navigationPanel.component";
import {LoginPanelComponent} from "./components/login-panel/loginPanel.component";
import {RegisterPanelComponent} from "./components/register-panel/registerPanel.component";
import {HomePanelComponent} from "./components/home-panel/homePanel.component";
import {GuestGuard} from "./guards/guest.guard";
import {AuthGuard} from "./guards/auth.guard";
import {AdminGuard} from "./guards/admin.guard";
import {CreateAuctionComponent} from "./components/create-auction/create-auction.component";
import {ViewAuctionComponent} from "./components/view-auction/view-auction.component";
import {MessagePanelComponent} from "./components/message-panel/messagePanel.component";
import {CreateMessageComponent} from "./components/create-message/create-message.component";
import {AuctionBidsPanelComponent} from "./components/auction-bids-panel/auctionBidsPanel.component";
import {endpoints} from "./constants/pageLinks";


const routes: Routes = [


  //----------------------------------- PANEL PAGE -------------------------------------------------------------------//


  // PANEL/ADMINISTRATION/USERS
  {path: endpoints.users, component: NavigationPanelComponent, canActivate: [AdminGuard],
    children: [
      {path: '', component: AdminPanelComponent, outlet: 'administration'}
    ]
  },

  // PANEL/ADMINISTRATION/USERS --> ADMINISTRATION/USERS/:USERNAME
  {path: 'administration/users/:username', component: UserInformationPanel, canActivate: [AdminGuard]},


  // PANEL/MESSAGES/INBOX
  {path: endpoints.inbox, component: NavigationPanelComponent, canActivate: [AuthGuard],
    children:[
      {path: '', component: MessagePanelComponent, data: [false], outlet: 'messages'}
    ]
  },

  // PANEL/MESSAGES/OUTBOX
  {path: endpoints.outbox, component: NavigationPanelComponent, canActivate: [AuthGuard],
    children:[
      {path: '', component: MessagePanelComponent, data: [true], outlet: 'messages'}
    ]
  },

  // PANEL/MESSAGES/SEND
  {path: endpoints.send, component: NavigationPanelComponent, canActivate: [AuthGuard],
    children:[
      {path: '', component: CreateMessageComponent, outlet: 'messages'}
    ]
  },

  // PANEL/ACTIVITY/MY-BIDS
  {path: endpoints.myBids, component: NavigationPanelComponent, canActivate: [AuthGuard],
    children: [
      {path: '', component: MyBidsTabComponent, outlet: 'activity'}
    ]
  },

  // PANEL/ACTIVITY/MY-PURCHASES
  {path: endpoints.myPurchases, component: NavigationPanelComponent, canActivate: [AuthGuard],
    children: [
      {path: '', component: MyPurchasesTabComponent, outlet: 'activity'}
    ]
  },

  // PANEL/ACTIVITY/MY-AUCTIONS
  {path: endpoints.myAuctions, component: NavigationPanelComponent, canActivate: [AuthGuard],
    children: [
      {path: '', component: MyAuctionsTabComponent, outlet: 'activity'}
    ]
  },


  // PANEL-RELATED REDIRECTIONS
  {path: 'navigation-panel/administration', redirectTo: endpoints.users },
  {path: 'navigation-panel/messages', redirectTo: endpoints.inbox},
  {path: 'navigation-panel/activity', redirectTo: endpoints.myBids },
  {path: 'panel', redirectTo: endpoints.myBids },


  //---------------------------- CREATE / UPDATE / AUCTION BIDS / VIEW AUCTION ---------------------------------------//

  {path: endpoints.createAuction, component: CreateAuctionComponent, canActivate: [AuthGuard]},
  {path: 'auctions/:auctionID/update', component: CreateAuctionComponent, canActivate: [AuthGuard]},
  {path: 'auctions/:auctionID/bids', component: AuctionBidsPanelComponent, canActivate: [AuthGuard]},
  {path: 'auctions/:auctionID/view', component: ViewAuctionComponent},

  //------------------------------ LOGIN / REGISTER ------------------------------------------------------------------//

  {path: endpoints.login, component: LoginPanelComponent, canActivate: [GuestGuard]},
  {path: endpoints.register, component: RegisterPanelComponent, canActivate: [GuestGuard]},

  //------------------------------ BROWSE / HOME ---------------------------------------------------------------------//

  {path: endpoints.browse, component: AuctionBrowsingPanelComponent},
  {path: endpoints.home, component: HomePanelComponent},


  //---------------------------- ANY OTHER LINK REDIRECTS TO BROWSE PAGE ---------------------------------------------//
  {path: endpoints.generic, redirectTo: endpoints.browse}




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
