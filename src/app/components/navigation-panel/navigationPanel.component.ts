import {Component, OnChanges, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AuctionExportDialogComponent} from "../auction-export-dialog/auctionExportDialog.component";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {endpoints} from "../../constants/pageLinks";

@Component({
  selector: 'app-navigation-panel',
  templateUrl: './navigationPanel.component.html',
  styleUrls: ['./navigationPanel.component.css']
})
export class NavigationPanelComponent implements OnInit, OnChanges {

  tabIndex: number | undefined
  userRole: string
  activeElement: number
  _activeElement: number
  endpointSet : any

  constructor(private dialog: MatDialog, private authService: AuthService, private route: ActivatedRoute, private router: Router) {

    //
    this.endpointSet = endpoints

    this.activeElement = this._activeElement = 0
    this.userRole = this.authService.getUserRole()
    this.setTab()
  }

  setTab(): void {

    let splitUrl = this.router.url.split('/')

    if (splitUrl[2] === "activity") {

      this.tabIndex = 0
      this._activeElement = 1

      if (splitUrl[3].startsWith("my-bids"))
        this.activeElement = 1
      else if (splitUrl[3].startsWith("my-purchases"))
        this.activeElement = 2
      else
        this.activeElement = 3

    } else if (splitUrl[2] === "messages") {

      this.tabIndex = 1
      this.activeElement = 1

      if (splitUrl[3].startsWith("send"))
        this._activeElement = 1
      else if (splitUrl[3].startsWith("inbox"))
        this._activeElement = 2
      else
        this._activeElement = 3

    } else {
      this.tabIndex = 2
      this.activeElement = this._activeElement = 1
    }

  }

  navigate(url: string): void {

    this.router.navigate([url])

  }

  export(): void {

    let dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;

    this.dialog.open(AuctionExportDialogComponent, dialogConfig);

  }

  changeUrl(event : MatTabChangeEvent): void{

    if(event.index==0)
      this.router.navigate([endpoints.myBids])
    else if(event.index==1)
      this.router.navigate([endpoints.send])
    else
      this.router.navigate([endpoints.users])


  }

  ngOnInit() {}

  ngOnChanges(): void {}

}
