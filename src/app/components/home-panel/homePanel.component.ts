import {Component, OnInit} from '@angular/core';
import {RequestService} from "../../services/request.service";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {UtilService} from "../../services/util.service";

@Component({
  selector: 'app-home-navigation-panel',
  templateUrl: './homePanel.component.html',
  styleUrls: ['./homePanel.component.css']
})
export class HomePanelComponent implements OnInit {

  position: number
  showRecommendations: boolean
  recommendations: any[]
  activeImages: number[]

  constructor(private requestService: RequestService, private authService: AuthService,
              private router: Router, public utilService: UtilService) {

    this.position = 0
    this.showRecommendations = false
    this.recommendations = []
    this.activeImages = []
  }

  getRecommendations(): void {
    this.requestService.getRecommendations().subscribe(
      // if recommendations were fetched successfully
      recommendations => {


        for (let recommendation of recommendations) {
          this.recommendations.push(recommendation)
          this.activeImages.push(0)
        }

        this.showRecommendations = !(this.authService.getUserRole() === "GUEST" || this.recommendations.length == 0);

      },
      // if recommendations weren't fetched
      () => {
      }
    )


  }

  ngOnInit(): void {
    this.getRecommendations()
  }

  getNextImage(index: number): void {


    let totalImages = this.recommendations[index].images.length
    // if the recommendation has any images
    if (totalImages)
      this.activeImages[index] = (this.activeImages[index] + 1) % totalImages
  }

  getPreviousImage(index: number): void {


    // get the total amount of images of the recommendation
    let totalImages = this.recommendations[index].images.length
    // if the recommendation has any images
    if (totalImages)
      this.activeImages[index] > 0 ? this.activeImages[index]-- : this.activeImages[index] = totalImages - 1

  }

  viewRecommendation(index: number) {
    this.router.navigate(['auctions', this.recommendations[index].id, 'view'])
  }

  slide(left: boolean) {

    let element = document.getElementById('recommendations')


    // if there's an odd number of recommendations
    if (left) {

      if (this.position + 1 + 1 <= (this.recommendations.length / 2) && (Math.abs(this.position - 1) != (this.recommendations.length / 2))) {
        this.position++
      } else if (this.position + 0.5 + 1 <= (this.recommendations.length / 2)) {
        this.position += 0.5
      } else {

        // bounce
        element!.style.transition = 'transform 0.3s'
        this.position += 0.04
        element!.style.transform = `translateX( ${(50) * this.position}% )`

        setTimeout(() => {
          element!.style.transition = 'transform 0.3s'
          this.position -= 0.04
          element!.style.transform = `translateX( ${(50) * this.position}% )`
        }, 300)

        return

      }

    } else {

      if (Math.abs(this.position - 1 - 1) <= (this.recommendations.length / 2) && (this.position + 1 != this.recommendations.length / 2)) {
        this.position--
      } else if (Math.abs(this.position - 0.5 - 1) <= (this.recommendations.length / 2)) {
        this.position -= 0.5
      } else {

        // bounce
        element!.style.transition = 'transform 0.3s'
        this.position -= 0.04
        element!.style.transform = `translateX( ${(50) * this.position}% )`

        setTimeout(() => {
          element!.style.transition = 'transform 0.3s'
          this.position += 0.04
          element!.style.transform = `translateX( ${(50) * this.position}% )`
        }, 300)

        return
      }

    }


    element!.style.transition = 'transform 1s'
    element!.style.transform = `translateX( ${(50) * this.position}% )`

  }


}
