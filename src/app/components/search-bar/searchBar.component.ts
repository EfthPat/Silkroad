import {Component, Input, OnInit} from '@angular/core';
import {RequestService} from "../../services/request.service";
import {AuthService} from "../../services/auth.service";
import {endpoints} from "../../constants/pageLinks";
import {roles} from "../../constants/roles";
import {searchOptions, buttonOptions} from "../../constants/navigation";

@Component({
  selector: 'search-bar',
  templateUrl: './searchBar.component.html',
  styleUrls: ['./searchBar.component.css']
})
export class SearchBarComponent implements OnInit {

  roleSet: any
  dynamicButtonTitle: string
  dynamicButtonOptions: string[]
  adminOption: string
  userRole: string
  username: string
  categories: string[]
  shopByCategory: string
  @Input() invisible: boolean
  @Input() category: string
  @Input() query: string

  constructor(private requestService: RequestService, private authService: AuthService) {

    this.roleSet = roles
    this.username = this.query = ""
    this.invisible = false
    this.dynamicButtonOptions = searchOptions
    // Administration tab - admin-navigation-panel
    this.adminOption = buttonOptions.administration
    this.userRole = this.authService.getUserRole()
    this.userRole === roles[0] ? this.dynamicButtonTitle = buttonOptions.login : this.dynamicButtonTitle = this.authService.getUsername()!
    this.categories = []
    this.category = buttonOptions.categories
    this.shopByCategory = buttonOptions.shopByCategory

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

    let query = encodeURI(auctionText.trim())

    let url = endpoints.browse + "?category=" + encodeURIComponent(requestedCategory)
    if (query)
      url += "&query=" + encodeURIComponent(query)

    location.replace(url)
  }

  categoryShopping(requestedCategory: string): void {
    location.replace(endpoints.browse + "?category=" + encodeURIComponent(requestedCategory))
  }

  tabRedirect(option: any): void {

    if (option === "My Purchases")
      location.replace(endpoints.myPurchases)
    else if (option === "My Auctions")
      location.replace(endpoints.myAuctions)
    else if (option === "My Bids")
      location.replace(endpoints.myBids)
    else if (option === "Administration")
      location.replace(endpoints.users)
    else if (option === "My Messages")
      location.replace(endpoints.inbox)
    else if (option === "sell")
      location.replace(endpoints.createAuction)
    else if (option === "login")
      location.replace(endpoints.login)
    else if (option === "home")
      location.replace(endpoints.home)
    else if (option === "logout") {
      this.authService.logout()
      this.userRole = roles[0]
      this.dynamicButtonTitle = "Login"
      location.replace(endpoints.browse)
    }

  }

  ngOnInit(): void {
    this.getCategories()
  }

}
