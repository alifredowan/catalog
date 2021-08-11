//all function
//selector
const allSelector = () => {
    searchInput = document.querySelector("#filter");
    msg = document.querySelector(".msg");
    nameInput = document.querySelector(".productName");
    priceInput = document.querySelector(".productPrice");
    ProductBtn = document.querySelector(".ProductBtn");
    deleteBtn = document.querySelector(".deleteBtn");
    form = document.querySelector('form');
    productListUl = document.getElementById("list_product");
};
let productData = getDataFromLocalStorage();

//gerLocalStorage
function getDataFromLocalStorage(){
    let storageItem = '';
    if(localStorage.getItem("productItem")  === null){
        storageItem = [];
    }else{
        storageItem = JSON.parse(localStorage.getItem("productItem"));
    }
    return storageItem;
 };

 //setLocalStorage
const saveDataFromLocalStorage = (item) => {
    let storageItem = '';
    if(localStorage.getItem("productItem")  === null){
        storageItem = [];
        storageItem.push(item);
        localStorage.setItem("productItem",  JSON.stringify(storageItem));
    }else{
        storageItem = JSON.parse(localStorage.getItem("productItem"));
        storageItem.push(item);
        localStorage.setItem("productItem",  JSON.stringify(storageItem));
    }
 }

 //deleteDataFromLocalStorage
const  deleteDataFromLocalStorage = (id) => {
    const storageItem = JSON.parse(localStorage.getItem('productItem'));
    let result = storageItem.filter(localData => {
               return localData.id  !== id; 
           });
           localStorage.setItem("productItem", JSON.stringify(result));
            if (result.length === 0) {location.reload()};
 };

//allEventListener
const loadEventListener = () => {
    ProductBtn.addEventListener("click",submitBtn);
    productListUl.addEventListener("click", deleteOrUpdateItem);
    searchInput.addEventListener("keyup",searchItem) ;
    window.addEventListener("DOMContentLoaded", getData.bind(null, productData));
 };

 //add item
const getData = (productList) => {
    productListUl.innerHTML = '';
    if(productData.length > 0){
        //msg.innerHTML = "";
        showMessage();
        productList.forEach(product => {
            const {id,name,price} = product;
            li = document.createElement("li");
            li.className = "list-group-item collection-item";
            li.id = `product-${id}`;
            li.innerHTML =`<strong>${name}</strong>
            <span class="price">${price}</span>
            <i class="fas fa-trash-alt float-right deleteBtn"></i>
            <i class="fas fa-user-edit float-right editBtn"></i>`
            productListUl.appendChild(li);
        })
    }else{
     showMessage("PLEASE ADD PRODUCT");
 }};

 //show message
const showMessage = (message = '') => {
    msg.innerHTML = message;
 };
//find update item
function findingItem(id){
    return productData.find(product => product.id === id);                        
  }
  const populateForm = (productData) => {
     nameInput.value = productData.name;
     priceInput.value = productData.price;
  }  
  const updateItem = (evt, id) => {
         evt.preventDefault();
         const productItemName = nameInput.value;
         const productItemPrice = priceInput.value;
        const afterUpdateData = productData.map(product => {
             if(product.id === id){
                 return {
                     ...product,
                     name: productItemName,
                     price: productItemPrice
                 }
             }else{
                 return product
             }
         })
         //update from data store
         productData = afterUpdateData;
         //update from UI
         productListUl.innerHTML = ' ';
         getData(productData);
         //update from localStore 
         localStorage.setItem('productItem', JSON.stringify(productData));
  }
  const initialSubmitBtn = () => {
     document.querySelector('.updateBtn').remove();
     nameInput.value = '';
     priceInput.value = '';
     ProductBtn.style.display = "block";
     
  }     
  
  //searching value
  const searchItem = e =>{
     itemLength = 0;
     const text = e.target.value.toLowerCase();
     document.querySelectorAll(".collection-item").forEach( item => {
         const itemName = item.firstElementChild.textContent.toLowerCase();
         if (itemName.indexOf(text) === -1) {
             item.style.display = "none"
             //msg.innerHTML = "No Product is Matched"
             //showMessage("NO PRODUCT IS AVAILABLE");
         }else{
             item.style.display = "block"
             //msg.innerHTML = "Product is Matched"
             //showMessage("PRODUCT IS AVAILABLE");
             ++itemLength
         }
         (itemLength) ? showMessage("PRODUCT IS AVAILABLE") : showMessage("NO PRODUCT IS AVAILABLE");
     })
  };
  //submit button
  const submitBtn =  e => {
     e.preventDefault();
     const name = nameInput.value;
     const price = priceInput.value;
     let id;
     if(productData.length === 0){
         id = 0;
     }
     else{
         id = productData[productData.length - 1].id + 1;
         //id = Math.random(1,9);
     }
     if(name === "" || price === ""){
         alert("Please Fil Up Information")
     } else{
         const data = {
             id ,
             name,
             price
         };
         productData.push(data);
         saveDataFromLocalStorage(data); 
         getData(productData);
         nameInput.value= "";
         priceInput.value= "";
     }
  };
 //deleteItem and UpdateItem
const deleteOrUpdateItem =  e =>{
    if(e.target.classList.contains("deleteBtn")){
        const target = e.target.parentElement;
        target.remove();
        // e.target.parentElement.parentElement.removeChild(target);
    //remove data        
        const id = parseInt(target.id.split("-")[1]);
        let result = productData.filter(localData => {
            return localData.id !== id; 
        });
        productData = result;
         deleteDataFromLocalStorage(id);   
    }
    else if (e.target.classList.contains("editBtn")) {
        const target = e.target.parentElement;
        const id = parseInt(target.id.split("-")[1]);
        ProductBtn.style.display = "none";
        const updateBtn = ` <button class="btn btn-secondary btn-block mt-3 updateBtn" >Update</button>`
        form.insertAdjacentHTML('beforeend', updateBtn);
         //populateForm( findingItem(id));
            //find product
            const foundItem = findingItem(id);
            populateForm(foundItem);
        document.querySelector('.updateBtn').addEventListener('click', evt => {
            updateItem(evt, id);
            //return to initial step
           initialSubmitBtn()
        });
    }
 };

 allSelector();

//getData(productData);

loadEventListener();
