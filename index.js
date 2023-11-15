const options = { 
  method: 'GET', 
  headers: { 'Content-Type': 'application/json;charset=utf-8' }, 
}
const url1 = 'https://api.publicapis.org/entries';
const url2 = 'https://apps-nefsc.fisheries.noaa.gov/NEMIS/index.php/api/mul_detail/test';
const url3 = 'https://random-d.uk/api/v2/random';
const url = 'https://corsproxy.io/?' + encodeURIComponent(url3);
const fetchBtn = document.querySelector('#fetch-btn');
fetchBtn.addEventListener('click', () => fetchApi(url))

async function fetchApi(url) {
  setLoading(true);
  const corsProxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url3);

  try {
    const response = await fetch(corsProxyUrl);
    console.log(response);
    if (!response.ok) {
      throw new Error('Problem with fetch, received status:', response.status);
    }
    const data = await response.json();
    console.log(data);
  } catch(err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}

function setLoading(on) {
  if (on) {
    console.log('Loading...');
    const contentArea = document.querySelector('#content');
    const loading = document.createElement('p');
    loading.setAttribute('id', 'loading');
    loading.textContent = 'Loading...';
    contentArea.append(loading)
  } else {
    const loading = document.querySelector('#loading');
    loading.remove();
  }
}