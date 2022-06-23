import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {RequestService} from "../../services/request.service";
import {endpoints} from "../../constants/pageLinks";

@Component({
  selector: 'app-user-information-panel',
  templateUrl: './user-info.component.html',
  styleUrls: ['./userInformationPanel.css']
})
export class UserInformationPanel implements OnInit {

  userForm: FormGroup
  showApproval: boolean

  constructor(private route: ActivatedRoute, private router: Router, private requestService: RequestService) {

    this.showApproval = false

    // USER'S INFORMATION
    this.userForm = new FormGroup({

      username: new FormControl(''),
      email: new FormControl(''),
      role: new FormControl(''),
      approved: new FormControl(''),
      firstname: new FormControl(''),
      lastname: new FormControl(''),
      phone: new FormControl(''),
      tin: new FormControl(''),
      buyerRating: new FormControl(''),
      sellerRating: new FormControl(''),
      latitude: new FormControl(''),
      longitude: new FormControl(''),
      country: new FormControl(''),
      location: new FormControl(''),
      streetName: new FormControl(''),
      streetNumber: new FormControl(''),
      zipCode: new FormControl(''),
      joinDate: new FormControl('')
    })

    this.userForm.disable()

  }

  getUserInfo(username: string): void {
    this.requestService.getUserInfo(username).subscribe(
      // if user's info was fetched successfully
      response => {

        this.userForm.get('username')?.setValue(response.username)
        this.userForm.get('email')?.setValue(response.email)
        this.userForm.get('role')?.setValue(response.role)
        this.userForm.get('approved')?.setValue(response.approved)
        this.userForm.get('firstname')?.setValue(response.firstName)
        this.userForm.get('lastname')?.setValue(response.lastName)
        this.userForm.get('phone')?.setValue(response.phone)
        this.userForm.get('tin')?.setValue(response.tin)
        this.userForm.get('buyerRating')?.setValue(response.buyerRating)
        this.userForm.get('sellerRating')?.setValue(response.sellerRating)
        this.userForm.get('latitude')?.setValue(response.address.coordinates.latitude)
        this.userForm.get('longitude')?.setValue(response.address.coordinates.longitude)
        this.userForm.get('country')?.setValue(response.address.country)
        this.userForm.get('location')?.setValue(response.address.location)
        this.userForm.get('streetName')?.setValue(response.address.streetName)
        this.userForm.get('streetNumber')?.setValue(response.address.streetNumber)
        this.userForm.get('zipCode')?.setValue(response.address.zipCode)
        this.userForm.get('joinDate')?.setValue(response.joinDate)

        // if user is approved already, hide the approval button
        this.userForm.get('approved')?.value ? this.showApproval = false : this.showApproval = true

      },
      // if an error occurred, redirect admin-navigation-panel to previous page
      error => {
        this.redirectAdmin()
      }
    )
  }

  // approve the said user's registration request and redirect admin-navigation-panel to previous page
  approveUser(): void {
    this.requestService.approveUser(this.userForm.get('username')?.value).subscribe(
      response => {
        this.redirectAdmin()
      },
      error => {
        this.redirectAdmin()
      }
    )
  }

  redirectAdmin(): void {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || endpoints.users;
    this.router.navigate([returnUrl])
  }

  ngOnInit(): void {
    this.getUserInfo(this.route.snapshot.params['username'])
  }




}
