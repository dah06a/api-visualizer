const options = { 
  method: 'GET', 
  headers: { 'Content-Type': 'application/json;charset=utf-8' }, 
}
const url = 'https://corsproxy.io/?' + encodeURIComponent('https://cat-fact.herokuapp.com/facts');
const url1 = 'https://api.publicapis.org/entries';
const url2 = 'https://pokeapi.co/api/v2/pokemon/1';
const fetchBtn = document.querySelector('#fetch-btn');
fetchBtn.addEventListener('click', fetchApi)

function fetchApi() {
  setLoading();
  fetch(url).then(res => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error('Something went wrong with the fetch...');
    }
  })
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.error(err);
  })
  .finally(() => {
    removeLoading();
  });
}


function setLoading() {
  console.log('Loading...');
  const contentArea = document.querySelector('#content');
  const loading = document.createElement('p');
  loading.setAttribute('id', 'loading');
  loading.textContent = 'Loading...';
  contentArea.append(loading);
}

function removeLoading() {
  const loading = document.querySelector('#loading');
  loading.remove();
}