// local storage and session storage

// they are property on 'window' interface that allows us to access storage object
// data is stored in browswer
// data is stored in kv pairs adn values are strings(cannot store objects)
// thus we have to stringify the json data

// local storage and session storage has same api,only difference is that
// local storage won't expire and seesion storage will last till the page in not closed

// set a value with key :- localStorage.setItem('name', 'subodh');
// get the value like hashmap:- localStorage.getItem('name')
// remove item using key same like hashmap :=  localStorage.removeItem('name');
// to remove all entries from localStorage :- localStorage.clear();

// part 1 adding items in list when add item is pressed
// adding items in list

const inputText = document.querySelector('#item-input');
// inputText.addEventListener('input', onAddItem);
const list = document.querySelector('#item-list');
// on basis of tags extraction
const btn = document.querySelector('button');
btn.addEventListener('click', onClick);

let update = false, initialTextValue = '';

// document.body.addEventListener('click', setToDefault);
// function setToDefault() {
//     console.log('this is to set the values to default');
//     list.querySelectorAll('li').forEach(ele => ele.style.color = 'black');
//     btn.textContent = 'Clear All';
//     inputText.value = '';
//     btn.style.backgroundColor = 'black';

// }

function onClick(e) {
  e.preventDefault();
  const text = inputText.value;
  if (text === '') {
    alert('please enter name of item');
    return;
  }
    if (ifItemExists(text)) {
        alert('already exist');
        inputText.value = '';
        return;  
    } 
    // if we are in update mode we will first get the current
    // value and keep on track of new value updated as soon as this button event
    // is raise we chagne the value in our list items
    if (update) {
        
        const previousValue = initialTextValue, newvalue = text;
        list.querySelectorAll('li').forEach(ele => {
            ele.style.color = 'black';
            if (ele.textContent == previousValue) {
                ele.remove();
                removeItemFromLocalStorage(previousValue);
            }
            
        });
        update = false;
    }

    btn.textContent = 'Clear All';
    btn.style.backgroundColor = 'black';
    // now we got the value form text field 
    // its time to add this value in our list
    addItemDOM(text);
    // after addding it to dom also add it to local storage
    addItemToLocalStorage(text);

    inputText.value = '';
    filterSearch();
    e.stopPropagation();
}
 
function ifItemExists(item) {
    const items = JSON.parse(localStorage.getItem('items'));    
    // doing for loop on below array will read each character as separate string
    // because the below commands return the result as string
    // but our actual result is array thus we use JSON parse to avoid character by character
    // reading
    const def = (localStorage.getItem('items'));
    // this is long way
    // const res = false;
    // for (const ele of items) {
    //     if (ele === item) return true;
    // }
    // return false;

    // another short way of doing this is
    // using includes methods of array
    
    return items.includes(item);
    
}

function addItemDOM(item) {
  const li = document.createElement('li');
  li.textContent = item;
  const btn = createButton('remove-item btn-link text-red' , 'fa-solid fa-xmark');
  li.appendChild(btn);
  list.appendChild(li);
}


function createButton(className , childClass) {
  const btn = document.createElement('button');
  btn.className = className;
  const i = document.createElement('i');
  i.className = childClass;
  btn.appendChild(i);
  return btn;
}

// part 2 removing element form list
// for removing element from list we use event delegation where we
// add event listener on item list
list.addEventListener('click', removeEle);

function removeEle(e) {
  // we will use here target because current target will give us on which element
  // the event listener was added and target will give us which element was pressed
  // console.dir(e.target);
  const val = e.target;
    if (val.tagName === 'LI' ) {
    //   here we will the code for updating the clicked item
        console.dir(val);
        const textval = val.textContent;
        if (textval === '') return;     
        inputText.value = textval;
        console.log(inputText.value);
        btn.textContent = 'update';
        list.querySelectorAll('li')
            .forEach(ele => ele.style.color = 'black');
        e.target.style.color = '#ccc';
        btn.style.backgroundColor = '#00A300';
        update = true;
        initialTextValue = inputText.value;
  }
  // this wont work as this will remove only the 'I' icon 
  // e.target.remove();
  // this also wont work as this will remove parent element of icon which is button
  // but the text still remains
  // e.target.parentElement.remove();
  // this is more clumsy way there must be some shorter way of doing this
   else if ( val.tagName === 'I' && confirm('are you sure')) {
        e.target.parentElement.parentElement.remove();
        removeItemFromLocalStorage(val.parentElement.parentElement.textContent); 
        btn.textContent = 'Add Item';
        btn.style.backgroundColor = 'black';
        
   }
  
    filterSearch();
    e.stopPropagation();
}

// for remvoing all items from list by clicking clear all button
const clearall = document.querySelector('#clear');
clearall !== null && clearall.addEventListener('click', removeAll);

function removeAll(e) {
  // there can be more than one way of doing this
  // list.innerHTML = '';

  // we can also remove them one by one
  // check if we have firstChild and until and unless our firstChild is not 
  // empty till then keep on removing them
    while (list.firstChild) list.firstChild.remove();
    localStorage.clear();
  filterSearch();
  e.stopPropagation();

}

// part 3 clear all hide display when no list items present
// to hide the filter and clear all button
// for this we can use pageloading 
// while loading if the page has list items then we will show the filter items search
// and clear all button else we hide them 
// const filterDiv = document.querySelector('.filter');
// document.body.addEventListener('input',filterSearch);

function filterSearch() {
  // here we need to extract the list items once again 
  // vecause its defined in global scope thus when its defined once the values
  // wont change thus we need to extract here once more
  // const newlist = document.querySelector('#item-list');
  const lielements = list.querySelectorAll('li');
  const filterItems = document.querySelector('.filter');
  // rather than setting innerHTML we can set styling because
  // when we say innerHTML = '' we need to add buttons and filter search
  // when the list items are present but in case of sytling all we need to do is change
  // some styling


  if (lielements.length === 0) {
    filterItems.hidden = true;
    clearall.hidden = true;
  }
  else {
    filterItems.hidden = false;
    clearall.hidden = false;
    // dont do anything
  }
   
}



// part 4 filter items
// filtering the items
// for filtering we need to keep the track of each key press we can do that
// using input and keyevent listener
// and this listener should be on filter input and it should modify the
// list items
const filterDiv = document.querySelector('#filter');
// we can also use input as event in place of keyup
filterDiv.addEventListener('keyup', filterInput);
function filterInput(e) {
  // this is triggered
  const listItems = list.querySelectorAll('li');
  const valueInserted = e.target.value.toLowerCase();
  listItems.forEach(ele => {
    if (ele.textContent.toLowerCase().indexOf(valueInserted) != -1) ele.style.display = 'flex';
    else ele.style.display = 'none';  
  })
  e.stopPropagation();
}


function onStart() {
    // also we should all elements from our local storage to our list
    const items = JSON.parse(localStorage.getItem('items'));
    items!== null && items.forEach(ele => addItemDOM(ele));
    // this will execute as soon as the page loads but only one time
    filterSearch();
    
}
// instead of onstart function we can also have a domloadedevent on body
// which will trigger as soon as page loads
document.addEventListener('DOMContentLoaded', onStart);
// onStart();
// adding items in local Storage
// we will add item from our list one by one in our local storage
// thus we are passing the parameter item
function addItemToLocalStorage(item) {
    let currenStorage;
    // if local storage is empty then we can add kv pairs
    if (localStorage.getItem('items') === null) {
        currenStorage = [];
    }
    else {
        // as local storage stores objects in string format thus we parse it 
        currenStorage =  JSON.parse(localStorage.getItem('items'));
    }
    currenStorage.push(item);
    localStorage.setItem('items', JSON.stringify(currenStorage));
}

// we will also need to remove items from local storage when we delete items
// from our list
function removeItemFromLocalStorage(item) {
    // we can't directly remove it because its stored in form of string
    // and all our values are mapped only to key 'items'
    // so first we get the local storage content and then parse it into strng
    // find the required element and then remove it and finally update our
    // local storage

    currentState = JSON.parse(localStorage.getItem('items'));
    
    currentState = currentState.filter(ele => {
        return ele !== item 
    })

    // finally update our local storage
    localStorage.setItem('items', JSON.stringify(currentState));

    
}