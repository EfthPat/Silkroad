import {Component, OnInit} from '@angular/core';
import {RequestService} from "../../services/request.service";
import {BrowsingAuctionThumbnail} from "../../interfaces/BrowsingAuctionThumbnail";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UtilService} from "../../services/util.service";
import {serverLinks, serverParameters} from "../../constants/server";
import {formExpressions} from "../../constants/regularExpressions"

@Component({
  selector: 'app-auction-browsing-navigation-panel',
  templateUrl: './auctionBrowsingPanel.component.html',
  styleUrls: ['./auctionBrowsingPanel.component.css']
})
export class AuctionBrowsingPanelComponent implements OnInit {

  serverLink: string
  serverParameter: string

  browsingAuctionThumbnails: BrowsingAuctionThumbnail[]
  imageLinks: any[]

  pageSize: number
  pageIndex: number
  totalPages: number

  dfltMinPrice!: number
  dfltMaxPrice!: number
  dfltLocation!: string
  dfltCategory!: string
  dfltQuery!: string
  dfltBuyNow!: boolean

  location: string
  priceRangeForm: FormGroup

  constructor(private requestService: RequestService, private route: ActivatedRoute, private router: Router,
              public utilService: UtilService) {

    this.serverLink = serverLinks[0]
    this.serverParameter = serverParameters.mediaParameter
    this.browsingAuctionThumbnails = this.imageLinks = []
    this.pageSize = 6
    this.pageIndex = this.totalPages = 0

    this.resetParameters()

    this.location = ""
    this.priceRangeForm = new FormGroup(
      {
        minPrice: new FormControl('', [Validators.required, Validators.pattern(formExpressions.price)]),
        maxPrice: new FormControl('', [Validators.required, Validators.pattern(formExpressions.price)])
      }
    )

  }


  resetParameters(): void {
    this.dfltMinPrice = 0
    this.dfltMaxPrice = -1
    this.dfltLocation = this.dfltCategory = "Any"
    this.dfltQuery = ""
    this.dfltBuyNow = false
  }

  submitFilters(): void {


    let minPrice = this.priceRangeForm.get('minPrice')
    let maxPrice = this.priceRangeForm.get('maxPrice')

    this.dfltMinPrice = (minPrice?.valid ? +minPrice?.value : 0)
    this.dfltMaxPrice = (maxPrice?.valid ? +maxPrice?.value : -1)


    if (minPrice?.valid && maxPrice?.valid && this.dfltMinPrice>this.dfltMaxPrice)
    {
      let tempPrice = this.dfltMinPrice
      this.dfltMinPrice = this.dfltMaxPrice
      this.dfltMaxPrice = tempPrice
    }


    this.location = this.location.trim()
    this.location ? this.dfltLocation = this.location : this.dfltLocation = "Any"

    let newLink = 'browse'
    let parametersExist = false

    if(this.dfltMinPrice>0)
    {
      newLink+='?min-price='+this.dfltMinPrice.toString()
      parametersExist = true
    }
    if(this.dfltMaxPrice>=0)
    {
      if(!parametersExist)
        newLink+='?max-price='+this.dfltMaxPrice.toString()
      else
        newLink+='&max-price='+this.dfltMaxPrice.toString()
      parametersExist = true
    }
    if(this.dfltLocation!=="Any")
    {
      if(!parametersExist)
        newLink+='?location='+encodeURIComponent(this.dfltLocation)
      else
        newLink+='&location='+encodeURIComponent(this.dfltLocation)
      parametersExist = true
    }

    // if buy-now button is checked
    if(this.dfltBuyNow)
    {
      if(!parametersExist)
        newLink+='?buy-now=true'
      else
        newLink+='&buy-now=true'
      parametersExist = true
    }

    // get the 'query' and 'category' parameters that might exist in the URL

    if(this.route.snapshot.queryParams['query'])
    {
      if(!parametersExist)
        newLink+='?query='+encodeURIComponent(this.route.snapshot.queryParams['query'].trim())
      else
        newLink+='&query='+encodeURIComponent(this.route.snapshot.queryParams['query'].trim())
      parametersExist = true
    }

    if(this.route.snapshot.queryParams['category'])
    {
      if(!parametersExist)
        newLink+='?category='+encodeURIComponent(this.route.snapshot.queryParams['category'].trim())
      else
        newLink+='&category='+encodeURIComponent(this.route.snapshot.queryParams['category'].trim())
    }


    location.replace(newLink)


  }

  getPreviousPage(): void {
    if (this.pageIndex > 1)
      this.getBrowsingAuctions(this.pageSize, this.pageIndex - 1, this.dfltMinPrice, this.dfltMaxPrice,
        this.dfltLocation, this.dfltCategory, this.dfltQuery, this.dfltBuyNow)

  }

  getNextPage(): void {

    if (this.pageIndex < this.totalPages)
      this.getBrowsingAuctions(this.pageSize, this.pageIndex + 1, this.dfltMinPrice, this.dfltMaxPrice,
        this.dfltLocation, this.dfltCategory, this.dfltQuery, this.dfltBuyNow)

  }

  auctionInfo(index: number): void {
    let selection = window.getSelection()
    if(selection?.toString().length)
      return
    let auctionID = this.browsingAuctionThumbnails[index].id

    this.router.navigate(['auctions',auctionID,'view'])
  }


  // fetch the auctions to populate the card section
  getBrowsingAuctions(pageSize: number, pageIndex: number, minPrice: number, maxPrice: number, location: string,
                      category: string, auctionText: string, buyNow: boolean): void {
    this.requestService.getBrowsingAuctions(pageSize, pageIndex, minPrice, maxPrice, location, category, auctionText, buyNow)
      .subscribe(response => {

          // reset the thumbnail and image array
          this.browsingAuctionThumbnails = []
          this.imageLinks = []

          // store the received thumbnails and links into 2 arrays
          for (let thumbnail of response.objects)
          {
            this.browsingAuctionThumbnails.push(thumbnail)
            this.imageLinks.push([0])
          }

            // update the total page amount
            this.totalPages = response.totalPages

            // update page index
            pageIndex > this.totalPages ? this.pageIndex = this.totalPages : this.pageIndex = pageIndex

        },
        error => {
        console.log("BROWSING FAILED :",error)
        })


  }

  getNextImage(index: number) : void {
    this.imageLinks[index] = (this.imageLinks[index] + 1)%this.browsingAuctionThumbnails[index].images.length
  }

  getPreviousImage(index: number) : void {
    this.imageLinks[index] > 0 ? this.imageLinks[index]-- : this.imageLinks[index] = this.browsingAuctionThumbnails[index].images.length-1
  }

  ngOnInit(): void {

    // every time URL changes
    this.route.queryParams.subscribe(
      () => {

        // reset the search-bar parameters
        this.resetParameters()

        // reset UI variables
        this.priceRangeForm.get('minPrice')?.setValue('')
        this.priceRangeForm.get('maxPrice')?.setValue('')
        this.location=''

        let queryParameters = this.route.snapshot.queryParams

        if(queryParameters['query'])
          this.dfltQuery = decodeURIComponent(queryParameters['query'].trim())

        if(queryParameters['category'])
          this.dfltCategory = decodeURIComponent(queryParameters['category'].trim())

        if(queryParameters['min-price'] && !isNaN(queryParameters['min-price']))
        {
          this.dfltMinPrice = queryParameters['min-price']
          this.priceRangeForm.get('minPrice')?.setValue(queryParameters['min-price'])
        }

        if(queryParameters['max-price'] && !isNaN(queryParameters['max-price']))
        {
          this.dfltMaxPrice = queryParameters['max-price']
          this.priceRangeForm.get('maxPrice')?.setValue(queryParameters['max-price'])
        }

        if(queryParameters['location'])
          this.location = this.dfltLocation = decodeURIComponent(queryParameters['location'].trim())

        if(queryParameters['buy-now'] && queryParameters['buy-now']==="true" )
          this.dfltBuyNow=true

        this.getBrowsingAuctions(this.pageSize, 1, this.dfltMinPrice, this.dfltMaxPrice, this.dfltLocation,
          this.dfltCategory, this.dfltQuery, this.dfltBuyNow)

      }
    )

  }

}


