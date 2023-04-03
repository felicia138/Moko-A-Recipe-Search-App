const options = {
  method: 'GET',
  headers: {
  	'X-RapidAPI-Key': 'f80a470c6emsh53ef212fefabc98p100ffajsn70d7de6039d4',
  	'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
  }
};

function printRecipeList(records) {
  for (let rec of records) {
    console.log(recipe.name);
    
  }
}

async function printRecipeDetails(recipe) {
  console.log(recipe.thumbnail_url);
  console.log(recipe.name);  //  recipe name
  console.log(recipe.num_servings);  //  servings
  let list = recipe.sections;
  let count = 0;
  
  for (let item of list) {
    if (item.name != null)
      console.log(item.name);  //  displays ingredients section name
    
    for (let ingredient of item.components) { 
      console.log(ingredient.raw_text);  //  displays ingredient and quantity
      count++;  //  counts number of ingredients
    }
  }
  console.log(count);  //  displays number of ingredients
  
  let tagList = recipe.tags;
  //  displays relevant tags
  for (let tag of tagList) {
    if(tag.type === "dietary")
      console.log(tag.display_name);
    if(tag.type === "holiday" || tag.type === "occasion" || tag.type === "meal")
      console.log(tag.display_name);
    if(tag.type === "difficulty")
      console.log(tag.display_name);
    if(tag.type === "cuisine")
      console.log(tag.display_name);
  }
  //  displays description
  if (recipe.description === "")
    console.log("No Description Available");
  else
    console.log(recipe.description);
  
  let instructions = recipe.instructions;
  for (let step of instructions)
    console.log(step.display_text);  //  displays recipe instructions
}

async function searchRecipe(searchKey) {
  searchKey = searchKey.replace(' ',"_");
  
  let url = new URL('https://tasty.p.rapidapi.com/recipes/list?from=0&size=50');
  url.searchParams.append('q',searchKey);
  
  const response = await fetch(url, options);
  const data = await response.json();
  printRecipeDetails(data.results[0]);
}

async function filterByCategory(category) {
  category = category.replace(' ',"_");
  
  let url = new URL('https://tasty.p.rapidapi.com/recipes/list?from=0&size=50');
  url.searchParams.append('q',category);
  
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
}

async function filterByArea(area) {
  area = area.replace(' ',"_");
  
  let url = new URL('https://tasty.p.rapidapi.com/recipes/list?from=0&size=50');
  url.searchParams.append('q',area);
  
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

searchRecipe('alfredo');
