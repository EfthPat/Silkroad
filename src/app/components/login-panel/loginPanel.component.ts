import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {roles} from "../../constants/roles";
import {endpoints} from "../../constants/pageLinks";

@Component({
  selector: 'app-login-navigation-panel',
  templateUrl: './loginPanel.component.html',
  styleUrls: ['./loginPanel.component.css']
})
export class LoginPanelComponent implements OnInit {

  errorMessage: string
  showError: boolean
  loginForm: FormGroup

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {

    this.errorMessage = ""
    this.showError = false

    this.loginForm = new FormGroup(
      {
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
      }
    )

  }


  login(): void {


    // if user didn't insert username or password, print an error message
    if (this.loginForm.invalid) {
      this.errorMessage = "Missing Username or Password"
      this.showError = true
      this.loginForm.markAsPristine()
    }
    // if user filled the form
    else {
      let username = this.loginForm.get('username')?.value
      let password = this.loginForm.get('password')?.value

      // send a login-navigation-panel post-request to the server with user's form values
      this.authService.login(username, password).subscribe(

        // if the server responded successfully
        response => {

          this.errorMessage = ""
          this.showError = false

          // get the JSON web-token from the header of server's response
          let jwt: string = response.headers.get('Authorization')!

          // store username and jwt in local storage
          this.authService.storeUserInfo(username, jwt)

          // if user is an admin-navigation-panel, then redirect admin-navigation-panel to admin-navigation-panel tab
          if(this.authService.getUserRole()===roles[2]) {
            this.router.navigate([endpoints.users])
          }
          // otherwise, redirect user to homepage
          else {
            this.router.navigate([endpoints.browse])
          }
        },
        // if an error occurred
        error => {

          console.log("LOGIN FAILED :",error)

          // then, either user isn't approved yet
          if (error.error.code==="UE_006") {
            this.errorMessage = "Approval Pending"
          }
          // or username / password was incorrect
          else {
            this.errorMessage = "Invalid Username or Password"
          }

          this.showError = true
          this.loginForm.reset()
        }
      )


    }

  }

  ngOnInit(): void {}

}
