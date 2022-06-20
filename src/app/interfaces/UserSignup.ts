
export interface UserSignup {

  username: string,
  password: string,
  email : string,
  firstName : string,
  lastName : string,
  phone : string,
  tin : string,

  address : {

    coordinates  : {
      latitude : string,
      longitude : string
    }
    ,
    country : string,
    location : string,
    streetName : string,
    streetNumber : number,
    zipCode : number

  }
}
