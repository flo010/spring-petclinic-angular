/*
 *
 *  * Copyright 2016-2017 the original author or authors.
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *      http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

/**
 * @author Vitaliy Fedoriv
 */

import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { PetService } from "../pet.service";
import { Pet } from "../pet";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-pet-list-global",
  templateUrl: "./pet-list-global.component.html",
  styleUrls: ["./pet-list-global.component.css"],
})
export class PetListGlobalComponent implements OnInit {
  errorMessage: string;
  name: string;
  pets: Pet[];
  listOfPetsWithName: Pet[];
  isPetsDataReceived: boolean = false;

  constructor(
    private router: Router,
    private petService: PetService,
  ) {}

  ngOnInit() {
    console.log("inside PetListGlobalComponent ngOnInit");
    this.petService
      .getPets()
      .pipe(
        finalize(() => {
          this.isPetsDataReceived = true;
        }),
      )
      .subscribe(
        (pets) => (this.pets = pets),
        (error) => (this.errorMessage = error as any),
      );
  }

  editPet(pet: Pet) {
    this.router.navigate(["/pets", pet.id, "edit"]);
  }

  searchByName(name: string) {
    console.log("inside search by last name starting with " + name);
    if (name === "") {
      this.petService.getPets().subscribe((pet) => {
        this.pets = pet;
      });
    }
    if (name !== "") {
      this.petService.searchPets(name).subscribe(
        (pets) => {
          this.pets = pets;
          console.log("this.pets " + this.pets);
        },
        (error) => {
          this.pets = null;
          console.log(error);
        },
      );
    }
  }
}
