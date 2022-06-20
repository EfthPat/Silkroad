import {Component, OnInit} from '@angular/core';
import {Category} from "../../interfaces/Category";
import {MapService} from "../../services/map.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {RequestService} from "../../services/request.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DeleteDialogComponent} from "../delete-dialog/delete-dialog.component";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";

@Component({
  selector: 'app-create-auction',
  templateUrl: './create-auction.component.html',
  styleUrls: ['./create-auction.component.css']
})
export class CreateAuctionComponent implements OnInit {

  auctionID: number
  updateAuction: boolean
  submitCommitted: boolean
  geolocationValid: boolean
  dateValid: boolean
  // updated by Map and Geolocation components
  address: any
  auctionForm: FormGroup
  imageFiles: File[]
  categories: Category[]
  selectedCategories: string[]
  // UI variables
  dateHint: string

  constructor(private mapService: MapService, private requestService: RequestService, private router: Router,
              private route: ActivatedRoute, private authService: AuthService, private dialog: MatDialog) {

    this.auctionID = 1
    this.updateAuction = false
    this.submitCommitted = false
    this.geolocationValid = false
    this.dateValid = false
    // updated by MAP and GEO-LOCATION ADDRESS BAR
    this.address = null
    this.dateHint = "DD/MM/YY"
    this.imageFiles = []
    this.categories = []
    this.selectedCategories = []

    this.auctionForm = new FormGroup(
      {
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        firstBid: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*(.?[0-9]{1,2})$")]),
        buyNow: new FormControl('', [Validators.pattern("^[0-9]*(.?[0-9]{1,2})?$")]),
        zipCode: new FormControl('', [Validators.required, Validators.pattern("^\\d{5}(?:[-\\s]\\d{4})?$")]),
        endDate: new FormControl('', [Validators.required]),
        streetNumber: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),

        // exclude special characters
        country: new FormControl('', [Validators.required, Validators.pattern('^[^0-9!@#$%^*()_+=?><`~]+$')]),
      },
      {validators: this.buyNowValidator}
    )

  }

  ngOnInit(): void {
    this.fillForm()
    this.getCategories()
  }

  fillForm(): void {

    let auctionID = this.route.snapshot.params['auctionID']

    if (auctionID) {
      this.updateAuction = true
      this.auctionID = auctionID
      this.requestService.getAuction(auctionID).subscribe(
        // if the auction with the given ID was fetched successfully
        response => {
          let username = this.authService.getUsername()

          // an auction can be updated IFF:
          // visitor is not a guest (checked by Auth-Guard) (1), and
          // visitor's username matches seller's username (2), and
          // auction is not expired (3), and
          // there's no bids set on the auction (4)

          if (username !== response.seller || response.expired || response.totalBids > 0)
            this.redirectUser()

          // store LAT, LONG and NAME of the address to forward them to Map and GeoLocation components respectively
          this.address = {
            latitude: response.address.coordinates.latitude,
            longitude: response.address.coordinates.longitude,
            label: response.address.streetName
          }

          // forward LAT, LONG to MAP
          this.extractLatitude()
          this.extractLongitude()
          // forward NAME to GEOLOCATION
          this.extractAddressName()

          // set datepicker's value
          let date = (new Date(response.endDate))
          let day = date.getDate().toString()
          let month: number | string = date.getMonth() + 1
          month = month.toString()
          let year = date.getFullYear().toString()

          this.dateHint = day + "/" + month + "/" + year

          // fill the form with the preexistent values
          this.auctionForm.get('name')?.setValue(response.name)
          this.auctionForm.get('description')?.setValue(response.description)
          this.auctionForm.get('firstBid')?.setValue(response.firstBid)
          this.auctionForm.get('buyNow')?.setValue(response.buyPrice)
          this.auctionForm.get('streetNumber')?.setValue(response.address.streetNumber)
          this.auctionForm.get('country')?.setValue(response.address.country)
          this.auctionForm.get('zipCode')?.setValue(response.address.zipCode)

          // set the item's categories
          this.selectedCategories = response.categories

        },
        // if the auction couldn't be fetched
        error => {
          console.log("AUCTION COULDN'T BE UPDATED :", error)
          this.redirectUser()
        }
      )

    }

  }

  getCategories(): void {

    this.categories = []
    this.requestService.getCategories().subscribe(
      // if server responded successfully
      response => {
        for (let category of response)
          this.categories.push(category)
      },
      // if an error occurred
      error => {
        console.log("CATEGORIES COULDN'T BE FETCHED!", error)
        this.redirectUser()

      }
    )

  }

  buyNowValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if (control.get('firstBid')?.value && control.get('buyNow')?.value) {
      let firstBid = Number(control.get('firstBid')?.value)
      let buyNow = Number(control.get('buyNow')?.value)

      if (!isNaN(firstBid) && !isNaN(buyNow) && !(firstBid < buyNow)) {
        control.get('buyNow')?.setErrors({invalidValue: true})
        return {invalidValue: true}
      }
    }

    return null
  }

  // MAP LISTENER
  getMapsAddress(address: any): void {

    // store the whole address the MAP sent you
    this.address = address

    if (this.address) {
      this.auctionForm.get('streetNumber')?.reset()
      this.auctionForm.get('country')?.reset()
      this.auctionForm.get('zipCode')?.reset()
      if (this.address.number)
        this.auctionForm.get('streetNumber')?.setValue(this.address.number)
      if (this.address.country)
        this.auctionForm.get('country')?.setValue(this.address.country)
      if (this.address.postal_code)
        this.auctionForm.get('zipCode')?.setValue(this.address.postal_code)
    }

    // extract the name from the address object and send it to geolocation-bar in HTML

  }

  extractAddressName(): string {

    let addressName: string = ""

    if (this.address) {
      addressName = this.address.label
    }

    return addressName
  }

  // GEO LISTENER
  getGeolocationAddress(address: any): void {

    // store the whole address label
    this.address = address
    this.geolocationValid = true

    if (this.address) {
      this.auctionForm.get('streetNumber')?.reset()
      this.auctionForm.get('country')?.reset()
      this.auctionForm.get('zipCode')?.reset()
      if (this.address.number)
        this.auctionForm.get('streetNumber')?.setValue(this.address.number)
      if (this.address.country)
        this.auctionForm.get('country')?.setValue(this.address.country)
      if (this.address.postal_code)
        this.auctionForm.get('zipCode')?.setValue(this.address.postal_code)
    }


    // extract the coordinates from the address object and send them to MAP in HTML

  }

  extractLatitude(): number {

    let latitude = 37.9838

    if (this.address) {
      latitude = this.address.latitude
    }

    return latitude
  }

  extractLongitude(): number {

    let longitude = 23.7275

    if (this.address)
      longitude = this.address.longitude

    return longitude
  }

  // GEOLOCATION (ADDRESS BAR) LISTENER
  updateBarsState(state: any): void {
    this.geolocationValid = state
  }

  // DATE LISTENER
  getDate(date: any): void {
    this.auctionForm.get('endDate')?.setValue(date)

    // check if the selected date is valid
    this.dateValid = this.auctionForm.get('endDate')?.value >= new Date().toISOString();

  }

  fileUpload(event: any) {

    // store all the user-selected images in an image array
    for (let imageFile of event.target.files)
      this.imageFiles.push(imageFile)

  }

  submitForm(): void {

    this.submitCommitted = true

    if (!(this.auctionForm.valid && this.geolocationValid && this.dateValid && this.imageFiles.length && this.selectedCategories.length))
      return

    // if user wants to update an old auction or create a new one, create a confirmation dialog
    let dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      message: "Do you want to submit this auction?"
    }

    // open the dialog
    let dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);

    // get user's reply
    dialogRef.afterClosed().subscribe(
      toSubmit => {

        // if user wants to submit the auction
        if (toSubmit) {

          let fullAuction: FormData = new FormData()


          // function that extracts street name
          let getStreetName = (address: any) => {
            if (address.street)
              return address.street
            if (address.name)
              return address.name
            return address.label
          }

          // function that extracts location
          let getLocation = (address: any, defaultValue: any) => {
            if (address.locality)
              return address.locality
            if (address.neighbourhood)
              return address.neighbourhood
            if (address.region)
              return address.region
            if (address.county)
              return address.county
            if (address.continent)
              return address.continent
            return defaultValue
          }

          console.log("ADDRESS :")
          console.table(this.address)

          // create the body of the auction
          let auction = {
            name: this.auctionForm.get('name')?.value,
            description: this.auctionForm.get('description')?.value,
            endDate: this.auctionForm.get('endDate')?.value,
            buyPrice: this.auctionForm.get('buyNow')?.value,
            firstBid: this.auctionForm.get('firstBid')?.value,
            categories: this.selectedCategories,

            address: {
              coordinates: {
                latitude: this.address.latitude,
                longitude: this.address.longitude
              },

              country: this.auctionForm.get('country')?.value,
              // if NULL -> DEFAULT VALUE
              location: getLocation(this.address, this.auctionForm.get('country')?.value),
              streetName: getStreetName(this.address),
              streetNumber: this.auctionForm.get('streetNumber')?.value,
              zipCode: this.auctionForm.get('zipCode')?.value
            }
          }

          console.log("AUCTION :")
          console.table(auction)

          // insert the auction body as a string
          fullAuction.append('auction', new Blob([JSON.stringify(auction)], {type: "application/json"}))

          // insert the images
          for (let imageFile of this.imageFiles)
            fullAuction.append('images', imageFile)

          if (this.updateAuction) {
            this.requestService.updateAuction(fullAuction, this.auctionID).subscribe(
              // if the auction was created
              () => {
                this.redirectUser()
              },
              // if the auction wasn't created
              error => {
                console.log("AUCTION-UPDATE FAILED :", error)
              }
            )
          } else {
            this.requestService.createAuction(fullAuction).subscribe(
              // if the auction was created
              () => {
                this.redirectUser()
              },
              // if the auction wasn't created
              error => {
                console.log("AUCTION-CREATION FAILED :", error)
              }
            )
          }


        }

      }
    )

  }

  redirectUser(): void {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || 'browse';
    this.router.navigate([returnUrl])
    return
  }
}
