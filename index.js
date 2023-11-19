//When the page loads get a list of filtered free api links
//Make an API search tool that loads the list
//Allow searching by string, or looking by category, or by all
//Make separate section for entering and fetching an api url
//Should show errors if they occur in red text below the input element
//Create large function to parse any data, create ui elements, and add to rest of page
  //Make a card for each element
  //Check for strings/titles
  //Check for links
  //Check for lists
  //Check for images

import apiList from './apiList.json' assert { type: 'json' };
import apiCategories from './apiCategories.json' assert { type: 'json' };

const apiSearch = document.querySelector('#apiSearch');
const authCheck = document.querySelector('#authCheck');
const corsCheck = document.querySelector('#corsCheck');
apiSearch.addEventListener('keyup', (e) => displayApiList(e));
authCheck.addEventListener('click', (e) => displayApiList(e));
corsCheck.addEventListener('click', (e) => displayApiList(e));
displayApiList();

const fetchBtn = document.querySelector('#fetchBtn');
fetchBtn.addEventListener('click', (e) => fetchApi(e))

function displayApiList(e) {
  const apiListRow = document.querySelector('#apiListRow');
  while (apiListRow.firstChild) {
    apiListRow.firstChild.remove()
  }

  const search = e && e.target.id === 'apiSearch' ? e.target.value : apiSearch.value;
  const auth = e && e.target.id === 'authCheck' ? e.target.checked : authCheck.checked;
  const cors = e && e.target.id === 'corsCheck' ? e.target.checked : corsCheck.checked;

  const updatedApiList = apiList.filter(api => {
    let includeApi = true;
    if (
      search && !api.API.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
      !auth && api.Auth ||
      !cors && api.Cors === 'yes'
    ) {
      includeApi = false;
    }
    return includeApi;
  });

  apiCategories.sort();
  for (const category of apiCategories) {
    const isCategoryInApiList = updatedApiList.filter(api => api.Category === category).length;
    if (isCategoryInApiList) {
      const categoryCol = document.createElement('div');
      categoryCol.classList.add(
        'col-12', 
        'col-sm-6',
        'col-md-4',
        'border', 
        'rounded', 
        'py-2'
      );

      const categoryTitle = document.createElement('h5');
      categoryTitle.textContent = category;
      categoryCol.appendChild(categoryTitle);
  
      const categoryList = document.createElement('div');
      categoryList.setAttribute('data-categoryName', category);
      categoryList.classList.add('list-group');
  
      categoryCol.appendChild(categoryList);
      apiListRow.appendChild(categoryCol);
    }
  }

  for (const api of updatedApiList) {
    const apiItem = document.createElement('a');
    apiItem.classList.add('list-group-item', 'list-group-item-action', 'list-group-item-dark');
    apiItem.setAttribute('href', api.Link);
    apiItem.setAttribute('target', '_blank');
    apiItem.setAttribute('title', api.Description);
    apiItem.textContent = api.API;
    document.querySelector(`div[data-categoryName="${api.Category}"]`).appendChild(apiItem);
  }


}

async function fetchApi(e) {
  e.preventDefault();
  console.log('in function');

  const apiUrl = document.querySelector('#apiUrl').value;
  console.log(apiUrl);
  const corsProxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(apiUrl);

  if (apiUrl.trim().length) {
    try {
      const response = await fetch(corsProxyUrl);
      const data = await response.json();
      console.log(data);
    } catch(err) {
      console.error(err);
    } 
  } else {
    //Warn user that there is no url to fetch
  }
}

//Create a card component
//Look at top level of results - see if any is type array
//Print out main key/values that are NOT the array
//Then, create a sub-card or sub-section for each element in the array key/value
//