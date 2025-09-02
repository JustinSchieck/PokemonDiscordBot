import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { getPokemonByName } from "../../src/services/pokedex";

// Mock fetch globally
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe("Pokemon Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch Pokemon data successfully", async () => {
    const mockPokemonData = {
      name: "pikachu",
      id: 25,
      height: 4,
      weight: 60,
      types: [{ type: { name: "electric" } }],
      abilities: [{ ability: { name: "static" } }],
      stats: [{ stat: { name: "hp" }, base_stat: 35 }],
      sprites: { front_default: "https://example.com/pikachu.png" },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPokemonData),
    } as Response);

    const result = await getPokemonByName("pikachu");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://pokeapi.co/api/v2/pokemon/pikachu"
    );
    expect(result).toEqual({
      name: "pikachu",
      id: 25,
      height: 4,
      weight: 60,
      types: ["electric"],
      abilities: ["static"],
      stats: [{ name: "hp", value: 35 }],
      sprite: "https://example.com/pikachu.png",
    });
  });

  it("should handle 404 errors", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    const result = await getPokemonByName("fakemon");

    expect(result).toEqual({
      error: "Pokemon not found! Please check the spelling.",
    });
  });
});
