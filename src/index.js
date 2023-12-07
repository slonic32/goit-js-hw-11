import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { throttle } from 'lodash';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('div.gallery');
const moreButton = document.querySelector('button.load-more');
let currentPage = 1;
let maxPage = 1;
let searchQuery = '';
let firstSearch = true;

moreButton.style.display = 'none';

let galleryLightbox = new SimpleLightbox('.gallery a');

searchForm.addEventListener('submit', startSearch);
moreButton.addEventListener('click', showMore);

async function startSearch(event) {
  event.preventDefault();
  moreButton.style.display = 'none';
  gallery.innerHTML = '';
  searchQuery = searchForm.elements.searchQuery.value;
  Notiflix.Loading.circle('Searching...');
  try {
    const images = await axios.get('', {
      params: {
        key: '41109896-77818a6e9b7c144f2b3908a2d',
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: '40',
        q: searchQuery,
      },
    });
  } catch (error) {
    Notiflix.Loading.remove();
    Notiflix.Notify.failure(error);
  }
  Notiflix.Loading.remove();
  currentPage = 1;
  maxPage = Math.ceil(images.data.totalHits / 40);
  drawGallery(images.data.hits);
  moreButton.style.display = '';
  if (!firstSearch) {
    Notiflix.Notify.info(`Hooray! We found ${images.data.totalHits} images.`);
  }

  firstSearch = false;
}

function drawGallery(images) {
  if (images.length === 0) {
    Notiflix.Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    const imagegallery = [];
    images.forEach(image => {
      imagegallery.push(`
      <div class="photo-card">
      <a href="${image.largeImageURL}">
  <img src="${image.webformatURL}" alt="${image.tags}" url="${image.largeImageURL}" loading="lazy" width="240px" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b><br/>${image.likes}
    </p>
    <p class="info-item">
      <b>Views</b><br/>${image.views}
    </p>
    <p class="info-item">
      <b>Comments</b><br/>${image.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b><br/>${image.downloads}
    </p>
  </div>
  </a>
</div>
`);
    });
    gallery.insertAdjacentHTML('beforeend', imagegallery.join(''));
    galleryLightbox.refresh();
  }
}

async function showMore(event) {
  event.preventDefault();
  currentPage++;
  if (currentPage > maxPage) {
    moreButton.style.display = 'none';
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    Notiflix.Loading.circle('Searching...');

    try {
      const images = await axios.get('', {
        params: {
          key: '41109896-77818a6e9b7c144f2b3908a2d',
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: 'true',
          per_page: '40',
          page: currentPage,
          q: searchQuery,
        },
      });
    } catch (error) {
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(error);
    }
    Notiflix.Loading.remove();
    drawGallery(images.data.hits);
  }
}
