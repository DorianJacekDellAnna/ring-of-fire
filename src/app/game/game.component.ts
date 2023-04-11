import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { inject } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  setDoc,
  doc,
  docData,
  addDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  game: Game = new Game();
  games$: Observable<any>;
  firestore: Firestore = inject(Firestore);
  gameId: string = '';
  gamesCollection = collection(this.firestore, 'games');
  docRef: any;

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    const itemCollection = collection(this.firestore, 'games');
    this.games$ = collectionData(itemCollection);
  }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      console.log(params);
      this.getGameData(params);
    });
  }

  newGame() {
    this.game = new Game();

    /* const coll = collection(this.firestore, 'games');
    setDoc(doc(coll), this.game.toJson());*/
  }

  async getGameData(params: any) {
    this.gameId = params['id'];
    this.docRef = doc(this.gamesCollection, this.gameId);
    let game$ = docData(this.docRef);
    game$.subscribe((game: any) => {
      console.log(game);
      this.game.currentPlayer = game.currentPlayer;
      this.game.playedCards = game.playedCards;
      this.game.players = game.players;
      this.game.stack = game.stack;
      this.game.pickCardAnimation = game.pickCardAnimation;
      this.game.currentCard = game.currentCard;
    });
  }

  takeCard() {
    this.game.currentCard = this.game.stack.pop();
    this.game.pickCardAnimation = true;

    this.game.currentPlayer++;
    this.game.currentPlayer =
      this.game.currentPlayer % this.game.players.length;
    this.saveGame();

    setTimeout(() => {
      this.game.playedCards.push(this.game.currentCard);
      this.game.pickCardAnimation = false;
      this.saveGame();
    }, 1000);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }

  saveGame() {
    updateDoc(this.docRef, this.game.toJson());
  }
}
