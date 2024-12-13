const BASE_URL = "https://pokeapi.co/api/v2/";
let offset = 0; // Keeps track of the offset for pagination
// Get all type buttons
const typeButtons = document.querySelectorAll('.btn-header');

// Function to fetch a batch of Pokémon
async function fetchPokemonBatch(limit = 20, offset = 0) {
    try {
        const response = await fetch(`${BASE_URL}pokemon?limit=${limit}&offset=${offset}`);
        if (!response.ok) throw new Error("Failed to fetch Pokémon");
        const data = await response.json();
        displayPokemonBatch(data.results); // Display the fetched Pokémon
    } catch (error) {
        console.error(error);
        alert("Could not fetch Pokémon. Please try again!");
    }
}

// Function to fetch and display details of a batch of Pokémon
async function displayPokemonBatch(pokemonList) {
    const section = document.getElementById("pokemon-container");

    for (const pokemon of pokemonList) {
        const pokemonData = await fetchPokemonDetails(pokemon.url);
        const pokemonCard = `
            <div class="pokemon-card">
                <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
                <h3>${pokemonData.name.toUpperCase()}</h3>
                <p>Type: ${pokemonData.types.map(type => type.type.name).join(", ")}</p>
            </div>
        `;
        section.innerHTML += pokemonCard;
    }
}

// Function to fetch details of a single Pokémon
async function fetchPokemonDetails(url) {
    const response = await fetch(url);
    return await response.json();
}

// Function to filter Pokémon by type
async function filterPokemonsByType(type) {
    const section = document.getElementById("pokemon-container");
    section.innerHTML = ""; // Clear existing Pokémon cards

    try {
        const response = await fetch(`${BASE_URL}type/${type}`);
        if (!response.ok) throw new Error("Failed to fetch Pokémon by type");
        const data = await response.json();

        const filteredPokemonList = data.pokemon.slice(0, 20); // Limit to 20 Pokémon
        for (const entry of filteredPokemonList) {
            const pokemonData = await fetchPokemonDetails(entry.pokemon.url);
            const pokemonCard = `
                <div class="pokemon-card">
                    <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
                    <h3>${pokemonData.name.toUpperCase()}</h3>
                    <p>Type: ${pokemonData.types.map(type => type.type.name).join(", ")}</p>
                </div>
            `;
            section.innerHTML += pokemonCard;
        }
    } catch (error) {
        console.error(error);
        alert("Could not fetch Pokémon by type. Please try again!");
    }
}

// Event listener for "Load More" button
document.getElementById("load-more").addEventListener("click", () => {
    offset += 20; // Increase offset by 20
    fetchPokemonBatch(20, offset);
});

// Add event listener to each type button
typeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const selectedType = button.id; // The type corresponds to the button ID
      if (selectedType === "ver-todos") {
          offset = 0;
          document.getElementById("pokemon-container").innerHTML = "";
          fetchPokemonBatch(20, offset);
      } else {
          filterPokemonsByType(selectedType);
      }
    });
  });
  

// Initial fetch when the page loads
fetchPokemonBatch(20, offset);
