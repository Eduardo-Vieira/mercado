import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { SQLite } from '@ionic-native/sqlite';

import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { Page2Add } from '../pages/page2/page2add';
import { Page2itens } from '../pages/page2/page2itens';
import { Page2ItensAdd } from '../pages/page2/page2itensadd';

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    Page2Add,
    Page2itens,
    Page2ItensAdd
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    Page2Add,
    Page2itens,
    Page2ItensAdd
  ],
  providers: [{provide:ErrorHandler, useClass: IonicErrorHandler}, SQLite]
})
export class AppModule {}
