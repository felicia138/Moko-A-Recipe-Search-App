const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '3c9d5635a1msh64bb1c41f30ac0ap11443djsnfb2c9a29caae',
		'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
	}
};

//  global array for storing fetched data
let state = [];

//  prints list of recipes
function printRecipeList(records, key) {
  let result = document.querySelector("#recipe-list");

  html = '';
  html += `<p class="result">Showing results for " ${key} "</p>`;
  count = 0;
  i = 0;
  
  for (let rec of records) {
    if (!(rec.hasOwnProperty('recipes'))) {                 //  only prints responses that are recipes
      count++;
      html +=
      `
      <div class="col">
        <div class="recipe">
          <figure>
            <img src="${rec.thumbnail_url}" alt="${rec.name}">
          </figure>
          <div class="recipe-details">
            <h3>${rec.name}</h3>
      `;
      if (rec.prep_time_minutes != null) {
        html +=
        `
              <p>Prep: ${rec.prep_time_minutes} minutes</p>
        `;
      }
      if (rec.cook_time_minutes != null) {
        html +=
        `
              <p>Cook: ${rec.cook_time_minutes} minutes</p>
        `;
      }
      html +=
      `
            <a href="#" id="read-more" onclick="printRecipeDetails(${i})">view</a>
          </div>
        </div>
      </div>
      `;
    }
    i++;
  }
  console.log(count);

  if (count === 0)
    result.innerHTML = `<p class="result">No results found for " ${key} "</p>`;
  else
    result.innerHTML = html;
}

//  prints details of recipe based on index in global array
async function printRecipeDetails(i) {
  let recipe = state.results[i];
  let result = document.querySelector("#recipe-container");
  
  let html = '';
  html += 
  `
  <div class="contentContainerColumn1">
      <div class="recipeImage"><img src="${recipe.thumbnail_url}"></div>
      <div class="recipeName"><h1>${recipe.name}</h1></div>
      
      <div class="details">
        <p>Servings: ${recipe.num_servings}</p>
  `;
  if (recipe.prep_time_minutes != null) {
    html +=
    `
      <p>Prep: ${recipe.prep_time_minutes} minutes</p>
    `;
  }
  if (recipe.cook_time_minutes != null) {
    html +=
    `
    <p>Cook: ${recipe.cook_time_minutes} minutes</p>
    `;
  }
  if (recipe.total_time_minutes != null) {
    html +=
    `
      <p>Total: ${recipe.cook_time_minutes} minutes</p>
    `;
  }

  html +=
  `
    <p id="ingredient-count"> </p>
      </div>
  `;
  html +=
  `
    <div class="recipeTags">
      <h2>Tags: </h2>
        <ul class="tags">
  `;

  let tagList = recipe.tags;
  //  displays relevant tags
  for (let tag of tagList) {
    if(tag.type === "dietary") {
      html += `<li class="recipeDietTags">${tag.display_name}</li>`;  
    }
    if(tag.type === "holiday" || tag.type === "occasion" || tag.type === "meal")
      html += `<li class="recipeOccasionTags">${tag.display_name}</li>`;
    if(tag.type === "difficulty")
      html += `<li class="recipeDifficultyTags">${tag.display_name}</li>`;
    if(tag.type === "cuisine")
      html += `<li class="recipeRegionTags">${tag.display_name}</li>`;
  }

  html += 
  `
        </ul>
      </div>
    </div>
    <div class="contentContainerColumn2">
      <div class="recipeDescription">
        <h2 class="description-heading">Decription</h2>
  `;


  if (recipe.description === "" || recipe.description === null) {
    html += 
    `
        <p class="description-details">No Decription Available</p>
      </div>
    `;
  }
  else {
    html += 
    `
      <p class="description-details">${recipe.description}</p>
    </div>
    `;
  }

  html +=
  `    
      <div class="recipeIngredientList">
        <h2>Ingredients</h2>
  `;
  
  let list = recipe.sections;
  count = 0;
  for (let item of list) {
    if (item.name != null) { //  displays ingredients section name
      html += 
      `
          <h3>${item.name}</h3>
      `;
    }
    
    html +=
    `
        <ul>
    `;

    for (let ingredient of item.components) { 
      count++;
      if (ingredient.raw_text != 'n/a')
        html += `     <li>${ingredient.raw_text}</li>`;
      else
      html += `     <li>${ingredient.ingredient.name} (${ingredient.extra_comment})</li>`;
    }
    html+= 
    `
        </ul>
    `;
  }

  html += 
  `
    </div>
  `

  html +=
  `
  <div class="recipeInstructions">
    <h2 class="instruction-heading">Instructions</h2>
      <ul class="instruction-details">
  `;

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
  document.getElementById('ingredient-count').innerHTML = `Ingredients: ${count}`;
  result.parentElement.style.display = 'block';
}

//  gets recipe data from API based on query
async function searchRecipe (searchKey) {
  searchKey = searchKey.replace(' ',"%");
  
  let url = new URL('https://tasty.p.rapidapi.com/recipes/list?from=0&size=50');
  url.searchParams.append('q',searchKey);
  
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
  return data;
}

//  gets and prints recipes based on key
async function showAll (key) {
  let page = document.querySelector('#recipe-list');
  html = '';
  //  prints loading symbol to screen
  page.innerHTML = `<div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;

  state = await searchRecipe(key);
  console.log(state);

  if (state.count === 0) {
    page.innerHTML = `<p class="result">No results found for " ${key} "</p>`;   // if 0 recipes are found
  }
  else {
    printRecipeList(state.results, key);  //  otherwise print list of recipes
  } 
}

//  gets recipe data from API based on tag
async function filterByTags (category) {
  category = category.replace(' ',"_");
  
  let url = new URL('https://tasty.p.rapidapi.com/recipes/list?from=0&size=50');
  url.searchParams.append('tags',category);
  
  const response = await fetch(url, options);
  const data = await response.json();
  return data;
}

//  gets and prints list of recipes based on category
async function showAllCategory (category) {
  let page = document.querySelector('#recipe-list');
  html = '';

  html += `<div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;
  page.innerHTML = html;

  state = await filterByTags (category);
  console.log(state);
  
  if (state.count === 0) {
    page.innerHTML = `<p class="result">No results found for " ${category} "</p>`;
  }
  else {
    printRecipeList(state.results, category);
  }
}

//  closes window with recipe details
function closeRecipe () {
  let details = document.getElementById("recipe-container");
  details.parentElement.style.display = 'none';
}

//  gets and prints recipes based on users input on search page
function searchQuery () {
  let searchKey = document.querySelector('#search').value;
  console.log(searchKey);
  showAll(searchKey);
}

//  loads filter options based on region selected
function loadFilters (event) {
    let region = event.target.innerHTML;
    let filters = document.getElementById(region);
    let list = document.querySelectorAll('.region');
    for (let item of list) {
      if (item.id === filters.id) {
        item.style.display = 'flex';
      }
      else {
        item.style.display = 'none';
      }
        
    }
}

//  gets random recent recipes from API
async function randomRecipes (key) {

  let url = new URL('https://tasty.p.rapidapi.com/recipes/list?from=0&size=20');
  
  const response = await fetch(url, options);
  const data = await response.json();
  return data;
}

//  gets recipes to display on home page
async function loadHomePage (key) {

  if (key === 'random')
    arr = await randomRecipes();
  else
    arr = await searchRecipe(key);
  
  recipes = arr.results;
  console.log(recipes);

  let result = document.getElementById(key);

  console.log(result);

  html = '';

  html += `<div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;
  result.innerHTML = html;

  html = '';
  i = 0;
  count = 0;
  
  for (let rec of recipes) {
    if (!(rec.hasOwnProperty('recipes'))) {
      state += rec;
      count++;
      html +=
      `
      <div class="col">
        <div class="recipe">
          <img src="${rec.thumbnail_url}" alt="${rec.name}" class="image">
          <div class="recipe-details">
            <div class="overlay">
              <h3>${rec.name}</h3>
      `;

      if (rec.prep_time_minutes != null) {
        html +=
        `
              <p>Prep: ${rec.prep_time_minutes} minutes</p>
        `;
      }
      if (rec.cook_time_minutes != null) {
        html +=
        `
              <p>Cook: ${rec.cook_time_minutes} minutes</p>
        `;
      }

      html +=
      `
              <a href="#" id="read-more" onclick="printRecipeHome(${rec.id})">view</a>
            </div>
          </div>
        </div>
      </div>
      `;
    }
    i++;
    if (count === 4)
        break;
  }
  result.innerHTML = html;
}

//  prints details of recipes based on recipe id
async function printRecipeHome(id) {

  let url = new URL('https://tasty.p.rapidapi.com/recipes/get-more-info');  
  url.searchParams.append('id',id);
  
  const response = await fetch(url, options); //  gets info from API
  const recipe = await response.json();
  console.log(recipe);
  let result = document.querySelector("#recipe-container");
  
  let html = '';
  html += 
  `
  <div class="contentContainerColumn1">
      <div class="recipeImage"><img src="${recipe.thumbnail_url}"></div>
      <div class="recipeName"><h1>${recipe.name}</h1></div>
      
      <div class="details">
        <p>Servings: ${recipe.num_servings}</p>
  `;
  if (recipe.prep_time_minutes != null) {
    html +=
    `
      <p>Prep: ${recipe.prep_time_minutes} minutes</p>
    `;
  }
  if (recipe.cook_time_minutes != null) {
    html +=
    `
    <p>Cook: ${recipe.cook_time_minutes} minutes</p>
    `;
  }
  if (recipe.total_time_minutes != null) {
    html +=
    `
      <p>Total: ${recipe.cook_time_minutes} minutes</p>
    `;
  }

  html +=
  `
    <p id="ingredient-count"> </p>
      </div>
  `;
  html +=
  `
    <div class="recipeTags">
      <h2>Tags: </h2>
        <ul class="tags">
  `;

  let tagList = recipe.tags;
  //  displays relevant tags
  for (let tag of tagList) {
    if(tag.type === "dietary") {
      html += `<li class="recipeDietTags">${tag.display_name}</li>`;  
    }
    if(tag.type === "holiday" || tag.type === "occasion" || tag.type === "meal")
      html += `<li class="recipeOccasionTags">${tag.display_name}</li>`;
    if(tag.type === "difficulty")
      html += `<li class="recipeDifficultyTags">${tag.display_name}</li>`;
    if(tag.type === "cuisine")
      html += `<li class="recipeRegionTags">${tag.display_name}</li>`;
  }

  html += 
  `
        </ul>
      </div>
    </div>
    <div class="contentContainerColumn2">
      <div class="recipeDescription">
        <h2 class="description-heading">Decription</h2>
  `;


  if (recipe.description === "" || recipe.description === null) {
    html += 
    `
        <p class="description-details">No Decription Available</p>
      </div>
    `;
  }
  else {
    html += 
    `
      <p class="description-details">${recipe.description}</p>
    </div>
    `;
  }

  html +=
  `    
      <div class="recipeIngredientList">
        <h2>Ingredients</h2>
  `;
  
  let list = recipe.sections;
  count = 0;
  for (let item of list) {
    if (item.name != null) { //  displays ingredients section name
      html += 
      `
          <h3>${item.name}</h3>
      `;
    }
    
    html +=
    `
        <ul>
    `;

    for (let ingredient of item.components) { 
      count++;
      if (ingredient.raw_text != 'n/a')
        html += `     <li>${ingredient.raw_text}</li>`;
      else
        html += `     <li>${ingredient.ingredient.name} (${ingredient.extra_comment})</li>`;
    }
    html+= 
    `
        </ul>
    `;
  }

  html += 
  `
    </div>
  `

  html +=
  `
  <div class="recipeInstructions">
    <h2 class="instruction-heading">Instructions</h2>
      <ul class="instruction-details">
  `;

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
  document.getElementById('ingredient-count').innerHTML = `Ingredients: ${count}`;
  result.parentElement.style.display = 'block';
}
