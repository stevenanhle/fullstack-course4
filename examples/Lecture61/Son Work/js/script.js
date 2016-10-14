
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



////////////                   PART 2                  ////////////////////
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




//////////
function buildCategoriesViewHtml(xhttp) {
  var categories = JSON.parse(xhttp.responseText);
 
  addHtml("snippets/categories-title-snippet.html");
  finalHtml += "<section class='row'>";
  console.log(finalHtml);
  
  
  // Loop over categories
  for (var i = 0; i < categories.length; i++) {
    // Insert category values
    mergeHtml("snippets/category-snippet.html");
    console.log(html);
    var name = "" + categories[i].name;
    var short_name = categories[i].short_name;
    html = insertProperty(html, "name", name);
    html = insertProperty(html, "short_name",short_name);
    
    finalHtml += html;
    html="";
  }

  finalHtml += "</section>";
  console.log(finalHtml);
  var targetElem = document.querySelector("#main-content");
  targetElem.innerHTML = finalHtml;
}


function insertProperty (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string.replace(new RegExp(propToReplace, "g"), propValue);
  return string;
}