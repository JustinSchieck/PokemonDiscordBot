export const mockPikachuData = {
  name: "pikachu",
  id: 25,
  height: 4,
  weight: 60,
  types: [{ type: { name: "electric" } }],
  abilities: [
    { ability: { name: "static" } },
    { ability: { name: "lightning-rod" } },
  ],
  stats: [
    { stat: { name: "hp" }, base_stat: 35 },
    { stat: { name: "attack" }, base_stat: 55 },
    { stat: { name: "defense" }, base_stat: 40 },
    { stat: { name: "special-attack" }, base_stat: 50 },
    { stat: { name: "special-defense" }, base_stat: 50 },
    { stat: { name: "speed" }, base_stat: 90 },
  ],
  sprites: {
    front_default:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
  },
};

export const mockCharmanderData = {
  name: "charmander",
  id: 4,
  height: 6,
  weight: 85,
  types: [{ type: { name: "fire" } }],
  abilities: [
    { ability: { name: "blaze" } },
    { ability: { name: "solar-power" } },
  ],
  stats: [
    { stat: { name: "hp" }, base_stat: 39 },
    { stat: { name: "attack" }, base_stat: 52 },
    { stat: { name: "defense" }, base_stat: 43 },
    { stat: { name: "special-attack" }, base_stat: 60 },
    { stat: { name: "special-defense" }, base_stat: 50 },
    { stat: { name: "speed" }, base_stat: 65 },
  ],
  sprites: {
    front_default:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
  },
};

export const mockPokemonError = {
  error: "Pokemon not found! Please check the spelling.",
};

export const createMockFetchResponse = (
  data: any,
  ok = true,
  status = 200
) => ({
  ok,
  status,
  json: () => Promise.resolve(data),
});
