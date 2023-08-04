import {
  cart,
  removeFromCart,
  updateQuantity,
  reviewQuantity
} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
let cartSummaryHTML = "";
cart.forEach((cartItem) => {
  const productId = cartItem.productId;
  let matchingProduct;
  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });
  cartSummaryHTML += `
      <div class="cart-item-container
        js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: Tuesday, June 21
        </div>
        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">
          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              $${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
              <span>
              
                Quantity: <span class="quantity-label js-quantity-label-${
                  matchingProduct.id
                }">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-link"
                data-product-id="${matchingProduct.id}">
                Update
              </span>

              <input type="number" class="quantity-input js-quantity-input-${
                matchingProduct.id
              }">

              <span class="save-quantity-link link-primary js-save-link"
                data-product-id="${matchingProduct.id}">
                Save
              </span>

              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${
                matchingProduct.id
              }">
                Delete
              </span>

            </div>
          </div>
          <div class="delivery-options" id="summary-option">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
          <form id="option-value">

            <div class="delivery-option">
            <label>
             <input type="radio"
                value="0"
                checked
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}"
                data-product-id="${matchingProduct.id}" />
                </label>
              <div>
                  <div class="option-date-delivery">
                    Tuesday, June 21
                  </div>
                <div class="delivery-option-price">
                  FREE Shipping
                </div>
               </div>
               </div>
               <div class="delivery-option">
               <label>
                <input type="radio"
                  value="4.99"
                  class="delivery-option-input"
                  name="delivery-option-${matchingProduct.id}"
                  data-product-id="${matchingProduct.id}" 
                  />
                </label>
               <div>

                <div class="delivery-option-dat">
                  Wednesday, June 15
                </div>

                <div class="delivery-option-price">
                  $4.99 - Shipping
                </div>

              </div>
            </div>
            <div class="delivery-option">
            <label>
              <input type="radio"
                  value="9.99"
                  class="delivery-option-input"
                  name="delivery-option-${matchingProduct.id}"
                  data-product-id="${matchingProduct.id}" 
                  />
                </label>
              <div>
                <div class="delivery-option-da">
                  Monday, June 13
                </div>
                <div class="delivery-option-price">
                  $9.99 - Shipping
                </div>

              </div>

            </div>
          </form>
          </div>
        </div>
      </div>
    `;
});

document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

var totalDeliveryPrice = {};

document.querySelectorAll(".js-delete-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);

    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    delete totalDeliveryPrice[productId];
    container.remove();
    calculateShippingCharges(totalDeliveryPrice);
    addCurrentTotalQuantity();
    reviewQuantity()
  });
});


document.querySelectorAll(".js-update-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    container.classList.add("is-editing-quantity");

    const quantityInput = document.querySelector(
      `.js-quantity-input-${productId}`
    );
    const quantityLabel = document.querySelector(
      `.js-quantity-label-${productId}`
    );
    quantityInput.value = quantityLabel.textContent;
    quantityInput.style.display = "inline-block";

    quantityLabel.style.display = "none";

    link.style.display = "none";
    const saveLink = document.querySelector(
      `.js-save-link[data-product-id="${productId}"]`
    );
    saveLink.style.display = "inline";
  });
});

document.querySelectorAll(".js-save-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    const quantityInput = document.querySelector(
      `.js-quantity-input-${productId}`
    );
    const newQuantity = Number(quantityInput.value);

    if (newQuantity < 0 || newQuantity >= 1000) {
      alert("Quantity must be at least 0 and less than 1000");
      return;
    }

    updateQuantity(productId, newQuantity);

    const quantityLabel = document.querySelector(
      `.js-quantity-label-${productId}`
    );
    quantityLabel.textContent = newQuantity;
    quantityLabel.style.display = "inline";

    quantityInput.style.display = "none";
    const updateLink = document.querySelector(
      `.js-update-link[data-product-id="${productId}"]`
    );
    updateLink.style.display = "inline";

    link.style.display = "none";
    addCurrentTotalQuantity();
   
  });
});

const ordersContainer = document.querySelector(".js-order-summary");
function shippingCostRadio(){
  ordersContainer.addEventListener("change", (event) => {
   
    if (event.target.type === "radio") {
      const selectedOption = event.target.value;
      const itemId = event.target.name.split("delivery-option-")[1];
      totalDeliveryPrice[itemId] = Number(selectedOption);
    }
    addCurrentTotalQuantity();
  });
}

function calculateShippingCharges(shippingMap){
  console.log(shippingMap)
  
  let cost = Object.values(shippingMap).reduce(
    (acc, curr) => {
      return curr + acc;
    },
    0
  );
  return Number(cost) || 0;
}

function calculateCartQuantityForOrder(){
  let totalItem = 0;
  cart.forEach(item => {
    totalItem += Number(item.quantity);
  })
  return totalItem
}

function addCurrentTotalQuantity() {

  const topHeadTotalItem = document.querySelector(".js-return-to-home-link");
  const orderSummaryItem = document.getElementById("head-total-item-quantity");
  const totalProductsPayment = document.getElementById("total-products-payment");
  const shippingPriceContainer = document.querySelector(".payment-summary-money-delivery");
  const totalBeforeTaxContainer = document.getElementById("total-before-tax");
  const totalTaxContainer = document.getElementById("total-tax");
  const grandTotalContainer = document.getElementById("grand-total");

  var currentPayment = 0;
  cart.forEach((item) => {
    currentPayment += item.priceCents;
  });

  let shippingCost = calculateShippingCharges(totalDeliveryPrice);
  let totalBeforeTax = Number(formatCurrency(currentPayment)) + shippingCost;
  let totalTaxToBePaid = Number(totalBeforeTax * 0.1).toFixed(2);
  let grandTotalToPay = Number(totalBeforeTax) + Number(totalTaxToBePaid);
  let cartQuantity = calculateCartQuantityForOrder();

  topHeadTotalItem.innerHTML = `${cartQuantity} items`;
  orderSummaryItem.innerHTML = `Item (${cartQuantity}):`;
  totalProductsPayment.innerHTML = `$${formatCurrency(currentPayment)}`;
  shippingPriceContainer.innerHTML = `$${shippingCost.toFixed(2)}`;
  totalBeforeTaxContainer.innerHTML = `$${totalBeforeTax.toFixed(2)}`;
  totalTaxContainer.innerHTML = `$${totalTaxToBePaid}`;
  grandTotalContainer.innerHTML = `$${Number(grandTotalToPay).toFixed(2)}`;
}
shippingCostRadio();
addCurrentTotalQuantity();
reviewQuantity();
let newDate = new Date();

let allDay = ["Sunday", "Monday", "Tuesday", "Wednesday","Thrusday", "Friday","Saturday"];
let allMonth =  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
let date = new Date(newDate);



let deliveryDate = document.querySelector(".delivery-date").innerHTML = `Delivery Date: ${allDay[newDate.getDay()]} ${allMonth[newDate.getMonth()]} ${newDate.getDate()+5}`
console.log(deliveryDate)

let calDate = newDate.getDate();
console.log(calDate)
let afterDays = (calDate + 12) % 7;
console.log(afterDays)

document.querySelector(".option-date-delivery").innerHTML = `${allDay[afterDays]} ${allMonth[newDate.getMonth()]} ${newDate.getDate()+11}`;

document.querySelector(".delivery-option-dat").innerHTML = `${allDay[newDate.getDay()]} ${allMonth[newDate.getMonth()]} ${newDate.getDate()+5}`;

document.querySelector(".delivery-option-da").innerHTML = `${allDay[newDate.getDay()+1]} ${allMonth[newDate.getMonth()]} ${newDate.getDate()+1}`;





document.querySelector(".paypal-checkbox").addEventListener('click', ()=>{
  document.querySelector(".button-primary").classList.add("disabled");
  const placeOrder = document.querySelector(".place-order-button");

  placeOrder.classList.toggle('hide');

document.querySelector(".payment-card").classList.toggle('hide');
})


const paypalCheckbox = document.querySelector('.paypal-checkbox');

document.querySelector(".paypal-button").addEventListener('click', (event) => {
  event.preventDefault();
  paypalCheckbox.checked = false;
  console.log('click');
  window.location.href = event.currentTarget.parentElement.href;
});