import {Component, Input, OnInit} from '@angular/core';
import {RequestService} from "../../services/request.service";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {endpoints} from "../../constants/pageLinks";
import {roles} from "../../constants/roles";

@Component({
  selector: 'search-bar',
  templateUrl: './searchBar.component.html',
  styleUrls: ['./searchBar.component.css']
})
export class SearchBarComponent implements OnInit {

  roleSet : any

  dynamicButtonTitle: string
  dynamicButtonOptions: string[]
  adminOption: string
  userRole: string
  username: string
  @Input() invisible: boolean
  categories: string[]

  // UI variables
  // "Shop by Category" dropdown's name
  shopByCategory: string
  // search-bar-dropdown's name
  @Input() category: string
  @Input() query: string

  constructor(private requestService: RequestService, private authService: AuthService, private router: Router) {

    this.roleSet = roles
    this.username = ""
    this.invisible = false
    this.query = ""

    this.dynamicButtonOptions = [
      "My Bids",
      "My Purchases",
      "My Auctions",
      "My Messages"
    ]

    // Administration tab - admin-navigation-panel
    this.adminOption = "Administration"

    this.userRole = this.authService.getUserRole()

    this.userRole === roles[0] ? this.dynamicButtonTitle = "Login" : this.dynamicButtonTitle = this.authService.getUsername()!

    this.categories = []

    // UI variables
    this.category = "Categories"
    this.shopByCategory = "Shop By Category"

  }

  getCategories(): void {
    this.requestService.getCategories().subscribe(
      categories => {

        this.categories = categories
      }
    )
  }

  updateCategory(chosenCategory: string): void {
    this.category = chosenCategory
  }

  search(auctionText: string): void {

    let requestedCategory
    this.category !== "Categories" ? requestedCategory = this.category : requestedCategory = "Any"

    let params
    let query = auctionText.trim()

    params = query ? {query: query, category: requestedCategory} : {category: requestedCategory}

    this.router.navigate([endpoints.browse], {queryParams: params});
  }


  categoryShopping(requestedCategory: string): void {
    this.router.navigate([endpoints.browse], {queryParams: {category: requestedCategory}});
  }


  tabRedirect(option: any): void {

    if (option === "My Purchases")
      this.router.navigate([endpoints.myPurchases])
    else if (option === "My Auctions")
      this.router.navigate([endpoints.myAuctions])
    else if (option === "My Bids")
      this.router.navigate([endpoints.myBids])
    else if (option === "Administration")
      this.router.navigate([endpoints.users])
    else if (option === "My Messages")
      this.router.navigate([endpoints.inbox])
    else if (option === "sell")
      this.router.navigate([endpoints.createAuction])
    else if (option === "login")
      this.router.navigate([endpoints.login])
    else if (option === "home")
      this.router.navigate([endpoints.home])
    else if (option === "logout") {
      this.authService.logout()
      this.userRole = roles[0]
      this.dynamicButtonTitle="Login"
      this.router.navigate([endpoints.browse])
    }

  }

  ngOnInit(): void {
    this.getCategories()
  }


}
