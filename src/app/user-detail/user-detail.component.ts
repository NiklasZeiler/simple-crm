import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/models/user.class';
import { DialogEditAddressComponent } from '../dialog-edit-address/dialog-edit-address.component';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  userId = '';
  user: User = new User;

  constructor(private route: ActivatedRoute,
    private firestore: AngularFirestore,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {//mit subscribe wird etwas abonniert hier die route mit der id zu einem user
      this.userId = paramMap.get('id');
      console.log('GOT ID', this.userId);
      this.getUser();

    })
  }

  getUser() {
    this.firestore//greift auf die Datenbank zu
      .collection('users')//Greift auf die Sammlung in der Datenbank zu. Hier die SAmmlung 'users'
      .doc(this.userId)//Greift auf das Dokument in der Datenbank zu. Hier das Dokument mit einer bestimmten userId
      .valueChanges()// Wird ausgeführt soblad sich eine Variable ändert
      .subscribe((user: any) => {//Abonniert den User und speichert diesen
        this.user = new User(user);//Der User vor dem = ist die gespeicherte Variable und der user danach der Wert den wir uns aus der Datenbank holen.Dieser wird dann als neuer User gespeichert 

        console.log('Retrive User', user);

      })
  }

  editAddress() {
    const dialog = this.dialog.open(DialogEditAddressComponent);
    dialog.componentInstance.user = new User(this.user.toJSON());
    dialog.componentInstance.userId = this.userId;

  }

  editUserDetail() {
    const dialog = this.dialog.open(DialogEditUserComponent);
    dialog.componentInstance.user = new User(this.user.toJSON());// Hiermit wird eine Kopie des Objekts erstellt damit man diese erst ändern kann und sich die Daten nicht direkt ändern
    dialog.componentInstance.userId = this.userId;
  }

}
