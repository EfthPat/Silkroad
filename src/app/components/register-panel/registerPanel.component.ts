import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {RequestService} from "../../services/request.service";
import {DataService} from "../../services/data.service";
import {endpoints} from "../../constants/pageLinks";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {AlertDialogComponent} from "../alert-dialog/alert-dialog.component";
import {formExpressions} from "../../constants/regularExpressions";

@Component({
  selector: 'app-register-panel',
  templateUrl: './registerPanel.component.html',
  styleUrls: ['./registerPanel.component.css']
})
export class RegisterPanelComponent implements OnInit {

  address: any
  registerForm: FormGroup
  showError: boolean

  constructor(private router: Router, private requestService: RequestService, private dialog: MatDialog) {

    this.registerForm = new FormGroup({

      // username - unique
      username: new FormControl('', [Validators.required, Validators.pattern(formExpressions.username)]),
      // passwords
      password: new FormControl('', [Validators.required, Validators.pattern(formExpressions.password)]),
      confirmPassword: new FormControl('', [Validators.required]),
      // firstname , lastname
      firstname: new FormControl('', [Validators.required, Validators.pattern(formExpressions.name)]),
      lastname: new FormControl('', [Validators.required, Validators.pattern(formExpressions.name)]),
      // contact info
      email: new FormControl('', [Validators.required, Validators.pattern(formExpressions.email)]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern(formExpressions.phoneNumber)]),
      // residence
      addressStreet: new FormControl('', [Validators.required]),
      streetNumber: new FormControl('', [Validators.required, Validators.pattern(formExpressions.streetNumber)]),
      country: new FormControl('', [Validators.required, Validators.pattern(formExpressions.country)]),
      zipCode: new FormControl('', [Validators.required]),

      // other info
      tin: new FormControl('', [Validators.required, Validators.pattern(formExpressions.tin)]),


    }, {validators: this.passwordValidator})

    this.showError = false

  }

  passwordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {


    let password: string = control.get('password')?.value
    let confirmPassword: string = control.get('confirmPassword')?.value

    if (password === confirmPassword) {
      control.get('confirmPassword')?.setErrors(null)
      return null
    }

    control.get('confirmPassword')?.setErrors({passwordsMatch: false})
    return {passwordsMatch: false}
  }

  invalidField(formControl: string): boolean {
    return this.registerForm.get(formControl)!.invalid
  }

  submitForm(): void {


    if (this.registerForm.invalid) {
      this.showError = true
    } else {

      this.showError = false

      // pack user's data
      let userInfo = this.extractUserInfo()

      console.log("INFO : ",userInfo)

      // send a signup request to the server with user's data
      this.requestService.registerUser(userInfo).subscribe(
        // if the server responded successfully
        response => {

          // then, the signup request was accepted and the user is redirected to home page

          let dialogConfig = new MatDialogConfig();
          dialogConfig.autoFocus = true;
          dialogConfig.data = {
            message: "Sign-up completed! Approval Pending"
          }

          let dialogRef = this.dialog.open(AlertDialogComponent, dialogConfig)

          dialogRef.afterClosed().subscribe(()=>{
            this.router.navigate([endpoints.browse])
          })

        },

        // if the signup request failed
        error => {

          console.log("SIGNUP FAILED :",error.error.code)
          this.showError = true

          // then, either the username is taken
          if(error.error.code=="UE_003")
          {
            console.log("USERNAME ALREADY EXISTS")
            this.registerForm.get('username')?.reset()
          }
          else if(error.error.code=="UE_004")
          {
            console.log("EMAIL ALREADY EXISTS")
            this.registerForm.get('email')?.reset()

          }

        }
      )

    }

  }

  extractUserInfo(): any {

    // function that extracts location
    let getLocation = (address: any, defaultValue : any) => {

      if (address.address.neighbourhood)
        return address.address.neighbourhood

      if (address.address.city)
        return address.address.city

      if (address.address.town)
        return address.address.town

      if(address.address.region)
        return address.address.region

      if(address.address.county)
        return address.address.county

      return defaultValue
    }

    let getAddressName = (address: any) =>{
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

    let  userInfo =  {
      username: this.registerForm.get('username')?.value,
      password: this.registerForm.get('password')?.value,
      email: this.registerForm.get('email')?.value,
      firstName: this.registerForm.get('firstname')?.value,
      lastName: this.registerForm.get('lastname')?.value,
      phone: this.registerForm.get('phoneNumber')?.value,
      tin: this.registerForm.get('tin')?.value,
      address: {
        coordinates  : {
          latitude: this.address.lat,
          longitude: this.address.lon
        },
        country: this.registerForm.get('country')?.value,
        // if NULL -> DEFAULT VALUE
        location: getLocation(this.address, this.registerForm.get('country')?.value),
        streetName: getAddressName(this.address),
        streetNumber: this.registerForm.get('streetNumber')?.value,
        zipCode: this.registerForm.get('zipCode')?.value
      }
    }

    return userInfo
  }

  getGeolocationAddress(address: any): void {


    // store the whole address the geolocation sent you
    this.address = address

    this.registerForm.get('addressStreet')?.setErrors(null)

    if (this.address) {

      this.registerForm.get('streetNumber')?.reset()
      this.registerForm.get('country')?.reset()
      this.registerForm.get('zipCode')?.reset()

      if (this.address.address.house_number)
        this.registerForm.get('streetNumber')?.setValue(this.address.address.house_number)

      if (this.address.address.country)
        this.registerForm.get('country')?.setValue(this.address.address.country)
      else if (this.address.address.state)
        this.registerForm.get('country')?.setValue(this.address.address.state)

      if (this.address.address.postcode)
        this.registerForm.get('zipCode')?.setValue(this.address.address.postcode)

    }

    // extract the coordinates from the address object and send them to MAP in HTML

  }

  updateBarsState(validState: any): void {

    validState ? this.registerForm.get('addressStreet')?.setErrors(null) :
      this.registerForm.get('addressStreet')?.setErrors({invalidAddress: true})

  }

  getMapsAddress(address: any): void {

    // store the whole address the MAP sent you
    this.address = address
    this.registerForm.get('addressStreet')?.setErrors(null)

    if (this.address) {

      this.registerForm.get('streetNumber')?.reset()
      this.registerForm.get('country')?.reset()
      this.registerForm.get('zipCode')?.reset()


      if (this.address.address.house_number)
        this.registerForm.get('streetNumber')?.setValue(this.address.address.house_number)

      if (this.address.address.country)
        this.registerForm.get('country')?.setValue(this.address.address.country)
      else if (this.address.address.state)
        this.registerForm.get('country')?.setValue(this.address.address.state)

      if (this.address.address.postcode)
        this.registerForm.get('zipCode')?.setValue(this.address.address.postcode)

    }

    // extract the name from the address object and send it to geolocation-bar in HTML

  }

  extractLatitude(): number {

    let latitude = 51.5072

    if (this.address)
      latitude = this.address.lat

    return latitude
  }

  extractLongitude(): number {

    let longitude = 0.1276

    if (this.address)
      longitude = this.address.lon

    return longitude
  }

  extractAddressName(): string {

    let addressName: string = ""

    if (this.address) {
      if (this.address.address.road) {
        addressName = this.address.address.road
      } else if (this.address.address.name) {
        addressName = this.address.address.name
      }
      else if (this.address.address.town) {
        addressName = this.address.address.town
      }
      else if (this.address.address.city) {
        addressName = this.address.address.city
      }
      else if (this.address.address.municipality) {
        addressName = this.address.address.municipality
      }
      else
      {
        addressName = this.address.display_name
      }
    }

    return addressName
  }

  ngOnInit(): void {}

}
