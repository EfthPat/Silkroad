import {Component, OnInit} from '@angular/core';
import {PurchaseThumbnail} from "../../interfaces/PurchaseThumbnail";
import {RequestService} from "../../services/request.service";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {UtilService} from "../../services/util.service";
import {serverLinks, serverParameters} from "../../constants/server";
import {endpoints} from "../../constants/pageLinks";

@Component({
  selector: 'app-my-purchases-tab',
  templateUrl: './myPurchasesTab.component.html',
  styleUrls: ['./myPurchasesTab.component.css']
})
export class MyPurchasesTabComponent implements OnInit {

  serverLink: string
  serverParameter: string

  purchaseThumbnails: PurchaseThumbnail[]
  imageLinks: any[]
  username: string


  // pagination
  pageSize: number
  pageIndex: number
  totalPages: number


  constructor(private requestService: RequestService, private authService: AuthService, private router: Router,
              public utilService: UtilService) {

    this.serverLink = serverLinks[0]
    this.serverParameter = serverParameters.mediaParameter


    this.username = this.authService.getUsername()!

    this.purchaseThumbnails = []
    this.imageLinks = []

    // pagination
    this.pageSize = 6
    this.pageIndex = 0
    this.totalPages = 0

  }

  getPurchaseThumbnails(username: string, pageIndex: number, pageSize: number): void {
    this.requestService.getPurchaseThumbnails(username, pageIndex, pageSize).subscribe(
      // if server responded successfully
      response => {

        // reset the 2 arrays
        this.purchaseThumbnails = []
        this.imageLinks = []

        // fill purchase thumbnail array
        for (let thumbnail of response.objects) {
          this.purchaseThumbnails.push(thumbnail)
          this.imageLinks.push([0])
        }

        // update total pages
        this.totalPages = response.totalPages

        // update page index
        pageIndex > this.totalPages ? this.pageIndex = this.totalPages : this.pageIndex = pageIndex

      },
      // if an error occurred
      () => {
      }
    )
  }

  purchaseInfo(index: number) {
    let selection = window.getSelection()
    if (selection?.toString().length)
      return
    let auctionID = this.purchaseThumbnails[index].id
    this.router.navigate(['auctions', auctionID, 'view'])
  }

  contactSeller(index: number) {
    let recipient = this.purchaseThumbnails[index].seller
    let title = this.purchaseThumbnails[index].name
    this.router.navigate([endpoints.send], {queryParams: {recipient: recipient, title: title}}
    )
  }

  getPreviousPage(): void {
    if (this.pageIndex > 1)
      this.getPurchaseThumbnails(this.username, this.pageIndex - 1, this.pageSize)
  }

  getNextPage(): void {
    if (this.pageIndex < this.totalPages)
      this.getPurchaseThumbnails(this.username, this.pageIndex + 1, this.pageSize)

  }

  ngOnInit(): void {
    this.getPurchaseThumbnails(this.username, 1, this.pageSize)
  }

  getNextImage(index: number): void {
    if (this.purchaseThumbnails[index].images.length)
      this.imageLinks[index] = (this.imageLinks[index] + 1) % this.purchaseThumbnails[index].images.length
  }

  getPreviousImage(index: number): void {
    if (this.purchaseThumbnails[index].images.length)
      this.imageLinks[index] > 0 ? this.imageLinks[index]-- : this.imageLinks[index] = this.purchaseThumbnails[index].images.length - 1
  }

}
