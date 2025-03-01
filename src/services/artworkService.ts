
const BASE_API_URL = 'https://staging.pedpelop.gr/wp-json/hotspot/v1/get_hotspot';

/**
 * Fetches artwork data by ID from the API
 */
export const fetchArtworkById = async (id: number) => {
  const response = await fetch(`${BASE_API_URL}/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP Error! Status: ${response.status}`);
  }

  return response.json();
};
