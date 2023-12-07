import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getImages } from './service-api';

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
  galleryLightbox.refresh();
  searchQuery = searchForm.elements.searchQuery.value;
  currentPage = 1;
  Notiflix.Loading.circle('Searching...');
  try {
    const images = await getImages(searchQuery, currentPage);
    Notiflix.Loading.remove();
    maxPage = Math.ceil(images.totalHits / 40);
    if (images.totalHits === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      drawGallery(images.hits);
      if (currentPage < maxPage) {
        moreButton.style.display = '';
      }
    }
    if (!firstSearch) {
      Notiflix.Notify.info(`Hooray! We found ${images.totalHits} images.`);
    }
  } catch (error) {
    Notiflix.Loading.remove();
    Notiflix.Notify.failure(error.message);
  }
  firstSearch = false;
}

function drawGallery(images) {
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
      const images = await getImages(searchQuery, currentPage);
      Notiflix.Loading.remove();
      drawGallery(images.hits);
    } catch (error) {
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(error.message);
    }
  }
}
