import axios from "axios";

const URL = 'https://pixabay.com/api/';
const KEY = '36887899-b6f08170954c6b31d1ca82471'


export async function getURL(options) {
    const parameters = new URLSearchParams(options);
    const images = await axios.get(`${URL}?key=${KEY}&${parameters}`)

    return images.data
}
// getURL()

// https://pixabay.com/api/?key=36887899-b6f08170954c6b31d1ca82471
