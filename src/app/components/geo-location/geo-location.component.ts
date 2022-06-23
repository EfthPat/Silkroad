import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {MapService} from "../../services/map.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-geo-location',
  templateUrl: './geo-location.component.html',
  styleUrls: ['./geo-location.component.css']
})
export class GeoLocationComponent implements OnInit {

  // emit a new address every time the user types a new address
  @Output() geoAddress

  // emit geolocation's validation state
  @Output() geoState: EventEmitter<boolean>

  // the address-name emitted by the Map component every time the user clicks on a new position.
  // Then, it's passed to the parent component and then to this component
  @Input() addressName: string

  suggestedLocations: any[]
  suggestedAddresses: string[]
  locationField: FormControl

  constructor(private mapService: MapService) {

    this.geoAddress = new EventEmitter<any>()
    this.geoState = new EventEmitter<boolean>()

    this.addressName = ""
    this.suggestedLocations = []
    this.suggestedAddresses = []
    this.locationField = new FormControl('')

  }

  ngOnInit(): void {
    // an empty bar is invalid
    this.locationField.setErrors({'invalidValue': true})
    this.geoState.emit(false)
  }

  // when an address is received
  ngOnChanges(): void {

    this.locationField.setValue(this.addressName)
    this.locationField.markAsPristine()
    this.locationField.setErrors(null)
    this.geoState.emit(true)
    this.suggestedLocations = []
    this.suggestedAddresses = []

  }

  // Find autocomplete's suggestions
  getSuggestedLocations(event: any): void {

    // ignore any input that wasn't a number, a letter or (delete) button
    let invalidInput: boolean = !(event.keyCode >= 48 && event.keyCode <= 57)
      && !(event.keyCode >= 65 && event.keyCode <= 90)
      && !(event.keyCode == 8)

    if (invalidInput)
      return

    // if the input was a number, a letter or (delete) button, then the location should be reexamined
    this.locationField.setErrors({'incorrect': true})
    this.geoState.emit(false)


    // get user's input and trim whitespaces
    let location: string = this.locationField.value.trim()

    if (location.length < 1)
      return

    // send a request to get the suggested locations, given user's input so far
    this.mapService.getForwardLocation(location, 5).subscribe(
      // get the HTTP response from the server
      response => {

        // clear the suggested-location objects and autocomplete's dropdown
        this.suggestedLocations = []
        this.suggestedAddresses = []

        // make an array to save location names to avoid duplicates
        let existingNames: any = []

        // for each suggested location that was found
        for (let currentLocation of response) {

          // if the said road is defined AND is not included already in autocomplete's dropdown
          if(currentLocation.address.road && !(existingNames.indexOf(currentLocation.address.road)>-1))
          {
            // otherwise, store the suggested location
            this.suggestedLocations.push(currentLocation)
            // store location's road
            this.suggestedAddresses.push(currentLocation.address.road)
            existingNames.push(currentLocation.address.road)
          }
          // otherwise, attempt to save location's name
          else if(currentLocation.address.name && !(existingNames.indexOf(currentLocation.address.name)>-1))
          {
            // otherwise, store the suggested location
            this.suggestedLocations.push(currentLocation)
            // store location's road
            this.suggestedAddresses.push(currentLocation.address.name)
            existingNames.push(currentLocation.address.name)
          }


        }

      }
      ,
      // error
      error => {
        console.log("GETTING SUGGESTED LOCATIONS FAILED :", error)
      }
    )
  }

  // update the Map
  updateMap(index: number): void {


    // if the user clicked on one of the dropdown-menu options
    if (index > -1) {
      console.log("(CLICK) #" + index)
      this.locationField.setValue(this.suggestedAddresses[index])
      this.locationField.setErrors(null)
      this.geoAddress.emit(this.suggestedLocations[index])
      this.geoState.emit(true)
      return
    }

    // otherwise, check if user inserted a dropdown-menu option through (Enter)
    let location: string = this.locationField.value

    // if so, emit the user-selected location
    for (let i = 0; i < this.suggestedAddresses.length; i++)
      if (this.suggestedAddresses[i] === location) {
        console.log("(ENTER) #" + i)
        this.locationField.setErrors(null)
        this.geoAddress.emit(this.suggestedLocations[i])
        this.geoState.emit(true)
        return
      }

    // if user's address doesn't match any dropdown option..

    // then, if the address was inserted by clicking on the map
    if (this.locationField.pristine && this.locationField.value !== "") {
      // no need for request, because map sent the address name through the map-service
      console.log("NO REQUEST NEEDED - MAP UPDATED ADDRESS BAR")
      this.locationField.setErrors(null)
      this.geoState.emit(true)
    }
    // if the user inserted a custom address
    else {
      console.log("REQUESTING CUSTOM ADDRESS")
      // send an HTTP request to the server to get a single suggested-location
      this.mapService.getForwardLocation(location).subscribe(
        response => {
          if (response.data.length == 0) {
            console.error("ERROR #1 : CUSTOM ADDRESS NOT FOUND")
            this.locationField.setErrors({'incorrect': true})
            this.geoState.emit(false)
            return
          }

          // get the single response object from the server
          let customLocation = response.data[0]

          console.log("FOUND CUSTOM ADDRESS :", customLocation)

          // store the custom location's name
          this.locationField.setValue(customLocation.label)

          // emit custom Location
          this.geoAddress.emit(customLocation)

          this.locationField.setErrors(null)
          this.geoState.emit(true)
        }
        ,
        // otherwise, if the custom address doesn't exist, mark the input as invalid
        () => {
          console.error("#2 ERR : CUSTOM ADDR NOT FOUND")
          this.locationField.setErrors({'incorrect': true})
          this.geoState.emit(false)
        }
      )


    }


  }

}
