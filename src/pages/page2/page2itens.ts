import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { Page2ItensAdd } from './page2itensadd';

@Component({
  templateUrl: 'page2itens.html'

})
export class Page2itens {

    idCompras : number;
    TotalItens: number;

    items: Array<{idItensCompras:number, idCompras: number, Descricao: string, Qty: number, valor: number, subTotal: number}>;

    constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite) {
         this.idCompras = navParams.get('idCompras');
    }
    
    getMoeda(price: number) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
    }
    
    addReg() {
        // Abrir Form Nova item  
        this.navCtrl.push(Page2ItensAdd, {idCompras: this.idCompras});
    }

    editReg(item){
       this.navCtrl.push(Page2ItensAdd, {item: item});
    }
    
    deleta(idItensCompras){
      // Deleta Registro no banco de dados
      this.sqlite.create({
        name: 'dbMercadoIonic2.db',
        location: 'default'
      }).then((db: SQLiteObject) => {

        //execute Sql Delete
        db.executeSql('Delete from ItensCompras where idItensCompras = ?', [idItensCompras])
        .then((data) =>{
          console.log('Delete item -> OK');
          this.findDados(this.idCompras);
        })
        .catch(e => console.log(e));
      
      // Fim SQLiteObject  
      }).catch(e => console.log(e));
   }

   ionViewWillEnter(){
        this.findDados(this.idCompras);
   }

   findDados(param){
    // Consultar dados no banco de dados
    this.items = [];
    this.sqlite.create({
      name: 'dbMercadoIonic2.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      
      // Criar as Tabelas da tela     
      db.executeSql('CREATE TABLE IF NOT EXISTS ItensCompras(idItensCompras INTEGER PRIMARY KEY AUTOINCREMENT, idCompras INTEGER, Descricao TEXT, Qty TEXT, valor REAL, subTotal REAL)', {})
      .then(() => console.log('Executed SQL ItensCompras'))
      .catch(e => console.log(e));
      
      //Consultar dados
      db.executeSql('SELECT idItensCompras,idCompras,Descricao,Qty,valor,subTotal FROM ItensCompras WHERE idCompras = ? order by Descricao,subTotal',[param])
      .then((data) =>{
        for(let i=0;i < data.rows.length;i++){
          this.items.push(data.rows.item(i));
        }        
      })
      .catch(e => console.log(e));
      //Consultar soma de valor
      db.executeSql('SELECT sum(subTotal) Total FROM ItensCompras WHERE idCompras = ? ',[param])
      .then((data) =>{        
           this.TotalItens = data.rows.item(0).Total;
           //UPDATE na tabela Compras com o valor Total
           db.executeSql('UPDATE Compras SET Total=? WHERE idCompras = ? ',[this.TotalItens, param])
           .then((data) =>{        
              //Atualizado...            
           })
           .catch(e => console.log(e));            
      })
      .catch(e => console.log(e));
    
    // Fim SQLiteObject  
    }).catch(e => console.log(e));
  }
}