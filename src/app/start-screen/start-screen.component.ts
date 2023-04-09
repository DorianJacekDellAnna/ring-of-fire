import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore/';
import { Game } from 'src/models/game';
import { inject } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  setDoc,
  doc,
  docData,
} from '@angular/fire/firestore';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss'],
})
export class StartScreenComponent implements OnInit {
  game = new Game();
  firestore: Firestore = inject(Firestore);
  constructor(
    private AngularFirestoreModule: AngularFirestoreModule,
    private router: Router
  ) {}

  ngOnInit(): void {}

  newGame() {
    //start game

    const coll = collection(this.firestore, 'games');
    setDoc(doc(coll), this.game.toJson()).then((gameInfo: any) => {
      //this.router.navigateByUrl('/game');
      console.log(gameInfo);
      
    });
  }
}
