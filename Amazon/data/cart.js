export let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(productId, quantity, price) {

  cart.push({
    productId,
    quantity,
    priceCents: price * quantity,
    priceCentsPerItem: price,
  })

  saveToStorage();
}

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;

  saveToStorage();
}

export function calculateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  return cartQuantity;
}

export function updateQuantity(productId, newQuantity) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.quantity = newQuantity;
  matchingItem.priceCents = newQuantity * matchingItem.priceCentsPerItem;

  saveToStorage();
}


export function reviewQuantity() {
  const cartQuantity = calculateCartQuantity();
  console.log(cartQuantity)
  const checkoutContainer = document.querySelector(".checkout-container");

  if (cartQuantity) {
    checkoutContainer.style.display = 'none';
  }
  else {
    checkoutContainer.style.display = 'block';
  }
}

