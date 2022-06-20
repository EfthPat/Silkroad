
export interface AuctionThumbnail {

  bidder: string | null
  buyPrice: number | null
  endDate: string
  expired: boolean
  firstBid: number
  highestBid: number
  id: number
  images: any[]
  name: string
}
