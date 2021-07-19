import { Component, OnInit  } from '@angular/core';
import { isNumber } from 'util';
import { UserService } from '../providers/rest/rest.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage implements OnInit {
  value = '0';
  oldValue = '0';
    
  lastOperator = 'x';
  readyForNewInput = true;
  
  numberGroups = [
    [7, 8, 9, 'x'],
    [4, 5, 6, '-'],
    [1, 2, 3, '+'],
    [0, 'c', '/', '='],
    ['ANTWORT', 'ANSWER', 'RISPOSTA', 'RESPUESTA']
  ];
  
  previousUsers: any;
  userListLabel: string;

  constructor(private restService: UserService) {
      this.previousUsers = {};
      this.userListLabel = "";
  }

  ngOnInit() {
      // Get the data for the previous users list ...
      this.getPreviousUsers(true);
  }

  onButtonPress(symbol) {
    console.log(symbol);

    if (isNumber(symbol)) {

      console.log('is a number');

      if (this.readyForNewInput)
        this.value = '' + symbol;
      else
        this.value += '' + symbol;
      this.readyForNewInput = false;
    }
    else if (symbol === 'c') {
      this.value = '0';
      this.readyForNewInput = true;
    }
	else if (symbol === 'ANTWORT'
	         || symbol === 'ANSWER'
			 || symbol === 'RESPUESTA') {
      this.value = '42';
      this.readyForNewInput = false;
    }
	else if (symbol === 'RISPOSTA') {
      this.value = 'O sole mio :))))';
      this.readyForNewInput = false;
    }
    else if (symbol === '=') {
	  if (this.value === 'O sole mio :))))')
		  this.value = '42';
      if (this.lastOperator === 'x')
        this.value = '' + (parseInt(this.oldValue) * parseInt(this.value));
      else if (this.lastOperator === '-')
        this.value = '' + (parseInt(this.oldValue) - parseInt(this.value));
      else if (this.lastOperator === '+')
        this.value = '' + (parseInt(this.oldValue) + parseInt(this.value));
      else if (this.lastOperator === '/')
        this.value = '' + (parseInt(this.oldValue) / parseInt(this.value));
      this.readyForNewInput = true;
    }
    else { // operator
      this.readyForNewInput = true;
      this.oldValue = this.value;
      this.lastOperator = symbol;
    }
  }

  savePreviousUsersInLocalData(previousUsers: any): void {
      this.restService.saveToLocalData(this.previousUsers);
  }

  getPreviousUsers(forceUpdate: boolean) {

      // local storage trigger
      this.savePreviousUsersInLocalData(this.previousUsers);

      // response comes from service or in error cases from storage 
      this.previousUsers = this.restService.getUsers(forceUpdate, 'Homepage');

      if (this.previousUsers && Object.keys(this.previousUsers).length != 0)
          this.userListLabel = "See who has been here before ...";
      else {
          this.userListLabel = "Welcome! You are the first user today";
      }
    }

}
