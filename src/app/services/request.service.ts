import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Observable, pipe} from "rxjs";
import {UserInfo} from "../interfaces/UserInfo";
import {UserSignup} from "../interfaces/UserSignup";
import {ServerExceptionResponse} from "../interfaces/ServerExceptionResponse";
import {Bid} from "../interfaces/Bid";
import {CustomMessage} from "../interfaces/CustomMessage";

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private serverUrl: string
  private categoriesParameter: string
  private adminParameter: string
  private usersParameter: string
  private purchasesParameter: string
  private bidsParameter: string
  private auctionsParameter: string
  private approvalParameter: string
  private bidParameter: string
  private messagesParameter: string
  private exportParameter: string
  private mediaParameter: string
  private recommendationsParameter: string

  constructor(private httpClient: HttpClient) {

    // server URL
    this.serverUrl = "http://localhost:8081"

    // server path variables
    this.categoriesParameter = "/categories"
    this.adminParameter = "/administration"
    this.purchasesParameter = "/purchases"
    this.messagesParameter = "/messages"
    this.auctionsParameter = "/auctions"
    this.approvalParameter = "/approve"
    this.usersParameter = "/users"
    this.bidsParameter = "/bids"
    this.bidParameter = "/bid"
    this.exportParameter = "/export"
    this.mediaParameter= "/media"
    this.recommendationsParameter="/recommend"

  }


  // ---------------------------------- GET BROWSING AUCTIONS ------------------------------------------------------- //

  // http://localhost:8081
  // /auctions
  // ?page=X
  // &size=Y
  // &[location = Lake]
  // &[category = Books]
  // &[min-price = 10]
  // &[max-price = 202]
  // &[buy-now = true | false]
  // &[query = SMS]

  // minPrice <=0 -> NOT INCLUDED
  // maxPrice <0 -> NOT INCLUDED
  // location = 'Any' -> NOT INCLUDED
  // category = 'Any' -> NOT INCLUDED

  getBrowsingAuctions(pageSize: number, pageIndex: number, minPrice: number, maxPrice: number, location: string,
                      category: string, auctionText: string, buyNow: boolean): Observable<any> {

    let completeUrl =
      this.serverUrl +
      this.auctionsParameter +
      "?page=" + pageIndex.toString() +
      "&size=" + pageSize.toString()

    if (location !== "Any")
      completeUrl += "&location=" + encodeURIComponent(location)

    if (category !== "Any")
      completeUrl += "&category=" + encodeURIComponent(category)

    if (minPrice > 0)
      completeUrl += "&min-price=" + minPrice.toString()
    if (maxPrice >= 0)
      completeUrl += "&max-price=" + maxPrice.toString()

    if (auctionText)
      completeUrl += "&query=" + encodeURIComponent(auctionText)

    if(buyNow)
      completeUrl += "&buy-now=true"

    console.log("REQUEST :",completeUrl)

    return this.httpClient.get<any>(completeUrl)

  }


  // ---------------------------------- GET USERS ------------------------------------------------------------------- //

  // # GET
  // http://localhost:8081
  // /administration
  // /users
  // ?page=X
  // &size=Y
  // &[approved = true | false]

  getUserThumbnails(pageSize: number, pageIndex: number, userApproval: string): Observable<any> {

    let completeUrl = this.serverUrl +
      this.adminParameter +
      this.usersParameter +
      "?page=" + pageIndex.toString() +
      "&size=" + pageSize.toString()

    if (userApproval === "yes")
      completeUrl += "&approved=true"
    else if (userApproval === "no")
      completeUrl += "&approved=false"

    return this.httpClient.get<any>(completeUrl)
  }

  // ---------------------------------- GET SPECIFIC USER ----------------------------------------------------------- //

  // # GET
  // http://localhost:8081
  // /administration
  // /users
  // /{username}

  getUserInfo(username: string): Observable<UserInfo> {

    let completeUrl = this.serverUrl + this.adminParameter + this.usersParameter + "/" + encodeURIComponent(username)

    return this.httpClient.get<UserInfo>(completeUrl)

  }

  // ----------------------------------- APPROVE USER --------------------------------------------------------------- //

  // # PUT
  // http://localhost:8081
  // /administration
  // /users
  // /{username}

  approveUser(username: string): Observable<any> {

    let completeUrl = this.serverUrl + this.adminParameter + this.usersParameter + "/" + encodeURIComponent(username)

    return this.httpClient.put<any>(completeUrl, {})

  }


  // -------------------------------------- GET AUCTION THUMBNAILS -------------------------------------------------- //

  // # GET
  // http://localhost:8081
  // /users
  // /{username}
  // /auctions
  // ?page=X
  // &size=Y
  // &[active = true | false]
  // &[sold = true | false]

  getAuctionThumbnails(username: string, pageIndex: number, pageSize: number, auctionState: string): Observable<any> {

    let completeUrl = this.serverUrl +
      this.usersParameter +
      "/" + encodeURIComponent(username) +
      this.auctionsParameter +
      "?page=" + pageIndex.toString() +
      "&size=" + pageSize.toString()

    if (auctionState === "active") {
      completeUrl += "&active=true"
    } else if (auctionState === "sold") {
      completeUrl += "&sold=true"
    }


    return this.httpClient.get<any>(completeUrl)
  }

  // -------------------------------------- DELETE AUCTION ---------------------------------------------------------- //

  // # DELETE
  // http://localhost:8081
  // /auctions
  // /{auctionID}

  deleteAuction(auctionID: number): Observable<any> {

    let completeUrl = this.serverUrl + this.auctionsParameter + "/" + auctionID.toString()


    return this.httpClient.delete(completeUrl)
  }

  // -------------------------------------- GET PURCHASE THUMBNAILS ------------------------------------------------- //

  // # GET
  // http://localhost:8081
  // /users
  // /{username}
  // /purchases
  // ?page=X
  // &size=Y

  getPurchaseThumbnails(username: string, pageIndex: number, pageSize: number): Observable<any> {

    let completeUrl = this.serverUrl +
      this.usersParameter +
      "/" + encodeURIComponent(username) +
      this.purchasesParameter +
      "?page=" + pageIndex.toString() +
      "&size=" + pageSize.toString()

    return this.httpClient.get<any>(completeUrl)

  }

  // ---------------------------------------- GET BID THUMBNAILS ---------------------------------------------------- //

  // # GET
  // http://localhost:8081
  // /users
  // /{username}
  // /bids
  // ?page=X
  // &size=Y

  getBidThumbnails(username: string, pageIndex: number, pageSize: number): Observable<any> {

    let completeUrl = this.serverUrl +
      this.usersParameter +
      "/" + encodeURIComponent(username) +
      this.bidsParameter +
      "?page=" + pageIndex.toString() +
      "&size=" + pageSize.toString()

    return this.httpClient.get<any>(completeUrl)

  }

  // ---------------------------------------- REGISTER USER --------------------------------------------------------- //

  // # POST
  // http://localhost:8081
  // /users

  registerUser(userInfo: any): Observable<any> {

    let completeUrl = this.serverUrl + this.usersParameter



    return this.httpClient.post(completeUrl, userInfo)

  }

  // ---------------------------------------- CREATE AUCTION -------------------------------------------------------- //

  // # POST
  // http://localhost:8081
  // /auctions

  createAuction(auction: FormData): Observable<ServerExceptionResponse | null> {

    let completeUrl = this.serverUrl + this.auctionsParameter


    return this.httpClient.post<any>(completeUrl, auction)

  }

  // ---------------------------------------- UPDATE AUCTION -------------------------------------------------------- //

  // # PUT
  // http://localhost:8081
  // /auctions
  // /{auctionID}

  updateAuction(auction: FormData, auctionID: number): Observable<ServerExceptionResponse | null> {

    let completeUrl = this.serverUrl + this.auctionsParameter + "/" + auctionID.toString()


    return this.httpClient.put<any>(completeUrl, auction)

  }


  // ---------------------------------------- GET CATEGORIES -------------------------------------------------------- //

  // # GET
  // http://localhost:8081
  // /categories

  getCategories(): Observable<any> {

    let completeUrl = this.serverUrl + this.categoriesParameter

    return this.httpClient.get<any>(completeUrl)
  }

  // ---------------------------------------- GET SPECIFIC AUCTION -------------------------------------------------- //

  // # GET
  // http://localhost:8081
  // /auctions
  // /{auctionID}

  getAuction(auctionID: number): Observable<any> {

    let completeUrl = this.serverUrl + this.auctionsParameter + "/" + auctionID.toString()


    return this.httpClient.get<any>(completeUrl)
  }

  // ---------------------------------------- BID ON AUCTION -------------------------------------------------------- //

  // # POST
  // http://localhost:8081
  // /auctions
  // /{auctionID}/bid

  // body : { "version" : "0" , "amount" : "1000"  }

  bidOnAuction(auctionID: number, bid: Bid): Observable<ServerExceptionResponse | null> {

    let completeUrl = this.serverUrl + this.auctionsParameter + "/" + auctionID.toString() + this.bidParameter


    return this.httpClient.post<any>(completeUrl, bid)
  }

  // ---------------------------------------- GET MESSAGES ---------------------------------------------------------- //

  // GET
  // http://localhost:8081
  // /users
  // /{username}
  // /messages
  // ?page=X
  // &size=Y
  // &sent=false

  getMessages(username: string, pageIndex: number, pageSize: number, sent: boolean): Observable<any> {

    let completeUrl = this.serverUrl +
      this.usersParameter +
      "/" + encodeURIComponent(username) +
      this.messagesParameter +
      "?page=" + pageIndex.toString() +
      "&size=" + pageSize.toString() +
      "&sent=" + sent.toString()

    return this.httpClient.get<any>(completeUrl)

  }

  // ---------------------------------------- DELETE MESSAGE -------------------------------------------------------- //

  // DELETE
  // http://localhost:8081
  // /users
  // /{username}
  // /messages
  // /{messageID}


  deleteMessage(username: string, messageID: number): Observable<any> {

    let completeUrl = this.serverUrl +
      this.usersParameter +
      "/" + encodeURIComponent(username) +
      this.messagesParameter +
      "/" + messageID.toString()

    return this.httpClient.delete(completeUrl)
  }

  // ---------------------------------------- READ MESSAGE ---------------------------------------------------------- //

  // # PUT
  // http://localhost:8081
  // /users
  // /{username}
  // /messages
  // /{messageID}

  readMessage(username: string, messageID: number): Observable<any> {

    let completeUrl = this.serverUrl +
      this.usersParameter +
      "/" + encodeURIComponent(username) +
      this.messagesParameter +
      "/" + messageID.toString()

    return this.httpClient.put<any>(completeUrl, {})
  }

  // ---------------------------------------- SEND MESSAGE ---------------------------------------------------------- //

  // # POST
  // http://localhost:8081
  // /users
  // /{username}
  // /messages

  sendMessage(username: string, customMessage: CustomMessage): Observable<any> {

    let completeUrl = this.serverUrl +
      this.usersParameter +
      "/" + encodeURIComponent(username) +
      this.messagesParameter

    return this.httpClient.post(completeUrl, customMessage)
  }

  // ---------------------------------- GET AUCTION BIDS ------------------------------------------------------------ //

  // # GET
  // http://localhost:8081
  // /auctions
  // /{auctionID}
  // /bid
  // ?page=X
  // &size=Y

  getAuctionBids(auctionID: number, pageIndex: number, pageSize: number): Observable<any> {

    let completeUrl = this.serverUrl +
      this.auctionsParameter +
      "/" + auctionID.toString() +
      this.bidParameter +
      "?page=" + pageIndex.toString() +
      "&size=" + pageSize.toString()

    return this.httpClient.get<any>(completeUrl)
  }

  // ---------------------------------- GET RECOMMENDATIONS --------------------------------------------------------- //

  // # GET
  // http://localhost:8081
  // /recommend

  getRecommendations(): Observable<any> {

    let completeUrl = this.serverUrl + this.recommendationsParameter


    return this.httpClient.get<any>(completeUrl)

  }

  // ---------------------------------- EXPORT AUCTIONS ------------------------------------------------------------- //

  // # GET
  // http://localhost:8081
  // /administration
  // /auctions
  // /export
  // ?json= true | false
  // &from=X
  // &to=Y

  exportAuctions(inJSONformat: boolean, startDate: string, endDate: string): Observable<any> {

    let completeUrl = this.serverUrl +
      this.adminParameter +
      this.auctionsParameter +
      this.exportParameter +
      "?json=" + inJSONformat.toString() +
      "&from=" + startDate +
      "&to=" + endDate

    let headers
    if (inJSONformat)
      headers = new HttpHeaders({'Content-Type': 'text/json'})
    else
      headers = new HttpHeaders({'Content-Type': 'text/xml'})

    return this.httpClient.get(completeUrl, {headers, responseType: 'text'})

  }


  // ---------------------------------- GET IMAGE --------------------------------------------------------------------//

  // # GET
  // http://localhost:8081
  // /media
  // /{auctionID}
  // /{fileName}

  getImage(auctionID: number, fileName: string): Observable<any> {

    let completeUrl = this.serverUrl +
      this.mediaParameter +
      "/" + auctionID.toString() +
      "/" + fileName


    return this.httpClient.get<any>(completeUrl)

  }

}
