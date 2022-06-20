export interface AddressInfo {

  address: {
    coordinates: {
      latitude: string | number
      longitude: string | number
    }
    country: string | null
    location: string | null
    streetName: string | null
    streetNumber: string | number | null
    zipCode: string | number | null

  }

}
