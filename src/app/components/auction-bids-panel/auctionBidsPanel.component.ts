import { Component, OnInit } from '@angular/core';
import {RequestService} from "../../services/request.service";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuctionBid} from "../../interfaces/AuctionBid";
import {UtilService} from "../../services/util.service";
import {serverLinks, serverParameters} from "../../constants/server";
import {endpoints} from "../../constants/pageLinks"

@Component({
  selector: 'app-auction-bids-panel',
  templateUrl: './auctionBidsPanel.component.html',
  styleUrls: ['./auctionBidsPanel.component.css']
})
export class AuctionBidsPanelComponent implements OnInit {

  serverLink: string
  serverParameter: string

  name: string
  totalBids: number
  highestBid: number
  startDate: string
  endDate: string
  description: string
  images: any[]
  activeImage: number
  buyPrice: number
  address: string
  currentBidTitle: string
  currentBid: number

  auctionBids: AuctionBid[]
  username : string
  auctionID : number



  pageSize: number
  pageIndex: number
  totalPages: number

  constructor(private router: Router, private route: ActivatedRoute, private requestService : RequestService,
              private authService : AuthService, public utilService: UtilService) {

    this.currentBidTitle = ""
    this.currentBid = 0


    this.serverLink = serverLinks[0]
    this.serverParameter = serverParameters.mediaParameter

    // auction's basic info
    this.name = this.startDate = this. endDate = this.description = this.address = ""
    this.totalBids = this.highestBid = this.buyPrice = 0
    this.images= []
    this.activeImage = 0

    this.username = this.authService.getUsername()!
    this.auctionBids = []
    this.auctionID = this.route.snapshot.params['auctionID']


    // pagination
    this.pageSize = 6
    this.pageIndex = 0
    this.totalPages = 0

  }


  getAuction(auctionID: number) {


    this.requestService.getAuction(auctionID).subscribe(
      // if the auction was fetched successfully
      response => {

        this.name = response.name
        this.totalBids = response.totalBids
        this.highestBid = response.firstBid > response.highestBid ? response.firstBid : response.highestBid
        this.startDate = this.utilService.reformatDate(response.startDate)
        this.endDate = this.utilService.reformatDate(response.endDate)
        this.description = response.description
        this.images = response.images
        this.buyPrice = response.buyPrice

        if(this.totalBids==0) {
          this.currentBidTitle = "First Bid"
          this.currentBid = response.firstBid
        }else {
          this.currentBidTitle = "Highest Bid"
          this.currentBid = response.highestBid
        }



        this.address = response.address.streetName+" "+response.address.streetNumber+", "+
          response.address.zipCode+", "+response.address.location



        console.log(response)
      }
      ,
      // if auction fetching failed
      error => {
        console.log("AUCTION-FETCHING FAILED :", error)
        this.router.navigate([endpoints.browse])
      }
    )
  }

  getAuctionBids(auctionID : number, pageIndex: number, pageSize: number) : void{

    this.requestService.getAuctionBids(auctionID, pageIndex, pageSize).subscribe(
      // if auction's bids were fetched successfully
      response => {


        // fill the auction bid array
        this.auctionBids = response.objects
        // update total pages
        this.totalPages = response.totalPages
        //update page index
        pageIndex>this.totalPages ? this.pageIndex = this.totalPages : this.pageIndex = pageIndex

      },
      // if bids weren't fetched, redirect user back to home-navigation-panel page
      error => {
      console.log("AUCTION-BIDS FAILED :",error)
        this.router.navigate([endpoints.browse])
      }

    )

  }

  getPreviousPage(): void{
    if(this.pageIndex>1)
      this.getAuctionBids(this.auctionID,this.pageIndex-1,this.pageSize)
  }

  getNextPage(): void{
    if(this.pageIndex<this.totalPages)
      this.getAuctionBids(this.auctionID,this.pageIndex+1,this.pageSize)
  }

  getNextImage(): void{
    let totalImages = this.images.length
    if(totalImages)
      this.activeImage = (this.activeImage+1)%totalImages
  }

  getPreviousImage(): void{
    let totalImages = this.images.length
    if(totalImages)
      this.activeImage > 0 ? this.activeImage -- : this.activeImage = totalImages-1
  }

  ngOnInit(): void {
    this.getAuction(this.auctionID)
    this.getAuctionBids(this.auctionID,1,this.pageSize)
  }

}
