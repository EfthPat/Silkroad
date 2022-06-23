import * as L from "leaflet";
import 'leaflet/dist/leaflet.css';
import {Marker} from "leaflet";
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MapService} from "../../services/map.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  // an object that emits a new address every time the user clicks on a new map position
  @Output() mapAddress

  // (latitude, longitude) are updated every time a valid address is inserted in the Geo-Location bar.
  @Input() latitude: number
  @Input() longitude: number

  // initialized by parent component
  @Input() isInteractive: boolean

  // Map - Marker characteristics
  map: any
  tile: string
  zoom: number
  marker: any

  constructor(private mapService: MapService) {

    this.mapAddress = new EventEmitter<any>()

    this.latitude = 37.9838
    this.longitude = 23.7275

    this.isInteractive = false


    this.tile = "http://tile.openstreetmap.org/{z}/{x}/{y}.png"
    this.zoom = 14
    this.marker = new Marker([this.latitude, this.longitude])

  }

  ngOnInit(): void {

    // create a Map instance and initialize it
    this.map = L.map('map').setView([this.latitude, this.longitude], this.zoom)

    // fill the map with a tile from OpenStreetMap
    L.tileLayer(this.tile).addTo(this.map)

    // add the marker into the map
    this.marker.addTo(this.map)


    // if the map is interactive, create a (click) event
    if (this.isInteractive) {
      // on Click :
      this.map.on('click', (event: any) => {
        // change marker's coordinates
        this.marker.setLatLng([event.latlng.lat, event.latlng.lng])
        // update latitude, longitude
        this.latitude = event.latlng.lat
        this.longitude = event.latlng.lng
        // update the current address and emit it
        this.updateAddress(event.latlng.lat, event.latlng.lng)

      })

    }

  }

  ngOnChanges(): void {

    this.marker.setLatLng([this.latitude, this.longitude])

    if (this.map !== undefined)
      this.map.setView([this.latitude, this.longitude])

  }

  // given a (LAT,LON) pair, update the address
  updateAddress(lat: number, lon: number): void {

    // send a reverse Geocoding request : (LAT,LON) -> address
    this.mapService.getReverseLocation(lat, lon).subscribe(
      // get server's response
      response => {
        // emit the new address to any interested parent component
        this.mapAddress.emit(response)

      }
    )
  }

}
