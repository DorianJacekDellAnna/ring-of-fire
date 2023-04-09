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
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  game: Game = new Game();
  currentCard: string = '';
  games$: Observable<any>;
  firestore: Firestore = inject(Firestore);
  gameId: string = '';
  gamesCollection = collection(this.firestore, 'games');

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    const itemCollection = collection(this.firestore, 'games');
    this.games$ = collectionData(itemCollection);
  }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      console.log(params);

      this.games$.subscribe((game) => {
        console.log('Game update:', game);
        this.getGameData(params);
      });
    });
  }

  newGame() {
    this.game = new Game();

    /* const coll = collection(this.firestore, 'games');
    setDoc(doc(coll), this.game.toJson());*/
  }

  async getGameData(params: any) {
    this.gameId = params['id'];
    let docRef = doc(this.gamesCollection, this.gameId);
    let game$ = docData(docRef);
    game$.subscribe((game: any) => {
      console.log(game);
      this.game.currentPlayer = game.currentPlayer;
      this.game.playedCards = game.playedCards;
      this.game.players = game.players;
      this.game.stack = game.stack;
    });
  }

  takeCard() {
    this.currentCard = this.game.stack.pop();
    this.pickCardAnimation = true;
    this.game.currentPlayer++;
    this.game.currentPlayer =
      this.game.currentPlayer % this.game.players.length;

    setTimeout(() => {
      this.game.playedCards.push(this.currentCard);
      this.pickCardAnimation = false;
    }, 1000);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }
}
