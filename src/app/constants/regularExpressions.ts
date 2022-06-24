

export const formExpressions = {

  price : "^[0-9]*(.?[0-9]{1,2})$",
  zipCode: "^\\d{5}(?:[-\\s]\\d{4})?$",
  streetNumber: "^[a-zA-Z0-9-]*$",
  country: "[.a-z A-Z]{2,}",
  tin: "[a-zA-Z0-9]*$",
  phoneNumber: "^(\\+\\d{1,2}\\s?)?1?\\-?\\.?\\s?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$",
  name: "^[\\w'\\-,.][^0-9_!¡?÷?¿/\\\\+=@#$%ˆ&*(){}|~<>;:[\\]]{2,}$",
  email: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
  username: "^\\S*$",
  password: "^\\S*$"

}
