import {Component, OnInit} from '@angular/core';
import {RequestService} from "../../services/request.service";
import {UserThumbnail} from "../../interfaces/UserThumbnail";
import {Router} from "@angular/router";
import {UtilService} from "../../services/util.service";

@Component({
  selector: 'app-admin-navigation-panel',
  templateUrl: './admininstrationPanel.component.html',
  styleUrls: ['./admininstrationPanel.component.css']
})
export class AdmininstrationPanelComponent implements OnInit {

  userThumbnails: UserThumbnail[]

  // pagination
  pageSize: number
  pageIndex: number
  totalPages: number

  // query variables
  userApproval: string

  // UI variables
  constructor(public utilService: UtilService, private requestService: RequestService, private router: Router) {

    this.userThumbnails = []

    // pagination
    this.pageSize = 6
    this.pageIndex = 0
    this.totalPages = 0

    // query variables
    this.userApproval = ""


  }

  submitFilter(approval: string): void {
    this.userApproval = approval
    this.getUserThumbnails(this.pageSize, 1, this.userApproval)
  }

  getNextPage(): void {
    if (this.pageIndex < this.totalPages)
      this.getUserThumbnails(this.pageSize, this.pageIndex + 1, this.userApproval)
  }

  getPreviousPage(): void {
    if (this.pageIndex > 1)
      this.getUserThumbnails(this.pageSize, this.pageIndex - 1, this.userApproval)
  }

  // get the user thumbnails to populate the page
  getUserThumbnails(pageSize: number, pageIndex: number, userApproval: string): void {

    this.requestService.getUserThumbnails(pageSize, pageIndex, userApproval).subscribe(
      response => {

        // fill the user thumbnail array
        this.userThumbnails = response.objects

        // update total pages
        this.totalPages = response.totalPages

        //update page index
        pageIndex>this.totalPages ? this.pageIndex = this.totalPages : this.pageIndex = pageIndex

      }
    )

  }

  userInfo(index: number): void {

    let username = this.userThumbnails[index].username

    this.router.navigate(['administration/users',username])

    return
  }

  ngOnInit(): void {
    this.getUserThumbnails(this.pageSize, 1, this.userApproval)
  }

}
