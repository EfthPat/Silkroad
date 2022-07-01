import {Component, OnInit} from '@angular/core';
import {RequestService} from "../../services/request.service";
import {UserThumbnail} from "../../interfaces/UserThumbnail";
import {Router} from "@angular/router";
import {UtilService} from "../../services/util.service";

@Component({
  selector: 'app-admin-navigation-panel',
  templateUrl: './administrationPanel.component.html',
  styleUrls: ['./administrationPanel.component.css']
})
export class AdministrationPanelComponent implements OnInit {

  userThumbnails: UserThumbnail[]
  pageSize: number
  pageIndex: number
  totalPages: number
  userApproval: string

  // UI variables
  constructor(public utilService: UtilService, private requestService: RequestService, private router: Router) {

    this.userThumbnails = []
    this.pageSize = 6
    this.pageIndex = this.totalPages = 0
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

  getUserThumbnails(pageSize: number, pageIndex: number, userApproval: string): void {

    this.requestService.getUserThumbnails(pageSize, pageIndex, userApproval).subscribe(
      response => {

        this.userThumbnails = response.objects
        this.totalPages = response.totalPages
        pageIndex > this.totalPages ? this.pageIndex = this.totalPages : this.pageIndex = pageIndex

      }
    )

  }

  userInfo(index: number): void {

    let username = this.userThumbnails[index].username
    this.router.navigate(['administration/users', username])

    return
  }

  ngOnInit(): void {
    this.getUserThumbnails(this.pageSize, 1, this.userApproval)
  }

}
