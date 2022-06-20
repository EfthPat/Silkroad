import { Component, OnInit } from '@angular/core';
import {RequestService} from "../../services/request.service";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuctionBid} from "../../interfaces/AuctionBid";
import {UtilService} from "../../services/util.service";

@Component({
  selector: 'app-auction-bids',
  templateUrl: './auction-bids.component.html',
  styleUrls: ['./auction-bids.component.css']
})
export class AuctionBidsComponent implements OnInit {

  name: string
  totalBids: number
  highestBid: number
  startDate: string
  endDate: string
  description: string
  images: any[]
  activeImage: number

  auctionBids: AuctionBid[]
  username : string
  auctionID : number



  pageSize: number
  pageIndex: number
  totalPages: number

  constructor(private router: Router, private route: ActivatedRoute, private requestService : RequestService,
              private authService : AuthService, public utilService: UtilService) {


    // auction's basic info
    this.name = this.startDate = this. endDate = this.description = ""
    this.totalBids = this.highestBid = 0
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

        console.log("AUCTION :",response)

        this.name = response.name
        this.totalBids = response.totalBids
        this.highestBid = response.firstBid > response.highestBid ? response.firstBid : response.highestBid
        this.startDate = this.utilService.reformatDate(response.startDate)
        this.endDate = this.utilService.reformatDate(response.endDate)
        this.description = response.description
        this.images = response.images

      }
      ,
      // if auction fetching failed
      error => {
        console.log("AUCTION-FETCHING FAILED :", error)
        this.router.navigate(['/browse'])
      }
    )
  }

  getAuctionBids(auctionID : number, pageIndex: number, pageSize: number) : void{

    this.requestService.getAuctionBids(auctionID, pageIndex, pageSize).subscribe(
      // if auction's bids were fetched successfully
      response => {

        console.log("AUCTION-BIDS :",response)

        // fill the auction bid array
        this.auctionBids = response.objects
        // update total pages
        this.totalPages = response.totalPages
        //update page index
        pageIndex>this.totalPages ? this.pageIndex = this.totalPages : this.pageIndex = pageIndex

      },
      // if bids weren't fetched, redirect user back to home page
      error => {
      console.log("AUCTION-BIDS FAILED :",error)
        this.router.navigate(['/browse'])
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
