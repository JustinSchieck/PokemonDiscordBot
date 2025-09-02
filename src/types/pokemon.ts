export interface PokemonData {
  name: string;
  id: number;
  height: number;
  weight: number;
  types: string[];
  abilities: string[];
  stats: PokemonStat[];
  sprite: string;
}

export interface PokemonStat {
  name: string;
  value: number;
}

export interface PokemonApiResponse {
  name: string;
  id: number;
  height: number;
  weight: number;
  types: Array<{ type: { name: string } }>;
  abilities: Array<{ ability: { name: string } }>;
  stats: Array<{ stat: { name: string }; base_stat: number }>;
  sprites: { front_default: string };
}
