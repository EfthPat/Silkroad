import {Component, OnInit} from '@angular/core';
import {AuctionThumbnail} from "../../interfaces/AuctionThumbnail";
import {RequestService} from "../../services/request.service";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {UtilService} from "../../services/util.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {MessageDialogComponent} from "../message-dialog/message-dialog.component";
import {DeleteDialogComponent} from "../delete-dialog/delete-dialog.component";
import {AlertDialogComponent} from "../alert-dialog/alert-dialog.component";

@Component({
  selector: 'app-my-auctions',
  templateUrl: './my-auctions.component.html',
  styleUrls: ['./my-auctions.component.css']
})
export class MyAuctionsComponent implements OnInit {

  auctionThumbnails: AuctionThumbnail[]
  imageLinks: any[]
  username : string

  // UI variables
  auctionState: string

  // pagination
  pageSize: number
  pageIndex: number
  totalPages: number

  constructor(public utilService : UtilService, private router: Router, private dialog: MatDialog,
              private requestService: RequestService, private authService : AuthService) {

    this.username = this.authService.getUsername()!

    this.auctionThumbnails = []
    this.imageLinks = []

    // UI variables
    this.auctionState = "any"

    // pagination
    this.pageSize = 6
    this.pageIndex = 0
    this.totalPages = 0

  }

  getAuctionThumbnails(username: string, pageIndex: number, pageSize: number, auctionState: string): void {
    this.requestService.getAuctionThumbnails(username, pageIndex, pageSize, auctionState).subscribe(
      response => {

        // reset the 2 arrays
        this.auctionThumbnails = []
        this.imageLinks = []


        // fill auction thumbnail array
        for (let thumbnail of response.objects)
        {
          console.log(thumbnail)


          this.auctionThumbnails.push(thumbnail)
          this.imageLinks.push([0])
        }

        // fill the auction thumbnail array
        this.auctionThumbnails = response.objects
        // update total pages
        this.totalPages = response.totalPages
        //update page index
        pageIndex>this.totalPages ? this.pageIndex = this.totalPages : this.pageIndex = pageIndex

      },
      // if an error occurred
      error => {}
    )
  }

  getPreviousPage(): void {
    if(this.pageIndex>1)
      this.getAuctionThumbnails(this.username,this.pageIndex-1,this.pageSize,this.auctionState)
  }

  getNextPage(): void {
    if(this.pageIndex<this.totalPages)
      this.getAuctionThumbnails(this.username,this.pageIndex+1,this.pageSize,this.auctionState)

  }

  auctionInfo(index: number): void {
    let selection = window.getSelection()
    if(selection?.toString().length)
      return
    let auctionID = this.auctionThumbnails[index].id
    this.router.navigate(['auctions',auctionID,'bids'])
  }

  contactBuyer(index: number): void {
    let recipient = this.auctionThumbnails[index].bidder
    let title = this.auctionThumbnails[index].name
    this.router.navigate(['/panel/messages/send'], { queryParams: { recipient: recipient, title: title } })
  }

  updateAuction(index: number): void{
    let auctionID = this.auctionThumbnails[index].id
    this.router.navigate(['auctions',auctionID,'update'])
  }

  deleteAuction(index: number): void{

    // if user wants to delete the auction, create a confirmation dialog
    let dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      message: "Do you want to delete this auction?"
    }

    // open the dialog
    let dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);

    // get dialog's reply after it's closed
    dialogRef.afterClosed().subscribe(
      toDelete =>{

        // if user approved the deletion
        if(toDelete)
        {
          this.requestService.deleteAuction(this.auctionThumbnails[index].id).subscribe(
            // if server deleted auction successfully
            response => {

              let dialogConfig = new MatDialogConfig();
              dialogConfig.autoFocus = true;
              dialogConfig.data = {
                message: "Auction deleted successfully!"
              }

              let dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig).afterClosed().subscribe(
                ()=>{
                  this.getAuctionThumbnails(this.username,1,this.pageSize,this.auctionState)
                }
              )


            },
            // if server didn't manage to delete auction
            error => {
              console.log("AUCTION DELETION FAILED :",error)

              let dialogConfig = new MatDialogConfig();
              dialogConfig.autoFocus = true;
              dialogConfig.data = {
                message: "Auction deletion failed .."
              }

              let dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig).afterClosed().subscribe(
                ()=>{
                  this.getAuctionThumbnails(this.username,1,this.pageSize,this.auctionState)
                }
              )
            }
          )
        }
      }
    )

  }

  submitFilter(auctionState : string) : void {
    this.auctionState = auctionState
    this.getAuctionThumbnails(this.username,1,this.pageSize,this.auctionState)
  }

  ngOnInit(): void {
    this.getAuctionThumbnails(this.username,1,this.pageSize,this.auctionState)
  }

  getNextImage(index: number) : void {
    this.imageLinks[index] = (this.imageLinks[index] + 1)%this.auctionThumbnails[index].images.length
  }

  getPreviousImage(index: number) : void {
    this.imageLinks[index] > 0 ? this.imageLinks[index]-- : this.imageLinks[index] = this.auctionThumbnails[index].images.length-1
  }

}
