import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { Page2Add } from './page2add';

import { Page2itens } from './page2itens';

@Component({
  selector: 'page-page2',
  templateUrl: 'page2.html'

})
export class Page2 {

  items: Array<{id:number, date: string, note: string, subTotal:number}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite) {}
    
  getMoeda(price: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  }

  ionViewWillEnter(){
    this.findDados();
  }
    
  itens(item){
    // Abrir Itens da Compra  
    this.navCtrl.push(Page2itens, {idCompras:item});
  }
  
  addReg() {
    // Abrir Form Nova Compra  
    this.navCtrl.push(Page2Add, {});
  }
 
  editar(item){
       this.navCtrl.push(Page2Add, {item: item});
  }
  
  deleta(idCompras){
    // Deleta Registro no banco de dados
    this.sqlite.create({
      name: 'dbMercadoIonic2.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
     
      //execute Sql Delete
      db.executeSql('Delete from Compras where idCompras = ?', [idCompras])
      .then((data) =>{
            console.log('Delete Compras -> OK');
            this.findDados();
      })
      .catch(e => console.log(e));

      //execute Sql Delete filhos
      db.executeSql('Delete from ItensCompras where idCompras = ?', [idCompras])
      .then((data) =>{
         console.log('Delete Filhos de Compras -> OK');
      })
      .catch(e => console.log(e));
    
    // Fim SQLiteObject  
    }).catch(e => console.log(e));
  }

  findDados(){
    // Consultar dados no banco de dados
    this.items = [];
    this.sqlite.create({
      name: 'dbMercadoIonic2.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      
      // Criar as Tabelas da tela
      db.executeSql('CREATE TABLE IF NOT EXISTS Compras(idCompras INTEGER PRIMARY KEY AUTOINCREMENT, Nota TEXT, Data DATE, Total REAL)', {})
      .then(() => console.log('Executed SQL Compras'))
      .catch(e => console.log(e));      
      
      //Consultar dados
      db.executeSql('SELECT idCompras,Data,Nota,Total FROM Compras', {})
      .then((data) =>{
        for(let i=0;i < data.rows.length;i++){
          this.items.push(data.rows.item(i));
        }        
      })
      .catch(e => console.log(e));
    
    // Fim SQLiteObject  
    }).catch(e => console.log(e));
  }

// fim class
}
