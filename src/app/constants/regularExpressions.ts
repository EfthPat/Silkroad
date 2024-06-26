

export const formExpressions = {

  price : "^([0-9]{0,5}\\.?[0-9]{0,2}|\\.[0-9]{1,2})$",
  username: "^(?=.{4,10}$)(?=(.*[a-zA-Z0-9]{4,10}.*))[a-zA-Z0-9_]+$",
  password: "^(?=.{4,10}$)\\S*$",
  tin: "^(?=.{4,10}$)[a-zA-Z0-9]*$",
  phoneNumber: "^(\\+\\d{1,2}\\s?)?1?\\-?\\.?\\s?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$",
  email: "^(?=.{10,30}$)[A-Za-z0-9]{2,}@([a-z0-9]{3,8}\\.com){1}$",
  country: "^[.a-z A-Z]{2,50}",
  name: "^[A-Za-z]{4,20}$",
  zipCode: "^\\w{1,6}([- ]{1}\\w{1,6})?$",
  streetNumber: "^\\w{1,6}([- ]{1}\\w{1,6})?$"

}
