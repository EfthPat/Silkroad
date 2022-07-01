import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css']
})
export class ImageSliderComponent implements OnInit {

  @Input() link: string
  @Input() images: any[]
  activeImage = 0

  constructor() {
    this.link = ""
    this.images = []
  }

  ngOnInit(): void {
  }

  getNextImage(): void {
    if (this.images.length)
      this.activeImage = (this.activeImage + 1) % this.images.length
  }

  getPreviousImage(): void {
    if (this.images.length)
      this.activeImage > 0 ? this.activeImage-- : this.activeImage = this.images.length - 1
  }


}
