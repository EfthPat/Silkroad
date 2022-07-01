import {Component, OnInit} from '@angular/core';
import {RequestService} from "../../services/request.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Bid} from "../../interfaces/Bid";
import {UtilService} from "../../services/util.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ApprovalDialogComponent} from "../approval-dialog/approvalDialog.component";
import {AlertDialogComponent} from "../alert-dialog/alert-dialog.component";
import {serverLinks, serverParameters} from "../../constants/server";
import {endpoints} from "../../constants/pageLinks";
import {auctionExceptions, bidExceptions} from "../../constants/serverErrors";
import {errorMessages, successMessages} from "../../constants/customMessages";
import {formExpressions} from "../../constants/regularExpressions";

@Component({
  selector: 'app-view-auction',
  templateUrl: './view-auction.component.html',
  styleUrls: ['./view-auction.component.css']
})
export class ViewAuctionComponent implements OnInit {

  serverLink: string
  serverParameter: string

  // update, bid, view
  isBiddable: boolean
  auctionID: number

  // needed for bidding
  bidCommitted: boolean
  auctionVersion: number
  auctionForm: FormGroup

  // needed for map's initialization
  latitude: number
  longitude: number

  dynamicBidLabel: string
  dynamicBidValue: number

  images: any[]
  activeImage: number

  constructor(private requestService: RequestService, private router: Router, private route: ActivatedRoute,
              public utilService: UtilService, private authService: AuthService, private dialog: MatDialog) {

    this.dynamicBidLabel = ""
    this.dynamicBidValue = 0
    this.serverLink = serverLinks[0]
    this.serverParameter = serverParameters.mediaParameter
    this.isBiddable = false
    this.latitude = 37.9838
    this.longitude = 23.7275
    this.auctionID = this.route.snapshot.params['auctionID']
    this.auctionVersion = 0
    this.bidCommitted = false

    this.auctionForm = new FormGroup({

      name: new FormControl(''),
      description: new FormControl(''),
      highestBid: new FormControl(''),
      firstBid: new FormControl(''),
      buyPrice: new FormControl(''),
      endDate: new FormControl(''),
      address: new FormControl(''),
      seller: new FormControl(''),
      sellerRating: new FormControl(''),

      // needed for bidding
      bid: new FormControl('', [Validators.required, Validators.pattern(formExpressions.price)])

    }, {validators: this.bidValidator})

    this.auctionForm.disable()

    this.auctionForm.get('bid')?.enable()

    this.images = []
    this.activeImage = 0
  }

  getAuction(auctionID: number) {
    this.requestService.getAuction(auctionID).subscribe(
      // if the auction was fetched successfully
      response => {

        // get auction's latitude / longitude
        this.latitude = response.address.coordinates.latitude
        this.longitude = response.address.coordinates.longitude

        // fill the form
        this.auctionForm.get('name')?.setValue(response.name)
        this.auctionForm.get('description')?.setValue(response.description)
        // set as 'highest bid' the maximum of highestBid and firstBid
        this.auctionForm.get('highestBid')?.setValue(response.highestBid)
        this.auctionForm.get('firstBid')?.setValue(response.firstBid)
        response.buyPrice ? this.auctionForm.get('buyPrice')?.setValue(response.buyPrice) :
          this.auctionForm.get('buyPrice')?.setValue('N/A')
        this.auctionForm.get('endDate')?.setValue(this.utilService.reformatDate(response.endDate))
        this.auctionForm.get('seller')?.setValue(response.seller)
        this.auctionForm.get('sellerRating')?.setValue(response.sellerRating)

        let fullAddress = response.address.streetName + " " + response.address.streetNumber
          + ", " + response.address.zipCode + ", " + response.address.location

        this.auctionForm.get('address')?.setValue(fullAddress)

        this.auctionVersion = response.version

        this.images = response.images


        if (this.auctionForm.get('highestBid')?.value >= this.auctionForm.get('firstBid')?.value) {
          this.dynamicBidValue = this.auctionForm.get('highestBid')?.value
          this.dynamicBidLabel = "Highest Bid"
        } else {
          this.dynamicBidValue = this.auctionForm.get('firstBid')?.value
          this.dynamicBidLabel = "First Bid"
        }

        // A visitor can bid on an auction IFF:
        // he is not a guest, and
        // he's not auction's owner, and
        // the auction is not expired
        let username = this.authService.getUsername()

        username == null || username === response.seller || response.expired
          ? this.isBiddable = false : this.isBiddable = true

      }
      ,
      // if auction fetching failed
      error => {

        let errorMessage

        if (error.error.code === auctionExceptions.AUCTION_NOT_FOUND)
          errorMessage = errorMessages.auctionNotFound
        else
          errorMessage = errorMessages.auctionNotLoaded

        let dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;

        dialogConfig.data = {
          message: errorMessage
        }

        // open the dialog
        this.dialog.open(AlertDialogComponent, dialogConfig).afterClosed().subscribe(
          () => {
            this.router.navigate([endpoints.browse])
          }
        )
      }
    )
  }

  bidValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    let highestBid = control.get('highestBid')?.value
    let bid = control.get('bid')?.value

    if ((+bid) <= (+highestBid)) {
      let error = {invalidValue: true}
      control.get('bid')?.setErrors(error)
      return error
    }

    return null
  }

  bid(): void {

    this.bidCommitted = true

    if (this.auctionForm.get('bid')?.invalid)
      return

    let submittedBid = this.auctionForm.get('bid')?.value
    let firstBid = this.auctionForm.get('firstBid')?.value
    let highestBid = this.auctionForm.get('highestBid')?.value

    let bidValid: boolean = false

    if (highestBid == 0 && submittedBid >= firstBid)
      bidValid = true

    else if (highestBid != 0 && submittedBid > highestBid)
      bidValid = true


    if (!bidValid) {
      this.auctionForm.get('bid')?.setErrors({invalidBidValue: true})
      return
    }

    // if user wants to bid on the auction, create a confirmation dialog
    let dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      message: "Bid on Auction?"
    }

    // open the dialog
    let dialogRef = this.dialog.open(ApprovalDialogComponent, dialogConfig);

    // get dialog's reply after it's closed
    dialogRef.afterClosed().subscribe(
      toBid => {

        // if user wants to bid on the auction
        if (toBid) {

          let bidValue = this.auctionForm.get('bid')?.value
          let buyPrice = this.auctionForm.get('buyPrice')?.value

          let maxBid = false
          if (buyPrice !== 'N/A' && (+bidValue) >= (+buyPrice)) {
            maxBid = true
            bidValue = buyPrice
          }

          let bid: Bid = {version: this.auctionVersion.toString(), amount: bidValue}

          this.requestService.bidOnAuction(this.auctionID, bid).subscribe(
            // if bid was successful
            () => {

              if (maxBid) {
                let bid = this.utilService.reformatNumber(+bidValue)

                let dialogConfig = new MatDialogConfig();
                dialogConfig.autoFocus = true;
                dialogConfig.data = {
                  message: "Auction won for " + bid.toString() + "$ ! Contact Seller!"
                }

                this.dialog.open(AlertDialogComponent, dialogConfig).afterClosed().subscribe(
                  () => {
                    this.router.navigate([endpoints.send],
                      {
                        queryParams: {
                          recipient: this.auctionForm.get('seller')?.value,
                          title: this.auctionForm.get('name')?.value
                        }
                      })
                    return
                  }
                )
                return
              }

              let dialogConfig = new MatDialogConfig();
              dialogConfig.autoFocus = true;
              dialogConfig.data = {
                message: successMessages.bidSucceeded
              }

              this.dialog.open(AlertDialogComponent, dialogConfig)

              this.auctionForm.reset()
              this.bidCommitted = false
              // get the updated auction
              this.getAuction(this.auctionID)

            },
            // if bid failed
            error => {

              let reload = true
              let errorMessage

              if (error.error.code == auctionExceptions.AUCTION_MODIFIED_OR_EXPIRED)
                errorMessage = errorMessages.auctionModified
              else if (error.error.code == bidExceptions.BID_HIGHER_BID_EXISTS)
                errorMessage = errorMessages.userOutbid
              else if (error.error.code == auctionExceptions.AUCTION_NOT_FOUND) {
                reload = false
                errorMessage = errorMessages.auctionNotFound
              }

              let dialogConfig = new MatDialogConfig();
              dialogConfig.autoFocus = true;
              dialogConfig.data = {
                message: errorMessage
              }

              this.dialog.open(AlertDialogComponent, dialogConfig).afterClosed().subscribe(
                () => {

                  if (reload)
                    window.location.reload()
                  else
                    this.router.navigate([endpoints.home])

                  return
                }
              )
            }
          )
        }
      }
    )
  }

  getNextImage(): void {
    let totalImages = this.images.length
    if (totalImages)
      this.activeImage = (this.activeImage + 1) % totalImages

  }

  getPreviousImage(): void {
    let totalImages = this.images.length
    if (totalImages)
      this.activeImage > 0 ? this.activeImage-- : this.activeImage = totalImages - 1
  }

  ngOnInit(): void {
    this.getAuction(this.auctionID)
  }

}
