
// Locla Storage
const StorageControler = (function () {

  //public
  return {
  // set local storage
localSet: (item) => {
     let element;

     if (localStorage.getItem('element') === null) {
       element = [];

       element.push(item);

       localStorage.setItem('element', JSON.stringify(element));
     }else {
       element = JSON.parse(localStorage.getItem('element'));

       element.push(item);

       localStorage.setItem('element', JSON.stringify(element));
     }
    
   },
// get local storage function
getStorage: () => {
     let item;

      if (localStorage.getItem('element') === null) {
        item = [];
      }else {
        item = JSON.parse(localStorage.getItem('element'));
      }
      return item;
     },
// delete item from locla storage
deleteIte: (id) => {
     
    items = JSON.parse(localStorage.getItem('element'));
      
   const index = items.findIndex(el => {
           if (id === el.id) {
              return el;
           }
        }); 
    items.splice(index, 1)
    localStorage.setItem('element', JSON.stringify(items));    
        }
     }
})();

// Data controler
const DataControler = (function () {
//function constructor
  function ExpensesInc (type, id, description, value, updated_at) {
    this.type = type;
    this.id = id;
    this.description = description;
    this.value = value;
    this.updated_at = updated_at;
  }
// data structure (tye object got form input are stored in data.item array)
  data = {
    item: StorageControler.getStorage(),
    totalValueInc: 0,
    totalValueExp: 0,
    totalBudget: 0,
    precentage: 0,
    updated_at: moment().format('MMMM - Do, YYYY')
  };

// calculate precentage and set data structure proprety
  function calculatePrecentage () {
    const precent =Math.round((data.totalValueExp / data.totalValueInc) * 100);
    data.precentage = precent;
   };
// calculate total budget and set data structure propriety
   function calculateBudget () {
     const totalBug = data.totalValueInc - data.totalValueExp;
     data.totalBudget = totalBug;
   };
  
// public methodes (to be called from outside Data Controler module)
  return {
// update budget function (take care of the addition of all incomes and calls othe 2 functions above)
    updateBudget: () => {
      let sumInc = 0, 
          sumExp = 0;
        
      data.item.forEach(item => {
   
       if (item.type === 'exp') {
         sumExp +=  item.value
         precExp = (data.totalBudget / item.value) * 100;
       }else if (item.type === 'inc') {
         sumInc += item.value;
       };
   
       data.totalValueExp = sumExp;
       data.totalValueInc = sumInc;
       
       calculateBudget();
       calculatePrecentage();
      });   
    },
// add item to data just adds a new item once is create dto the data structure
  addItemToData: (type, descr, val) => {
    //create id and date using moment js and uuidv4 library
      let ID;
      ID = uuidv4();
      mome = moment().valueOf();
    // call the function constructor with the new created object
      const newItem = new ExpensesInc(type, ID, descr, val, mome);
      data.item.push(newItem);
      return newItem;
      },

 // return data function just renders availble the data in othes modules
returnData: () => {
      return data; 
    },
// delete data from ui takes in account the id from the click and compair it to the elemant id, then uses splice to delate the element in data.item array;
deleteItemFromData: (id) => {
    const indexS = data.item.findIndex((item, index) => {
       if (item.id === id) {
         return item.id
       }
     });
     data.item.splice(indexS, 1);
   },
  }
})();

//Ui controler
const UiControler = (function () {
// set the DOM selectors here
  Domselectors = {
    typeValue: '.add__type',
    descriptionValue : '.add__description',
    amountValue: '.add__value',
    btnAddItem: '.add__btn',
    expensesList: '.expenses__list',
    incomeList: '.income__list',
    totalPrecent: '.budget__expenses--percentage',
    budgetTotal: '.budget__value',
    expensesTotal: '.budget__expenses--value',
    incomeTotal: '.budget__income--value',
    container: '.container',
    item: '.item',
    option: '.add__type',
    updated: '.budget__updated--month'
  }
// public methodes
  return {
//get input function
getInput: () => {
      let type, description, value;

       type = document.querySelector(Domselectors.typeValue).value;
       description = document.querySelector(Domselectors.descriptionValue).value;
       value = parseFloat(document.querySelector(Domselectors.amountValue).value);

       return {
         type,
         description,
         value,
       }
    },
// add item to UI (called from app controler)
addItemToUi: (item, budget) => {
      
      let html, element, precentItem;

     if (item.type === 'exp') {
       //decide where to append the html
        element = Domselectors.expensesList;
        // calculate the precentage of each item expenses right here
        precentItem = Math.round((item.value / budget) * 100);
        

       html = `
          <div class="item clearfix" id="expense-${item.id}">
            <div class="item__description">${item.description}</div>
              <div class="right clearfix">
                <div class="item__value">- ${UiControler.formatNumber(item.value)}</div>
                  <div class="item__percentage">${precentItem} %</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
              </div>
            </div>
          </div>
       `;
     }else if (item.type === 'inc') {
      element = Domselectors.incomeList;
       html = `
       <div class="item clearfix" id="income-${item.id}">
         <div class="item__description">${item.description}</div>
           <div class="right clearfix">
             <div class="item__value">+ ${UiControler.formatNumber(item.value)}</div>
                 <div class="item__delete">
                     <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
           </div>
         </div>
       </div>
    `;
     }

     document.querySelector(element).innerHTML += html;
// update the updated_at proriety in data structure;
      const now = moment().valueOf();
      item.updated_at = now;

    },
// display updated precent
updatePrecent: (data) => {
      document.querySelector(Domselectors.totalPrecent).textContent = `${data.precentage} %`;
    },

// clean inputs once the values were entred and sent
cleanInputs: () => {
      document.querySelector(Domselectors.descriptionValue).value = '';
      document.querySelector(Domselectors.amountValue).value = '';
      document.querySelector(Domselectors.descriptionValue).focus();
    },
// display total budget
displayTotalBudget: (data) => {
      document.querySelector(Domselectors.budgetTotal).textContent = 
      // pass the nuber trough format data function to output a nice formated number
      UiControler.formatNumber(data);
    },
// display total expenses
displayTotalExpenses: (data) => {
      document.querySelector(Domselectors.expensesTotal).textContent = UiControler.formatNumber(data);
    },
// display totalm incomes
displayTotalIncome: (data) => {
      document.querySelector(Domselectors.incomeTotal).textContent = UiControler.formatNumber(data);
    },
// format number function
formatNumber: (num) => {
        let int, dec;
        
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.')

        int = numSplit[0];
        if (int.length > 3) {
          int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        dec = numSplit[1];

        return int + '.' + dec;
      },
// delete item from UI uses atch the item to be deleted
deleteItemFromUi: (id) => {
    const allDiv = document.querySelectorAll(Domselectors.item);
    const list = Array.from(allDiv);
    
    list.forEach(el => {
        if (el.id === id) {
          el.remove()
        }
      });
    },
// change class UI just turn the borders of inputs fields in red once expenses were selected as type
changeClassUi: (type) => {

    let inputs = document.querySelectorAll(Domselectors.descriptionValue + ',' + Domselectors.amountValue + ',' + Domselectors.btnAddItem);

    inputs = Array.from(inputs);

    inputs.forEach(item => {
          if (type === 'exp' && item.classList.contains('add__description') || type === 'exp' && item.classList.contains('add__value')) {
            item.classList.add('red-focus');
          }else if (type === 'exp' && item.classList.contains('add__btn') ) {
            item.classList.add('red');
          }else {
            item.classList.remove('red', 'red-focus')
          }
          });
    },
// display date the budget app was lunched
displayDate: (dat) => {
  document.querySelector(Domselectors.updated).textContent = dat;
    },
// get DOM selectors renders availble the DOM selectors in app controler
getDomSelectors: () => {
      return Domselectors;
    }
  }
})();


//App Controler 
const AppControler = (function (DataCtr, StorageCtr, UICtr) {
// event handler container function - to be called from init function
  function eventHandler () {
    // render the selectors availble here
    const selector = UICtr.getDomSelectors();
    // add item button event listner function
    document.querySelector(selector.btnAddItem).addEventListener('click', addItemCtr);
    // add item enter key press event listner
    document.addEventListener('keypress', (e) => {

        if (e.keyCode === 13 || e.which === 13) {
          addItemCtr()
        }
    }); 
    // delete item event listener
    document.querySelector(selector.container).addEventListener('click', deleteItem);
    // change borders event listner
    document.querySelector(selector.option).addEventListener('change', changeBorder);

}

// add item controler function is the main function which handles the data structure and the UI once an item was added
  function addItemCtr () { 
      let input; 
      let data = DataCtr.returnData();
    // get nput values
    input = UICtr.getInput();
   
    if (input.description !== '' && input.value !== '' && input.value > 0) {
      // add item to data structure
      const newItem = DataCtr.addItemToData(input.type, input.description, input.value);

      // update total e budget in Data structure
      DataCtr.updateBudget();

      // add item to ui 
      UICtr.addItemToUi(newItem, data.totalBudget);

      // update total precentage
      UICtr.updatePrecent(data);

      // clean inputs
      UICtr.cleanInputs();

      //display data
      displayData();

      //local Storage
      StorageCtr.localSet(newItem)
    }
 }
// display data function calls the UI display functions with data that they needed
 function displayData () {
      let dataRet = DataCtr.returnData();
      UICtr.displayTotalBudget(dataRet.totalBudget);
      UICtr.displayTotalIncome(dataRet.totalValueInc);
      UICtr.displayTotalExpenses(dataRet.totalValueExp);
      UICtr.displayDate(dataRet.updated_at);
  }
// delete item calls delete item from data structure and from UI functions to delete item from everywhere
function deleteItem (e) {
  let id, idNum1, idNum2, idNum3, idNum4, idNum5, idString;
  if (e.target.classList.contains('ion-ios-close-outline')) {
    // get the element id tag - something like this: income-5febb95b-00f2-478d-bc64-3d1577224ee6 and then split it and extract onlòy the id without item in front
   id = e.target.parentNode.parentNode.parentNode.parentNode.id;
  ids = id.split('-');
      idNum1 = ids[1];
      idNum2 = ids[2];
      idNum3 = ids[3];
      idNum4 = ids[4];
      idNum5 = ids[5];
  }
  idString = idNum1 + '-' + idNum2 + '-' + idNum3 + '-' + idNum4 + '-' + idNum5;

  DataCtr.deleteItemFromData(idString);
  UICtr.deleteItemFromUi(id);
  DataCtr.updateBudget();
  StorageCtr.deleteIte(idString);
  displayData();
}
// change border function calls lass function in UI wuith the event target value
function changeBorder (e) {
  UICtr.changeClassUi(e.target.value)
}
// public methods
  return {
//init function. this starts the application at the first lunch
init: () => {
      dataStr = DataCtr.returnData();
     // loop trough the data.item arrat once the locat storage has returned and then render data to UI
      dataStr.item.forEach(item => {
        //update budget
        DataCtr.updateBudget();

      // add item to ui 
      UICtr.addItemToUi(item, dataStr.totalBudget);

      // update total precentage
      UICtr.updatePrecent(dataStr);

      //display data
      displayData();
      })
   eventHandler();
      // display data with 0 value everywhere once the application has started
    displayData({
        totalBudget: 0,
        totalValueInc: 0,
        totalValueExp: 0
       });
    }  
  }  

})(DataControler, StorageControler, UiControler);
// call init function, the only call from outside the modules necesary 
AppControler.init();
