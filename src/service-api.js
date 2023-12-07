import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

async function getImages(searchQuery, currentPage) {
  try {
    const result = await axios.get('', {
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
    return result.data;
  } catch (error) {
    throw error;
  }
}

export { getImages };
