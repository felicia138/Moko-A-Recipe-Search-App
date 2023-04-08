const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'f80a470c6emsh53ef212fefabc98p100ffajsn70d7de6039d4',
		'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
	}
};

let state = [];

function printRecipeList(records) {
  let result = document.querySelector("#pasta-recipes");
  
  let html='';
  
  i = 0;
  for (let rec of records) {
    if (i%4  == 0) {
      html += 
      `
      <div class="flex-row">
      `;
      div = i+4;
    }

     html +=
    `
    <div class="col">
      <div class="pasta-recipe">
        <figure>
          <img src="${rec.thumbnail_url}" alt="${rec.name}">
        </figure>
         <div class="recipe-details">
          <h3>${rec.name}</h3>
          <p>Prep: ${rec.prep_time_minutes} minutes</p>
          <p>Cook: ${rec.cook_time_minutes} minutes</p>
          <button id="read-more">view</button>
        </div>
      </div>
    </div>
    `;
    i++;
    if (i == div) {
      html += 
      `
      </div>
      `;
    }
  }

  result.innerHTML = html;
}

async function printRecipeDetails() {
  
  let recipe = results[0];
  
  let html = '';
  html += 
  `
  <div class="contentContainerColumn1">
      <div class="recipeImage"><img src="${recipe.thumbnail_url}"></div>
      <div class="recipeName"><h1>${recipe.name}</h1></div>
      
      <div class="details">
        <p>Servings: ${recipe.num_servings}</p>
        <p>Prep: ${recipe.prep_time_minutes}</p>
        <p>Cook: ${recipe.cook_time_minutes}</p>
        <p id="ingredient-count">Ingredients: </p>
      </div>
      
      <div class="recipeIngredientList">
        <h2>Ingredients</h2>
  `;
  
  let list = recipe.sections;
  let count = 0;
  
  for (let item of list) {
    if (item.name != null) //  displays ingredients section name
      html += 
      `
      <h3>${item.name}</h3>
      <ul>
      `;

    for (let ingredient of item.components) { 
      count++;  //  counts number of ingredients
      html += `
      <li>${ingredient.raw_text}</li>
      `;
    }
    html+= `</ul>`;
  }
  html += `
  </div>
  <div class="recipeDietTags">
    <h3>Diet: </h3>
      <ul class="tags">
  `;

  let tagList = recipe.tags;
  //  displays relevant tags
  for (let tag of tagList) {
    if(tag.type === "dietary") {
      html += `<li>${tag.display_name}</li>`;  
    }
    if(tag.type === "holiday" || tag.type === "occasion" || tag.type === "meal")
      console.log(tag.display_name);
    if(tag.type === "difficulty")
      console.log(tag.display_name);
    if(tag.type === "cuisine")
      console.log(tag.display_name);
  }

  html += `</ul>
      </div>
    </div>
    <div class="contentContainerColumn2">
      <div class="recipeDescription">
        <h2 class="description-heading">Decription</h2>`;


  if (recipe.description === "") {
    html += `<p class="description-details">No Decription Available</p></div>`;
  }
  else {
    html += `<p class="description-details">${recipe.description}</p>
    </div>
    <div class="recipeInstructions">
        <h2 class="instruction-heading">Instructions</h2>
        <ul class="instruction-details">`;
  }

  let instructions = recipe.instructions;
  for (let step of instructions) {
    html += `<li>${step.display_text}</li>`;
  }
  html += 
  `
  </ul>
  </div>
  `;

  result.innerHTML = html;
}

// let searchKey = document.querySelector('#searchKey').value;

async function searchRecipe(searchKey) {
  searchKey = searchKey.replace(' ',"_");
  
  let url = new URL('https://tasty.p.rapidapi.com/recipes/list?from=0&size=50');
  url.searchParams.append('q',searchKey);
  
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
  return data.results;
}

async function showAll (key) {
  state = await searchRecipe(key);
  printRecipeList(state);
}

async function filterByCategory(category) {
  category = category.replace(' ',"_");
  
  let url = new URL('https://tasty.p.rapidapi.com/recipes/list?from=0&size=50');
  url.searchParams.append('tags',category);
  
  const response = await fetch(url, options);
  const data = await response.json();
  return data.results;
}

async function showAllCategory (category) {
  state = await filterByCategory(category);
  printRecipeList(state);
}

async function filterByArea(area) {
  area = area.replace(' ',"_");
  
  let url = new URL('https://tasty.p.rapidapi.com/recipes/list?from=0&size=50');
  url.searchParams.append('tags',area);
  
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
}

async function filterByIngredient(ingredient) {
  ingredient = ingredient.replace(' ',"_");
  
  let url = new URL('https://tasty.p.rapidapi.com/recipes/list?from=0&size=50');
  url.searchParams.append('q',ingredient);
  
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
}

async function randomMeal() {
  let url = new URL('https://tasty.p.rapidapi.com/feeds/list?size=1&timezone=%2B0700&vegetarian=false&from=0');
  
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
}
let list = document.getElementById("pasta-recipes")
let details = document.getElementById("recipe-details");

// Get the button that opens the modal
let btn = document.getElementById("read-more");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  details.style.display = "block";
  $(list).hide(1);
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  details.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == details) {
    details.style.display = "none";
    $(list).show(1);
  }
}