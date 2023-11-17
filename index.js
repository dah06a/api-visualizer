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

  const apiSearch = document.querySelector('#apiSearch');
  const authCheck = document.querySelector('#authCheck');
  const corsCheck = document.querySelector('#corsCheck');

  apiSearch.addEventListener('keydown', displayApiList);
  authCheck.addEventListener('click', displayApiList);
  corsCheck.addEventListener('click', displayApiList);

function displayApiList() {
  const search = apiSearch.value;
  const auth = authCheck.checked;
  const cors = corsCheck.checked;

  const updatedApiList = apiList.filter(api => {
    let includeApi = true;
    if (
      search && !api.API.includes(search) ||
      !auth && api.Auth ||
      !cors && api.Cors === 'yes'
    ) {
      includeApi = false;
    }
    return includeApi;
  });

  console.log(updatedApiList);
}

async function fetchApi(url) {
  const corsProxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);
  try {
    const response = await fetch(corsProxyUrl);
    const data = await response.json();
    console.log(data);
  } catch(err) {
    console.error(err);
  } 
}

fetchApi('https://api.publicapis.org/categories');