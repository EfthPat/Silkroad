export interface BrowsingAuctionThumbnail {

  id: number
  name: string
  buyPrice: number | null
  firstBid: number
  totalBids: number
  highestBid: number
  images: string[]
  country: string | null

}
