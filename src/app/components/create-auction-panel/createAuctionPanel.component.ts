import {Component, OnInit} from '@angular/core';
import {Category} from "../../interfaces/Category";
import {endpoints} from "../../constants/pageLinks";
import {MapService} from "../../services/map.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {RequestService} from "../../services/request.service";
import {formExpressions} from "../../constants/regularExpressions";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AlertDialogComponent} from "../alert-dialog/alert-dialog.component";
import {ApprovalDialogComponent} from "../approval-dialog/approvalDialog.component";
import {DateTimePickerComponent} from "../date-time-picker/dateTimePicker.component";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {auctionExceptions, bidExceptions} from "../../constants/serverErrors";
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {errorMessages, successMessages} from "../../constants/customMessages";

@Component({
    selector: 'app-create-auction-panel',
    templateUrl: './createAuctionPanel.component.html',
    styleUrls: ['./createAuctionPanel.component.css']
})
export class CreateAuctionPanelComponent implements OnInit {

    dropdownSettings: any
    auctionID: number
    updateAuction: boolean
    submitCommitted: boolean
    geolocationValid: boolean
    dateValid: boolean
    address: any
    auctionForm: FormGroup
    imageFiles: File[]
    categories: any
    selectedCategories: any

    constructor(private mapService: MapService, private requestService: RequestService, private router: Router,
                private route: ActivatedRoute, private authService: AuthService, private dialog: MatDialog) {

        this.dropdownSettings = {
            singleSelection: false,
            idField: 'categoryID',
            textField: 'categoryName',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 3,
            allowSearchFilter: true
        };

        this.auctionID = 1
        this.updateAuction = false
        this.submitCommitted = false
        this.geolocationValid = false
        this.dateValid = false
        // updated by MAP and GEO-LOCATION ADDRESS BAR
        this.address = null
        this.imageFiles = []
        this.categories = []
        this.selectedCategories = []

        this.auctionForm = new FormGroup(
            {

                name: new FormControl('', [Validators.required]),
                description: new FormControl('', [Validators.required]),
                firstBid: new FormControl('', [Validators.required, Validators.pattern(formExpressions.price)]),
                buyNow: new FormControl('', [Validators.pattern(formExpressions.price)]),
                zipCode: new FormControl('', [Validators.required, Validators.pattern(formExpressions.zipCode)]),
                endDate: new FormControl('', [Validators.required]),
                streetNumber: new FormControl('', [Validators.required, Validators.pattern(formExpressions.streetNumber)]),
                country: new FormControl('', [Validators.required, Validators.pattern(formExpressions.country)]),

            }
            //, {validators: this.buyNowValidator}
        )

    }

    addCategory(category: any) {
        this.selectedCategories.push(category)
    }

    addCategories(categories: any) {
        this.selectedCategories = categories
    }

    removeCategory(category: any) {

        for (let i = 0; i < this.selectedCategories.length; i++) {
            if (this.selectedCategories[i].categoryID == category.categoryID) {
                this.selectedCategories.splice(i, 1)
                break
            }
        }

    }

    clearCategories() {
        this.selectedCategories = []
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

                    if (username !== response.seller)
                        this.redirectUser()
                    else if (response.expired || response.totalBids > 0) {

                        let errorMessage
                        if (response.expired)
                            errorMessage = errorMessages.expiredAuction
                        else
                            errorMessage = errorMessages.bidAuction

                        let dialogConfig = new MatDialogConfig();
                        dialogConfig.autoFocus = true;
                        dialogConfig.data = {
                            message: errorMessage
                        }

                        let dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig).afterClosed().subscribe(() => {
                            this.router.navigate(['auctions', this.auctionID, 'bids'])
                        })

                        return
                    }


                    // store LAT, LONG and NAME of the address to forward them to Map and GeoLocation components respectively
                    this.address = {
                        lat: response.address.coordinates.latitude,
                        lon: response.address.coordinates.longitude,
                        address: {name: response.address.streetName}
                    }

                    // forward LAT, LONG to MAP
                    this.extractLatitude()
                    this.extractLongitude()
                    // forward NAME to GEOLOCATION
                    this.extractAddressName()

                    // set the date and datepicker's value
                    this.auctionForm.get('endDate')?.setValue(response.endDate)
                    this.dateValid = this.auctionForm.get('endDate')?.value >= new Date().toISOString();

                    // fill the form with the preexistent values
                    this.auctionForm.get('name')?.setValue(response.name)
                    this.auctionForm.get('description')?.setValue(response.description)
                    this.auctionForm.get('firstBid')?.setValue(response.firstBid)

                    this.auctionForm.get('buyNow')?.setValue(response.buyPrice)
                    this.auctionForm.get('streetNumber')?.setValue(response.address.streetNumber)
                    this.auctionForm.get('country')?.setValue(response.address.country)
                    this.auctionForm.get('zipCode')?.setValue(response.address.zipCode)

                    // set the item's categories
                    // this.selectedCategories = response.categories

                },
                // if the auction couldn't be fetched
                error => {
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

                this.categories = []
                for (let i = 0; i < response.length; i++) {
                    let item = {categoryID: i + 1, categoryName: response[i]}

                    this.categories.push(item)
                }


            },
            // if categories couldn't be fetched
            () => {
                this.redirectUser()

            }
        )

    }


    // return true if buy now > first bid
    buyNowValidation(): boolean {

        let firstBid: string = this.auctionForm.get('firstBid')?.value
        let buyNow: string = this.auctionForm.get('buyNow')?.value

        if (firstBid && buyNow) {
            let firstBidArithmeticValue = Number(firstBid)
            let buyNowArithmeticValue = Number(buyNow)

            if (!isNaN(firstBidArithmeticValue) && !isNaN(buyNowArithmeticValue) && firstBidArithmeticValue >= buyNowArithmeticValue) {
                this.auctionForm.get('buyNow')?.setErrors({invalidValue: true})
                return false
            }
        }

        return true
    }



    // MAP LISTENER
    getMapsAddress(address: any): void {


        // store the whole address the MAP sent you
        this.address = address


        if (this.address) {

            this.auctionForm.get('streetNumber')?.reset()
            this.auctionForm.get('zipCode')?.reset()
            this.auctionForm.get('country')?.reset()

            if (this.address.address.house_number)
                this.auctionForm.get('streetNumber')?.setValue(this.address.address.house_number)

            if (this.address.address.country)
                this.auctionForm.get('country')?.setValue(this.address.address.country)
            else if (this.address.address.state)
                this.auctionForm.get('country')?.setValue(this.address.address.state)

            if (this.address.address.postcode)
                this.auctionForm.get('zipCode')?.setValue(this.address.address.postcode)


        }

        // extract the name from the address object and send it to geolocation-bar in HTML

    }

    extractAddressName(): string {

        let addressName: string = ""

        if (this.address) {
            if (this.address.address.road) {
                addressName = this.address.address.road
            } else if (this.address.address.name) {
                addressName = this.address.address.name
            } else if (this.address.address.town) {
                addressName = this.address.address.town
            } else if (this.address.address.city) {
                addressName = this.address.address.city
            } else if (this.address.address.municipality) {
                addressName = this.address.address.municipality
            } else {
                addressName = this.address.display_name
            }
        }

        return addressName
    }

    // GEO LISTENER
    getGeolocationAddress(address: any): void {

        // store the whole address
        this.address = address
        this.geolocationValid = true

        if (this.address) {
            this.auctionForm.get('streetNumber')?.reset()
            this.auctionForm.get('country')?.reset()
            this.auctionForm.get('zipCode')?.reset()

            if (this.address.address.house_number)
                this.auctionForm.get('streetNumber')?.setValue(this.address.address.house_number)

            if (this.address.address.country)
                this.auctionForm.get('country')?.setValue(this.address.address.country)
            else if (this.address.address.state)
                this.auctionForm.get('country')?.setValue(this.address.address.state)

            if (this.address.address.postcode)
                this.auctionForm.get('zipCode')?.setValue(this.address.address.postcode)
        }


        // extract the coordinates from the address object and send them to MAP in HTML

    }

    extractLatitude(): number {

        let latitude = 51.5072

        if (this.address) {
            latitude = this.address.lat
        }

        return latitude
    }

    extractLongitude(): number {

        let longitude = 0.1276

        if (this.address)
            longitude = this.address.lon

        return longitude
    }

    // GEOLOCATION (ADDRESS BAR) LISTENER
    updateBarsState(state: any): void {
        this.geolocationValid = state
    }

    // DATETIME LISTENER
    getDateTime(dateTime: any): void {

        let newDate = new Date(dateTime[0], dateTime[1], dateTime[2], dateTime[3], dateTime[4], dateTime[5], dateTime[6])

        this.auctionForm.get('endDate')?.setValue(newDate.toISOString())

        // check if the selected date is valid
        this.dateValid = this.auctionForm.get('endDate')?.value >= new Date().toISOString();


    }

    fileUpload(event: any) {

        this.imageFiles = []
        // store all the user-selected images in an image array
        for (let imageFile of event.target.files) {
            if (imageFile.type === "image/png" || imageFile.type === "image/jpeg")
                this.imageFiles.push(imageFile)
        }

    }

    submitForm(): void {

        this.submitCommitted = true

        let buyNowValid = this.buyNowValidation()

        if (!(this.auctionForm.valid && this.geolocationValid && this.dateValid && this.selectedCategories.length))
            return

        if (!buyNowValid)
            return

        let validPriceCombination: boolean = false
        let firstBid = this.auctionForm.get('firstBid')!.value
        let buyNowValue: string | null = this.auctionForm.get('buyNow')?.value

        if (Number(firstBid) > 0 && (buyNowValue === null || buyNowValue?.length == 0))
            validPriceCombination = true
        else if (Number(firstBid) > 0 && Number(buyNowValue) > 0 && Number(buyNowValue) > Number(firstBid))
            validPriceCombination = true

        if (!validPriceCombination) {
            this.auctionForm.get('firstBid')?.setErrors({invalidValue: true})
            this.auctionForm.get('buyNow')?.setErrors({invalidValue: true})

            return
        }

        // if user wants to update an old auction or create a new one, create a confirmation dialog
        let dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;

        let submit: string = this.updateAuction ? "Update" : "Post"

        dialogConfig.data = {
            message: submit + " this auction?"
        }

        // open the dialog
        let dialogRef = this.dialog.open(ApprovalDialogComponent, dialogConfig);

        // get user's reply
        dialogRef.afterClosed().subscribe(
            toSubmit => {

                // if user wants to submit the auction
                if (toSubmit) {

                    let fullAuction: FormData = new FormData()

                    // function that extracts street name
                    let getStreetName = (address: any) => {
                        if (address.address.road)
                            return address.address.road

                        if (address.address.name)
                            return address.address.name

                        if (address.address.town)
                            return address.address.town

                        if (address.address.city)
                            return address.address.city

                        if (address.address.municipality)
                            return address.address.municipality

                        return address.address.diplay_name
                    }

                    // function that extracts location
                    let getLocation = (address: any, defaultValue: any) => {

                        if (address.address.neighbourhood)
                            return address.address.neighbourhood

                        if (address.address.city)
                            return address.address.city

                        if (address.address.town)
                            return address.address.town

                        if (address.address.region)
                            return address.address.region

                        if (address.address.county)
                            return address.address.county

                        return defaultValue
                    }

                    let categoryNames = []
                    for (let category of this.selectedCategories)
                        categoryNames.push(category.categoryName)

                    // create the body of the auction
                    let auction = {
                        name: this.auctionForm.get('name')?.value,
                        description: this.auctionForm.get('description')?.value,
                        endDate: this.auctionForm.get('endDate')?.value,
                        buyPrice: this.auctionForm.get('buyNow')?.value,
                        firstBid: this.auctionForm.get('firstBid')?.value,
                        categories: categoryNames,

                        address: {
                            coordinates: {
                                latitude: this.address.lat,
                                longitude: this.address.lon
                            },

                            country: this.auctionForm.get('country')?.value,
                            location: getLocation(this.address, this.auctionForm.get('country')?.value),
                            streetName: getStreetName(this.address),
                            streetNumber: this.auctionForm.get('streetNumber')?.value,
                            zipCode: this.auctionForm.get('zipCode')?.value
                        }
                    }

                    // insert the auction body as a string
                    fullAuction.append('auction', new Blob([JSON.stringify(auction)], {type: "application/json"}))

                    if (this.imageFiles.length > 0) {
                        for (let imageFile of this.imageFiles)
                            fullAuction.append('images', imageFile)
                    }

                    if (this.updateAuction) {
                        this.requestService.updateAuction(fullAuction, this.auctionID).subscribe(
                            // if the auction was updated successfully
                            (response) => {

                                let dialogConfig = new MatDialogConfig();
                                dialogConfig.autoFocus = true;
                                dialogConfig.data = {
                                    message: successMessages.auctionUpdated
                                }

                                let dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig).afterClosed().subscribe(
                                    () => {
                                        this.redirectUser()
                                        return
                                    }
                                )

                            },

                            // if the auction wasn't updated
                            error => {

                                let jumpToAuction = true
                                let errorMessage

                                if (error.error.code == auctionExceptions.AUCTION_HAS_BID_OR_EXPIRED)
                                    errorMessage = errorMessages.bidAuction
                                else {
                                    jumpToAuction = false
                                    message: errorMessages.updateFailed
                                }

                                let dialogConfig = new MatDialogConfig();
                                dialogConfig.autoFocus = true;
                                dialogConfig.data = {
                                    message: errorMessage
                                }

                                let dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig).afterClosed().subscribe(
                                    () => {

                                        if (jumpToAuction)
                                            this.router.navigate(['auctions', this.auctionID, 'bids'])
                                        else
                                            this.router.navigate([endpoints.browse])

                                    }
                                )
                            }
                        )
                    } else {
                        this.requestService.createAuction(fullAuction).subscribe(
                            // if the auction was created successfully
                            (response) => {

                                let dialogConfig = new MatDialogConfig();
                                dialogConfig.autoFocus = true;
                                dialogConfig.data = {
                                    message: successMessages.auctionCreated
                                }

                                let dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig).afterClosed().subscribe(
                                    () => {
                                        this.redirectUser()
                                        return
                                    }
                                )

                                this.redirectUser()
                            },
                            // if the auction wasn't created
                            error => {

                                let dialogConfig = new MatDialogConfig();
                                dialogConfig.autoFocus = true;
                                dialogConfig.data = {
                                    message: errorMessages.creationFailed
                                }

                                let dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig)

                            }
                        )
                    }
                }
            }
        )
    }

    redirectUser(): void {
        let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || endpoints.myAuctions;
        this.router.navigate([returnUrl])
        return
    }
}


