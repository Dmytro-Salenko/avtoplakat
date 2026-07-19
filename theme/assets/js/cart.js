/* --------------------------------------------------------------------------------------
 *
 *  Cart
 *
----------------------------------------------------------------------------------------- */

let shoppingCart = (function () {
  /* --------------------------------------------------------------------------------------
   *
   *  Private methods and propeties
   *
  ----------------------------------------------------------------------------------------- */
  cart = [];

  // Constructor
  function Item(name, price, count) {
    this.name = name;
    this.price = price;
    this.count = count;
  }

  // Save Cart
  function saveCart() {
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
  }

  // Load Cart
  function loadCart() {
    cart = JSON.parse(localStorage.getItem("shoppingCart"));
  }
  if (localStorage.getItem("shoppingCart") != null) {
    loadCart();
  }

  /* --------------------------------------------------------------------------------------
   *
   *  Private methods and propeties
   *
  ----------------------------------------------------------------------------------------- */
  let obj = {};

  // Add to Cart
  obj.addItemToCart = function (name, price, count) {
    for (let item in cart) {
      if (cart[item].name === name) {
        cart[item].count++;
        saveCart();
        return;
      }
    }
    let item = new Item(name, price, count);
    cart.push(item);
    saveCart();
  };
  // Set count from item
  obj.setCountForItem = function (name, count) {
    for (let i in cart) {
      if (cart[i].name === name) {
        cart[i].count = count;
        break;
      }
    }
  };
  // Remove item from cart
  obj.removeItemFromCart = function (name) {
    for (let item in cart) {
      if (cart[item].name === name) {
        cart[item].count--;
        if (cart[item].count === 0) {
          cart.splice(item, 1);
        }
        break;
      }
    }
    saveCart();
  };

  // Remove all items from cart
  obj.removeItemFromCartAll = function (name) {
    for (let item in cart) {
      if (cart[item].name === name) {
        cart.splice(item, 1);
        break;
      }
    }
    saveCart();
  };

  // Clear Cart
  obj.clearCart = function () {
    cart = [];
    saveCart();
  };

  // Count Cart
  obj.totalCount = function () {
    let totalCount = 0;
    for (let item in cart) {
      totalCount += cart[item].count;
    }
    return totalCount;
  };

  // Total Cart
  obj.totalCart = function () {
    let totalCart = 0;
    for (let item in cart) {
      totalCart += cart[item].price * cart[item].count;
    }
    return Number(totalCart.toFixed(2));
  };

  // List Cart
  obj.listCart = function () {
    let cartCopy = [];
    for (i in cart) {
      item = cart[i];
      itemCopy = {};
      for (p in item) {
        itemCopy[p] = item[p];
      }
      itemCopy.total = Number(item.price * item.count).toFixed(2);
      cartCopy.push(itemCopy);
    }
    return cartCopy;
  };

  // cart : Array
  // Item : Object/Class
  // addItemToCart : Function
  // removeItemFromCart : Function
  // removeItemFromCartAll : Function
  // clearCart : Function
  // countCart : Function
  // totalCart : Function
  // listCart : Function
  // saveCart : Function
  // loadCart : Function
  return obj;
})();

/* --------------------------------------------------------------------------------------
 *
 *  Triggers / Events
 *
----------------------------------------------------------------------------------------- */

// Add Item
$(".add-to-cart").click(function (event) {
  event.preventDefault();
  let name = $(this).data("name");
  let price = Number($(this).data("price"));
  shoppingCart.addItemToCart(name, price, 1);
  displayCart();
});

// Clear Items
$(".clear-cart").click(function () {
  shoppingCart.clearCart();
  displayCart();
});

function displayCart() {
  let cartArray = shoppingCart.listCart();
  let output = "";
  for (let i in cartArray) {
    output += `<tr><td>${cartArray[i].name}</td><td><div class='input-group'><button class='minus-item' data-name='${cartArray[i].name}'>-</button><input type='number' class='item-count' data-name='${cartArray[i].name}' value='${cartArray[i].count}'><button class='plus-item' data-name='${cartArray[i].name}'>+</button></div></td><td><button class='delete-item' data-name='${cartArray[i].name}'>×</button></td> = <td>${cartArray[i].total}</td></tr>`;
  }
  $(".cart").html(output);
  $(".total-cart").html(shoppingCart.totalCart());
  $(".total-count").html(shoppingCart.totalCount());
}

// Delete item button

$(".cart").on("click", ".delete-item", function (event) {
  let name = $(this).data("name");
  shoppingCart.removeItemFromCartAll(name);
  displayCart();
});

// -1
$(".cart").on("click", ".minus-item", function (event) {
  let name = $(this).data("name");
  shoppingCart.removeItemFromCart(name);
  displayCart();
});
// +1
$(".cart").on("click", ".plus-item", function (event) {
  let name = $(this).data("name");
  shoppingCart.addItemToCart(name);
  displayCart();
});

// Item count input
$(".cart").on("change", ".item-count", function (event) {
  let name = $(this).data("name");
  let count = Number($(this).val());
  shoppingCart.setCountForItem(name, count);
  displayCart();
});

displayCart();

/* --------------------------------------------------------------------------------------
 *
 *  Cart Form
 *
----------------------------------------------------------------------------------------- */

$("#cart-button").on("click", function () {
  const name = $("#client-name").val().trim();
  const email = $("#client-email").val().trim();
  const phone = $("#client-phone").val().trim();
  const cart = '<ul>'+ (JSON.parse(localStorage.shoppingCart).map(({name, price, count}) => `<li>${name}, кількість: ${count}, сумма за одиницю: ${price}		</li>`).reduce((acc, val) => acc + val + '<br>', '') + '</ul>') ;

  if (name.trim() === "") {
    $("#cart-error").text("Введіть ім'я");
    return false;
  } 
  if (email.trim() === "") {
    $("#cart-error").text("Введіть email");
    return false;
  } 
  if (phone.trim() === "") {
    $("#cart-error").text("Введіть номер телефону");
    return false;
  }

  $("#cart-error").text("");

  $.ajax({
    url: "/wp-content/themes/avtoplakat/cart-form.php",
    type: "POST",
    cache: false,
    data: {
      name,
      email,
      phone,
      cart
    },
    dataType: "html",
    beforeSend: function () {
      $("#cart-button").prop("disable", true);
    },
    success: function (data) {
      if (!data) {
        alert("Сталася помилка, замовлення не оформлено.");
      } else {
        alert("Замовлення успішно оформлено");
        $("#cart-form").trigger("reset");
        $(".clear-cart").trigger("click");
        localStorage.clear();
      }
      $("#cart-button").prop("disable", false);
    },
	error: function(data) {
			  
	}
  });
});
