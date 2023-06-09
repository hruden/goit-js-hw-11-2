// import './js/api';
import { getURL } from './js/api';
import { createMarkup } from './js/createMarkup';
import { btnUp } from './js/btnUp';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryEl = document.querySelector('.gallery');
const searchFormEL = document.getElementById('search-form');
const target = document.querySelector('.js-guard');
let gallery;
let totalHits = 0;

const options = {
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
  page: 0,
};

let optionsObserver = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, optionsObserver);

searchFormEL.addEventListener('submit', onFormSubmit);

function onFormSubmit(evt) {
  evt.preventDefault();

  galleryEl.innerHTML = '';
  options.q = searchFormEL.firstElementChild.value.trim();
  observer.unobserve(target);
  options.page = 1;

  getURL(options)
    .then(img => {
      if (img.length === 0 || options.q === '') {
        Notiflix.Notify.failure('Search query is empty');
      } else {
        options.page = 1;
        galleryEl.insertAdjacentHTML('beforeend', createMarkup(img));
        observer.observe(target)
        totalHits = img.totalHits;
        if(totalHits !== 0){
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        }
        gallery = new SimpleLightbox('a', {
          showCounter: false,
          captions: true,
          captionsData: 'alt',
          captionDelay: 300,
        }).refresh();
      }
    })
    .catch(err => console.error(err));

  searchFormEL.reset();
}

function onLoad(entries) {
  entries.forEach((entry) => {
    if(totalHits === 0){
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return
    }
    else if(entry.isIntersecting){
      if (Math.ceil(totalHits / options.per_page) <= options.page){
        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.")
        return
      }
      else {      
        options.page += 1;
        getURL(options)
          .then(img => {
            galleryEl.insertAdjacentHTML('beforeend', createMarkup(img));
            gallery.refresh();
            smoothScrolling();
          })
          .catch(err => console.error(err));    
        }}
  })
}

function smoothScrolling() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
}

btnUp.addEventListener();