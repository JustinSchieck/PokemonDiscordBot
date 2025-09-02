import { jest } from "@jest/globals";
import {
  ChatInputCommandInteraction,
  User,
  Guild,
  TextChannel,
} from "discord.js";

export const createMockInteraction = (
  overrides: Partial<ChatInputCommandInteraction> = {}
) => {
  const mockUser: any = {
    id: "123456789",
    username: "testuser",
    bot: false,
  };

  const mockGuild: any = {
    id: "987654321",
    name: "Test Server",
  };

  const mockChannel: any = {
    id: "555666777",
    createMessageCollector: jest.fn(),
  };

  return {
    deferReply: jest.fn(),
    editReply: jest.fn(),
    followUp: jest.fn(),
    reply: jest.fn(),
    user: mockUser,
    guild: mockGuild,
    channel: mockChannel,
    options: {
      getString: jest.fn(),
    },
    ...overrides,
  } as unknown as ChatInputCommandInteraction;
};
