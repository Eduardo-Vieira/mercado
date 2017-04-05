import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Component({
  templateUrl: 'page2itensadd.html'

})

export class Page2ItensAdd {
  
  idCompras : number;
  
  idItensCompras : number;
  
  item = [];
  
  action = 'add';

  dados = {
    Descricao: '',
    Qty: '0',
    valor: '0'    
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite) {
      
      this.idCompras = navParams.get('idCompras');

      this.item.push(navParams.get('item'));

      if(this.item[0] != undefined){
        this.action = 'update';      
        this.idItensCompras = this.item[0].idItensCompras;
        this.dados.Descricao = this.item[0].Descricao;
        this.dados.Qty = this.item[0].Qty;
        this.dados.valor = this.item[0].valor;
      }
  }
  
  getMoeda(price: number) {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  }
  
  submitForm(form) {

    this.sqlite.create({
      name: 'dbMercadoIonic2.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
        if(this.action == 'add'){
          // INSERT INTO
          let sql = 'INSERT INTO ItensCompras(idCompras,Descricao,Qty,valor,subTotal) VALUES (?,?,?,?,?)';
          db.executeSql(sql,[this.idCompras, form.Descricao, form.Qty, form.valor, form.Qty * form.valor]).then((data) =>{
            console.log('INSERT-> OK: ',data);
            this.navCtrl.pop();
          }).catch(e => console.log(e));
        }
        if(this.action == 'update'){
          // UPDATE
          let sql = 'UPDATE ItensCompras SET Descricao=?, Qty=?, valor=?, subTotal=? WHERE idItensCompras = ?';
          db.executeSql(sql,[form.Descricao, form.Qty, form.valor, form.Qty * form.valor, this.idItensCompras]).then((data) =>{
            console.log('UPDATE-> OK: ',data);
            this.navCtrl.pop();
          }).catch(e => console.log(e));
        }

    }).catch(e => console.log(e));  
  }
}