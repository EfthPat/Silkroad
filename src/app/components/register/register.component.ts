import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {RequestService} from "../../services/request.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  address: any
  registerForm: FormGroup
  showError: boolean

  constructor(private router: Router, private requestService: RequestService) {

    this.registerForm = new FormGroup({

      // username - unique
      username: new FormControl('', [Validators.required, Validators.pattern('^\\S*$')]),
      // passwords
      password: new FormControl('', [Validators.required, Validators.pattern('^\\S*$')]),
      confirmPassword: new FormControl('', [Validators.required]),
      // firstname , lastname
      firstname: new FormControl('', [Validators.required, Validators.pattern('^[^0-9!@#$%^&*()_+=.,?><`~]+$')]),
      lastname: new FormControl('', [Validators.required, Validators.pattern('^[^0-9!@#$%^&*()_+=.,?><`~]+$')]),
      // contact info
      email: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      // residence
      addressStreet: new FormControl('', [Validators.required]),
      streetNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      country: new FormControl('', [Validators.required, Validators.pattern('^[^09!@#$%^&*()_+=?><`~]+$')]),
      zipCode: new FormControl('', [Validators.required, Validators.pattern('^\\d{5}(?:[-\\s]\\d{4})?$')]),

      // other info
      tin: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9]*$')]),


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

      // send a signup request to the server with user's data
      this.requestService.registerUser(userInfo).subscribe(
        // if the server responded successfully
        response => {
          // then, the signup request was accepted and the user is redirected to home page
          this.router.navigate(['/browse'])
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


    // function that extracts street name
    let getStreetName = (address: any) => {
      if (address.street)
        return address.street
      if(address.name)
        return address.name
      return address.label
    }

    // function that extracts location
    let getLocation = (address: any, defaultValue : any) => {
      if (address.locality)
        return address.locality
      if (address.neighbourhood)
        return address.neighbourhood
      if (address.region)
        return address.region
      if(address.county)
        return address.county
      if(address.continent)
        return address.continent
      return defaultValue
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
          latitude: this.address.latitude,
          longitude: this.address.longitude
        }
        , country: this.registerForm.get('country')?.value,
        // if NULL -> DEFAULT VALUE
        location: getLocation(this.address, this.registerForm.get('country')?.value),
        streetName: getStreetName(this.address),
        streetNumber: this.registerForm.get('streetNumber')?.value,
        zipCode: this.registerForm.get('zipCode')?.value
      }
    }

    return userInfo
  }

  getGeolocationAddress(address: any): void {

    console.table(address)

    // store the whole address the geolocation sent you
    this.address = address
    this.registerForm.get('addressStreet')?.setErrors(null)

    if (this.address) {
      this.registerForm.get('streetNumber')?.reset()
      this.registerForm.get('country')?.reset()
      this.registerForm.get('zipCode')?.reset()
      if (this.address.number)
        this.registerForm.get('streetNumber')?.setValue(this.address.number)
      if (this.address.country)
        this.registerForm.get('country')?.setValue(this.address.country)
      if (this.address.postal_code)
        this.registerForm.get('zipCode')?.setValue(this.address.postal_code)
    }

    // extract the coordinates from the address object and send them to MAP in HTML

  }

  updateBarsState(validState: any): void {

    validState ? this.registerForm.get('addressStreet')?.setErrors(null) :
      this.registerForm.get('addressStreet')?.setErrors({invalidAddress: true})

  }

  getMapsAddress(address: any): void {

    console.table( address)

    // store the whole address the MAP sent you
    this.address = address
    this.registerForm.get('addressStreet')?.setErrors(null)


    if (this.address) {
      this.registerForm.get('streetNumber')?.reset()
      this.registerForm.get('country')?.reset()
      this.registerForm.get('zipCode')?.reset()
      if (this.address.number)
        this.registerForm.get('streetNumber')?.setValue(this.address.number)
      if (this.address.country)
        this.registerForm.get('country')?.setValue(this.address.country)
      if (this.address.postal_code)
        this.registerForm.get('zipCode')?.setValue(this.address.postal_code)
    }

    // extract the name from the address object and send it to geolocation-bar in HTML

  }

  extractLatitude(): number {

    let latitude = 37.9838

    if (this.address)
      latitude = this.address.latitude

    return latitude
  }

  extractLongitude(): number {

    let longitude = 23.7275

    if (this.address)
      longitude = this.address.longitude

    return longitude
  }

  extractAddressName(): string {

    let addressName: string = ""

    if (this.address) {
      addressName = this.address.label
    }

    return addressName
  }

  ngOnInit(): void {
  }

}
