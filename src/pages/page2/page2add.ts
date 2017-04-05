import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Component({
  templateUrl: 'page2add.html'

})

export class Page2Add {
  
  idCompras : number;

  item = [];
  
  action = 'add';
  
  dados = {
    data: '',
    nota: '',
    total: '0'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite) {
    
    this.item.push(navParams.get('item'));
    
    if(this.item[0] != undefined){
      this.action = 'update';      
      this.idCompras = this.item[0].idCompras;
      this.dados.data = this.item[0].Data;
      this.dados.nota = this.item[0].Nota;
    }
    
  }  
  
  ionViewWillEnter(){

  }

  submitForm(form) {
    console.log(form.data);
    this.sqlite.create({
      name: 'dbMercadoIonic2.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      if(this.action == 'add'){
        // INSERT INTO
        let sql = 'INSERT INTO Compras(Data,Nota,Total) VALUES (?,?,?)';
        db.executeSql(sql,[form.data, form.nota, "0.00"]).then((data) =>{
          console.log('INSERT-> OK: ',data);
          this.navCtrl.pop();
        }).catch(e => console.log(e));
      }
      if(this.action == 'update'){
        // UPDATE
        let sql = 'UPDATE Compras SET Data=?, Nota=? WHERE idCompras = ?';
        db.executeSql(sql,[form.data, form.nota,this.idCompras]).then((data) =>{
          console.log('UPDATE-> OK: ',data);
          this.navCtrl.pop();
        }).catch(e => console.log(e));
      }
      
    }).catch(e => console.log(e));  
  }
}