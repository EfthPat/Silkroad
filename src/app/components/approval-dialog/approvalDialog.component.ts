import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-approval-dialog',
  templateUrl: './approvalDialog.component.html',
  styleUrls: ['./approvalDialog.component.css']
})
export class ApprovalDialogComponent implements OnInit {

  message: string
  toDelete: boolean

  constructor(private dialogRef: MatDialogRef<ApprovalDialogComponent>, @Inject(MAT_DIALOG_DATA) data : any) {
    data && data.message ? this.message = data.message : this.message = "Are you sure?"
    this.toDelete = false
  }

  ngOnInit(): void {}

  getUserReply(toDelete: boolean) : void{
    this.toDelete = toDelete
    this.dialogRef.close(this.toDelete)
  }

}
