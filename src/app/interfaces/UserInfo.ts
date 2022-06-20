
export interface UserInfo {
  username: string,
  email: string,
  role: string,
  approved: boolean,
  firstName: string,
  lastName: string,
  phone: string,
  tin: string,
  buyerRating: number,
  sellerRating: number,
  address: {
    coordinates: {
      latitude: number,
      longitude: number
    },
    country: string,
    location: string,
    streetName: string,
    streetNumber: string,

    zipCode: string
  },
  joinDate: string
}
