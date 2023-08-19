import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ChainListTableComponent } from './components/chain-list-table/chain-list-table.component';
import { TableModule } from 'primeng/table';
import { ListboxModule } from 'primeng/listbox';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent, ChainListTableComponent],
  imports: [
    BrowserModule,
    ButtonModule,
    DropdownModule,
    HttpClientModule,
    TableModule,
    ListboxModule,
    InputTextModule,
    ReactiveFormsModule,
    ToastModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
