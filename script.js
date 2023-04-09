const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'f80a470c6emsh53ef212fefabc98p100ffajsn70d7de6039d4',
		'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
	}
};

let state = [];

function printRecipeList(records) {
  let result = document.querySelector("#recipe-list");

  html = '';

  count = 0;
  i = 0;
  for (let rec of records) {
    if (!(rec.hasOwnProperty('recipes'))) {
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
            <a href="#" id="read-more" onclick="printRecipeDetails(${count})">view</a>
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
    count++;
  }

  result.innerHTML = html;
}

async function printRecipeDetails(i) {
  let recipe = state[i];
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
      html += `<li>${ingredient.raw_text}</li>`;
    }
    html+= 
    `
    </ul>
    `;
  }

  html += 
  `
    </div>
  <div class="recipeTags">
    <h3>Tags: </h3>
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


  if (recipe.description === "") {
    html += 
    `
      <p class="description-details">No Decription Available</p></div>
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


async function searchRecipe (searchKey) {
  console.log("searching...");
  searchKey = searchKey.replace(' ',"%");
  
  let url = new URL('https://tasty.p.rapidapi.com/recipes/list?from=0&size=50');
  url.searchParams.append('q',searchKey);
  
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
  return data.results;
}

async function showAll (key) {
  let page = document.querySelector('#recipe-list');
  html = '';

  html += `<div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;
  page.innerHTML = html;
  
  state = await searchRecipe(key);
  console.log("result...");
  console.log(state);
  printRecipeList(state);
}

async function filterByTags (category) {
  category = category.replace(' ',"_");
  
  let url = new URL('https://tasty.p.rapidapi.com/recipes/list?from=0&size=50');
  url.searchParams.append('tags',category);
  
  const response = await fetch(url, options);
  const data = await response.json();
  return data.results;
}

async function showAllCategory (category) {
  state = await filterByTags(category);
  printRecipeList(state);
}

async function filterByIngredient(ingredient) {
  ingredient = ingredient.replace(' ',"%");
  
  let url = new URL('https://tasty.p.rapidapi.com/recipes/list?from=0&size=50');
  url.searchParams.append('q',ingredient);
  
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
}

function closeRecipe () {
  let details = document.getElementById("recipe-container");
  details.parentElement.style.display = 'none';
}

function searchRecipes () {
  let searchKey = document.querySelector('#search').value;
  console.log(searchKey);
  showAll(searchKey);
}