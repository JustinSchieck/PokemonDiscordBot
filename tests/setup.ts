import { jest } from "@jest/globals";

// Mock fetch globally
global.fetch = jest.fn(
  async (
    input: RequestInfo | URL | string | Request,
    init?: RequestInit
  ): Promise<Response> => {
    return {
      ok: true,
      status: 200,
      json: async () => ({}),
      text: async () => "",
      // Add other Response properties/methods as needed for your tests
    } as unknown as Response;
  }
);

// Setup global test utilities
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

// Mock Canvas for image processing tests
jest.mock("canvas", () => ({
  createCanvas: jest.fn(() => ({
    getContext: jest.fn(() => ({
      drawImage: jest.fn(),
      getImageData: jest.fn(() => ({
        data: new Uint8ClampedArray(400),
      })),
      putImageData: jest.fn(),
    })),
    toBuffer: jest.fn(() => Buffer.from("mock-image-buffer")),
    width: 100,
    height: 100,
  })),
  loadImage: jest.fn(() =>
    Promise.resolve({
      width: 100,
      height: 100,
    })
  ),
}));

// Mock Discord.js components globally
jest.mock("discord.js", () => {
  const actual = jest.requireActual("discord.js");
  return {
    ...(actual as object),
    Client: jest.fn(),
    SlashCommandBuilder: jest.fn(() => ({
      setName: jest.fn().mockReturnThis(),
      setDescription: jest.fn().mockReturnThis(),
      addStringOption: jest.fn().mockReturnThis(),
      toJSON: jest.fn(() => ({})),
    })),
    EmbedBuilder: jest.fn(() => ({
      setColor: jest.fn().mockReturnThis(),
      setTitle: jest.fn().mockReturnThis(),
      setDescription: jest.fn().mockReturnThis(),
      setImage: jest.fn().mockReturnThis(),
      addFields: jest.fn().mockReturnThis(),
      setFooter: jest.fn().mockReturnThis(),
      setTimestamp: jest.fn().mockReturnThis(),
    })),
    AttachmentBuilder: jest.fn(),
    MessageCollector: jest.fn(),
  };
});
