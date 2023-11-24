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

const statusAlert = document.querySelector('#statusAlert');
const statusText = document.querySelector('#statusText');
const statusIcon = document.querySelector('#statusIcon');
const contentArea = document.querySelector('#contentArea');

function displayApiList(e) {
  const apiListRow = document.querySelector('#apiListRow');
  while (apiListRow.firstChild) {
    apiListRow.firstChild.remove();
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
  setLoadingStatus();
  removeAllContent();

  const apiUrl = document.querySelector('#apiUrl').value;
  console.log(apiUrl);

  if (checkValidUrl(apiUrl.trim())) {
    const corsProxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(apiUrl);
    try {
      const response = await fetch(corsProxyUrl);
      if (!response.ok) {
        throw new Error(response.status);
      }
      const data = await response.json();
      console.log(data);
      displayApiData(data, contentArea);
      setSuccessStatus();
    } catch(errStatus) {
      console.error(errStatus);
      setErrorStatus(errStatus);
    } 
  } else {
    setWarningStatus();
  }
}

function setSuccessStatus() {
  statusAlert.className = 'alert alert-success';
  statusText.textContent = 'Success - the API responded with data!';
  clearStatusIcon();

  const successIcon = document.createElement('i');
  successIcon.classList.add('bi', 'bi-check-circle');
  statusIcon.appendChild(successIcon);
}

function setWarningStatus() {
  statusAlert.className = 'alert alert-warning';
  statusText.textContent = 'Warning - the URL provided is not valid. Please try again.';
  clearStatusIcon();

  const warningIcon = document.createElement('i');
  warningIcon.classList.add('bi', 'bi-exclamation-triangle');
  statusIcon.appendChild(warningIcon);
}

function setErrorStatus(errorCode) {
  let errorMsg = '';
  switch (errorCode) {
    case 400:
      errorMsg = 'there is likely something wrong with the URL for this request.';
      break;
    case 401:
      errorMsg = 'there is a problem with authorization for this request.';
      break;
    case 403:
      errorMsg = 'there is a problem with authentication for this request.';
      break;
    case 404:
      errorMsg = 'there was nothing found for this request.';
      break;
    default:
      errorMsg = 'there was an unknown problem for this request.';
  }
  statusAlert.className = 'alert alert-danger';
  statusText.textContent = 'Error - ' + errorMsg;
  clearStatusIcon();

  const errorIcon = document.createElement('i');
  errorIcon.classList.add('bi', 'bi-exclamation-octagon');
  statusIcon.appendChild(errorIcon);
}

function setLoadingStatus() {
  statusAlert.className = 'alert alert-primary';
  statusText.textContent = 'Loading...';
  clearStatusIcon();

  const spinner = document.createElement('div');
  spinner.classList.add('spinner-border', 'spinner-border-sm');
  statusIcon.appendChild(spinner);
}

function clearStatusIcon() {
  statusIcon.textContent = '';
  while (statusIcon.firstChild) {
    statusIcon.firstChild.remove();
  }
}

function checkValidUrl(url) {
  if (!url || url.length > 2000) {
    return false;
  }
  const urlPattern = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  return !!urlPattern.test(url);
}

function checkValidImg(url) {
  const urlImgPattern = /\.(apng|avif|gif|jpg|jpeg|jfif|pjpeg|pjp|png|svg|webp)$/;
  return urlImgPattern.test(url);
}

function displayApiData(data, parentContainer) {
  for (const [key, val] of Object.entries(data)) {
    const item = document.createElement('div');
    item.classList.add('border', 'border-dark', 'rounded', 'm-2', 'bg-dark-subtle');
    item.classList.add(parentContainer.classList.contains('row') ? 'col' : 'row');
    parentContainer.appendChild(item);

    if (val && typeof val === 'object') {
      item.classList.add('p-2', 'border-3');
      const itemTitle = document.createElement('div');
      itemTitle.classList.add('fw-bold', 'fs-3')
      if (item.classList.contains('col')) {
        const itemTitleSubContainer = document.createElement('div');
        itemTitleSubContainer.classList.add('row');

        const itemSubTitle = document.createElement('div');
        itemSubTitle.classList.add('col-12');
        itemSubTitle.textContent = key + ':';

        itemTitleSubContainer.appendChild(itemSubTitle);
        itemTitle.appendChild(itemTitleSubContainer);
      } else {
        itemTitle.classList.add('col-12');
        itemTitle.textContent = key + ': ';
      }
      item.appendChild(itemTitle);

      if (Array.isArray(val)) {
        if (!val.length) {
        const  valContent = document.createElement('span');
        valContent.classList.add('bg-secondary', 'text-light', 'px-2', 'rounded');
        valContent.textContent = 'NULL';
        itemTitle.appendChild(valContent);
        }
        for (const newKey of val) {
          if (item.classList.contains('row')) {
            const subItem = document.createElement('div');
            subItem.classList.add('col', 'border', 'border-3', 'border-dark', 'rounded');
            item.appendChild(subItem);
            displayApiData(newKey, subItem);
          } else {
            displayApiData(newKey, item);
          }
        }
      } else {
        displayApiData(val, item);
      }
    } else {
      const keyText = document.createElement('span');
      keyText.classList.add('fw-bold');
      keyText.textContent = key + ' = ';

      let valContent;
      if (val === null || val === undefined || val === '') {
        valContent = document.createElement('span');
        valContent.classList.add('bg-secondary', 'text-light', 'px-2', 'rounded')
        valContent.textContent = 'NULL';
      } else if (checkValidUrl(val)) {
        if (checkValidImg(val)) {
          valContent = document.createElement('img');
          valContent.setAttribute('src', val);
        } else {
          valContent = document.createElement('a');
          valContent.setAttribute('href', val);
          valContent.setAttribute('target', '_blank');
          valContent.classList.add('link-primary');
          valContent.textContent = val;
        }
      } else {
        valContent = document.createElement('span');
        valContent.textContent = val.toString();
      }

      if (item.classList.contains('row')) {
        const subItem = document.createElement('div');
        subItem.classList.add('col');
        subItem.appendChild(keyText);
        subItem.appendChild(valContent);
        item.appendChild(subItem);
      } else {
        item.appendChild(keyText);
        item.appendChild(valContent);
      }
    }
  }
}

function removeAllContent() {
  while (contentArea.firstChild) {
    contentArea.firstChild.remove();
  }
}
