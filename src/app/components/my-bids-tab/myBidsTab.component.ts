import { Component, OnInit } from '@angular/core';
import {BidThumbnail} from "../../interfaces/BidThumbnail";
import {RequestService} from "../../services/request.service";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {UtilService} from "../../services/util.service";
import {serverLinks,serverParameters} from "../../constants/server";

@Component({
  selector: 'app-my-bids-tab',
  templateUrl: './myBidsTab.component.html',
  styleUrls: ['./myBidsTab.component.css']
})
export class MyBidsTabComponent implements OnInit {

  serverLink : string
  serverParameter : string

  bidThumbnails : BidThumbnail[]
  imageLinks: any[]
  username : string

  // pagination
  pageSize: number
  pageIndex: number
  totalPages: number

  constructor(public utilService: UtilService, private requestService: RequestService,
              private authService : AuthService, private router: Router) {

    this.serverLink = serverLinks[0]
    this.serverParameter = serverParameters.mediaParameter

    this.bidThumbnails = []
    this.imageLinks = []
    this.username = this.authService.getUsername()!

    // pagination
    this.pageSize = 6
    this.pageIndex = 0
    this.totalPages = 0

  }

  getBidThumbnails(username: string, pageIndex: number, pageSize: number): void {
    this.requestService.getBidThumbnails(username, pageIndex, pageSize).subscribe(
      // if user's bids were fetched successfully
      response => {

        // reset the 2 arrays
        this.bidThumbnails = []
        this.imageLinks = []
        // fill the bid array and image array
        for (let thumbnail of response.objects)
        {
          this.bidThumbnails.push(thumbnail)
          this.imageLinks.push([0])
        }

        // update total pages
        this.totalPages = response.totalPages
        //update page index
        pageIndex>this.totalPages ? this.pageIndex = this.totalPages : this.pageIndex = pageIndex

      }
      // if user's bids weren't fetched
      ,error=>{}
    )
  }

  getPreviousPage(): void{
    if(this.pageIndex>1)
      this.getBidThumbnails(this.username,this.pageIndex-1,this.pageSize)
  }

  getNextPage(): void{
    if(this.pageIndex<this.totalPages)
      this.getBidThumbnails(this.username,this.pageIndex+1,this.pageSize)
  }

  // redirect to Auction page (from my bids, my purchases, auction-browsing-navigation-panel)
  moreInfo(index: number) : void{
    let selection = window.getSelection()
    if(selection?.toString().length)
      return

    let auctionID = this.bidThumbnails[index].auctionID
    this.router.navigate(['auctions',auctionID,'view'])
  }

  ngOnInit(): void {
    this.getBidThumbnails(this.username,1,this.pageSize)
  }

  getNextImage(index: number) : void {
    this.imageLinks[index] = (this.imageLinks[index] + 1)%(this.bidThumbnails[index].images.length)
  }

  getPreviousImage(index: number) : void {
    this.imageLinks[index] > 0 ? this.imageLinks[index]-- : this.imageLinks[index] = this.bidThumbnails[index].images.length-1
  }

}
