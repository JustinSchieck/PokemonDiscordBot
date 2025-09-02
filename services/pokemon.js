async function getPokemonByName(pokemonName) {
  const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      if (response.status === 404) {
        return { error: "Pokemon not found! Please check the spelling." };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      name: data.name,
      id: data.id,
      height: data.height,
      weight: data.weight,
      types: data.types.map((type) => type.type.name),
      abilities: data.abilities.map((ability) => ability.ability.name),
      stats: data.stats.map((stat) => ({
        name: stat.stat.name,
        value: stat.base_stat,
      })),
      sprite: data.sprites.front_default,
    };
  } catch (error) {
    console.error("Error fetching the pokemon:", error);
    return { error: "Failed to fetch Pokemon data. Please try again." };
  }
}

module.exports = { getPokemonByName };
