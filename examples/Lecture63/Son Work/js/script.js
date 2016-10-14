
var finalHtml="";
var html="";
document.addEventListener("DOMContentLoaded", function (event) {

// On first load, show home view
showLoading("snippets/home-snippet.html");

});


function showLoading(url) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    myFunction(this);
    }
  };
  xhttp.open("GET",url, true);
  xhttp.send();
}

function myFunction(xhttp) {
  document.getElementById("main-content").innerHTML = xhttp.responseText;
}



////////////  PART 2 - LOAD CATEGORIES  ////////////////////
function loadMenuCategories() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    buildCategoriesViewHtml(this);
    }
  };
  xhttp.open("GET", "https://davids-restaurant.herokuapp.com/categories.json", true);
  xhttp.send(null);
}


//addHtml("snippets/categories-title-snippet.html"); to get html code of general page
function addHtml(url) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    finalHtml= xhttp.responseText;
    }
  };
  xhttp.open("GET",url, false);
  xhttp.send();
}


//mergeHtml("snippets/category-snippet.html"); to get html of each time
function mergeHtml(url) {
     var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    html= xhttp.responseText;
    }
  };
  xhttp.open("GET",url, false);
  xhttp.send();
}


//To complete the whole page
function buildCategoriesViewHtml(xhttp) {
  var categories = JSON.parse(xhttp.responseText);
 
  addHtml("snippets/categories-title-snippet.html");
  finalHtml += "<section class='row'>";
  //console.log(finalHtml);
  
  // Loop over categories
  for (var i = 0; i < categories.length; i++) {
    // Insert category values
    mergeHtml("snippets/category-snippet.html");
    //console.log(html);
    var name = "" + categories[i].name;
    var short_name = categories[i].short_name;
    html = insertProperty(html, "name", name);
    html = insertProperty(html, "short_name",short_name);
     //console.log(html);
    finalHtml += html;
    html="";
  }

  finalHtml += "</section>";
  //console.log(finalHtml);
  var targetElem = document.querySelector("#main-content");
  targetElem.innerHTML = finalHtml;
}


/////////////       PART3- LOAD ITEMS     /////////////
function loadMenuItems(Mycategory) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    buildItemsViewHtml(this,Mycategory);
    }
  };
  xhttp.open("GET", "https://davids-restaurant.herokuapp.com/menu_items.json?category="+Mycategory, true);
  xhttp.send(null);
}


function buildItemsViewHtml(xhttp, Mycategory) {
  var menuItems = JSON.parse(xhttp.responseText);
  var items=menuItems.menu_items;
  var catShortName = menuItems.category.short_name;
  finalHtml="";
  addHtml("snippets/menu-items-title.html");
  finalHtml= insertProperty(finalHtml,"name", menuItems.category.name);
  finalHtml= insertProperty(finalHtml,"special_instructions",menuItems.category.special_instructions);


  finalHtml += "<section class='row'>";
  console.log(finalHtml);
  
  // Loop over categories
  for (var i = 0; i < items.length; i++) {
    // Insert category values
    mergeHtml("snippets/menu-item.html");
    var name = "" + items[i].name;
    var short_name = items[i].short_name;
    html = insertProperty(html, "name", name);
    html = insertProperty(html, "short_name",short_name);
    html = insertProperty(html, "description",items[i].description);
    html =insertProperty(html,  "catShortName", catShortName);
    html =insertItemPrice(html, "price_small", items[i].price_small);
    html =insertItemPortionName(html, "small_portion_name", items[i].small_portion_name);
    html =insertItemPrice(html,"price_large", items[i].price_large);
    html =insertItemPortionName(html,"large_portion_name",items[i].large_portion_name);
    finalHtml += html;
    html="";
  }

  finalHtml += "</section>";
 // console.log(finalHtml);
  var targetElem = document.querySelector("#main-content");
  targetElem.innerHTML = finalHtml;
}




// For adjust properites of each item
function insertProperty (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string.replace(new RegExp(propToReplace, "g"), propValue);
  return string;
}
function insertItemPrice(html,
                         pricePropName,
                         priceValue) {
  // If not specified, replace with empty string
  if (!priceValue) {
    return insertProperty(html, pricePropName, "");;
  }

  priceValue = "$" + priceValue.toFixed(2);
  html = insertProperty(html, pricePropName, priceValue);
  return html;
}


// Appends portion name in parens if it exists
function insertItemPortionName(html,
                               portionPropName,
                               portionValue) {
  // If not specified, return original string
  if (!portionValue) {
    return insertProperty(html, portionPropName, "");
  }

  portionValue = "(" + portionValue + ")";
  html = insertProperty(html, portionPropName, portionValue);
  return html;
}
