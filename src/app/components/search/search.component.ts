import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RequestService} from "../../services/request.service";
import {Category} from "../../interfaces/Category";
import {SearchAuction} from "../../interfaces/SearchAuction";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

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
  // search-dropdown's name
  @Input() category: string
  @Input() query: string

  constructor(private requestService: RequestService, private authService: AuthService, private router: Router) {

    this.username = ""
    this.invisible = false
    this.query = ""

    this.dynamicButtonOptions = [
      "My Bids",
      "My Purchases",
      "My Auctions",
      "My Messages"
    ]

    // Administration tab - admin
    this.adminOption = "Administration"

    this.userRole = this.authService.getUserRole()

    this.userRole === "GUEST" ? this.dynamicButtonTitle = "Login" : this.dynamicButtonTitle = this.authService.getUsername()!

    this.categories = []

    // UI variables
    this.category = "Categories"
    this.shopByCategory = "Shop By Category"

  }

  getCategories(): void {
    this.requestService.getCategories().subscribe(
      categories => {
        // !
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

    this.router.navigate(['/browse'], {queryParams: params});
  }


  categoryShopping(requestedCategory: string): void {
    this.router.navigate(['/browse'], {queryParams: {category: requestedCategory}});
  }


  tabRedirect(option: any): void {

    if (option === "My Purchases")
      this.router.navigate(['/panel/activity/my-purchases'])
    else if (option === "My Auctions")
      this.router.navigate(['/panel/activity/my-auctions'])
    else if (option === "My Bids")
      this.router.navigate(['/panel/activity/my-bids'])
    else if (option === "Administration")
      this.router.navigate(['/panel/administration/users'])
    else if (option === "My Messages")
      this.router.navigate(['/panel/messages/inbox'])
    else if (option === "sell")
      this.router.navigate(['/auctions/create'])
    else if (option === "login")
      this.router.navigate(['/login'])
    else if (option === "home")
      this.router.navigate(['/home'])
    else if (option === "logout") {
      this.authService.logout()
      this.userRole = "GUEST"
      this.dynamicButtonTitle="Login"
      this.router.navigate(['/browse'])
    }

  }

  ngOnInit(): void {
    this.getCategories()
  }


}
