async function fetchData() {
  try {
    const response = await fetch(
      "http://just-search-backend-wwr9tm-49e30a-72-60-222-63.traefik.me",
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    console.log(response);
    return response;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

fetchData();
