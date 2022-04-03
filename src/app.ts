import axios from 'axios';

console.log('Location app starts...');
const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;

const GOOGLE_API_KEY = 'INSERTYOURGOOGLEMAPSAPIKEY';

// custom type for google geo coding
type GoogleGeoCodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: 'OK' | 'ZERO_RESULTS';
};

function seearchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  // third party api or google api
  axios
    .get<GoogleGeoCodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${GOOGLE_API_KEY}`
    )
    .then((response) => {
      if (response.data.status !== 'OK') {
        throw new Error('Could not find location');
      }

      const coordinates = response.data.results[0].geometry.location;
      const map = new google.maps.Map(
        document.getElementById('map') as HTMLElement,
        {
          center: coordinates,
          zoom: 8,
        }
      );
      new google.maps.Marker({ position: coordinates, map: map });
    })
    .catch((err) => {
      alert(err.message);
    });
}

form.addEventListener('submit', seearchAddressHandler);
