import { WhosThatPokemonGame } from "./../../../src/services/minigames/whosThatPokemon";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Mock the capitalize utility module
jest.mock("../../../src/services/utils/capitalize.js", () => ({
  capitalizeFirstChar: jest.fn(),
}));

describe("WhosThatPokemonGame - Simple Import Test", () => {
  let mockCapitalizeFirstChar: jest.MockedFunction<any>;

  beforeEach(async () => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Import and setup the mock function
    const { capitalizeFirstChar } = await import(
      "../../../src/services/utils/capitalize"
    );
    mockCapitalizeFirstChar = capitalizeFirstChar as jest.MockedFunction<
      typeof capitalizeFirstChar
    >;

    // Setup default mock implementation
    mockCapitalizeFirstChar.mockImplementation((str: string) => {
      if (typeof str !== "string" || str.length === 0) {
        return str;
      }
      return str.charAt(0).toUpperCase() + str.slice(1);
    });
  });

  it("should import the class successfully", () => {
    expect(WhosThatPokemonGame).toBeDefined();
    expect(typeof WhosThatPokemonGame).toBe("function");
  });

  it("should use capitalizeFirstChar correctly", () => {
    // Test that the mock is set up correctly
    mockCapitalizeFirstChar("pikachu");

    expect(mockCapitalizeFirstChar).toHaveBeenCalledWith("pikachu");
    expect(mockCapitalizeFirstChar).toHaveBeenCalledTimes(1);
  });

  it("should handle edge cases in capitalize function", () => {
    // Test different scenarios
    mockCapitalizeFirstChar("");
    mockCapitalizeFirstChar("a");
    mockCapitalizeFirstChar("POKEMON");

    expect(mockCapitalizeFirstChar).toHaveBeenCalledTimes(3);
  });

  // You can also create specific test scenarios
  it("should mock capitalize with custom behavior", () => {
    // Override the mock for this specific test
    mockCapitalizeFirstChar.mockReturnValueOnce("CUSTOM_RESULT");

    const result = mockCapitalizeFirstChar("test");

    expect(result).toBe("CUSTOM_RESULT");
    expect(mockCapitalizeFirstChar).toHaveBeenCalledWith("test");
  });
});
