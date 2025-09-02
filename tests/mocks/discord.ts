import { jest } from "@jest/globals";

// Mock User
export const createMockUser = (overrides: any = {}) => ({
  id: "123456789012345678",
  username: "testuser",
  discriminator: "1234",
  tag: "testuser#1234",
  bot: false,
  avatar: null,
  createdTimestamp: Date.now(),
  displayAvatarURL: jest.fn(
    () => "https://cdn.discordapp.com/avatars/123/avatar.png"
  ),
  toString: jest.fn(() => "<@123456789012345678>"),
  ...overrides,
});

// Mock Guild
export const createMockGuild = (overrides: any = {}) => ({
  id: "987654321098765432",
  name: "Test Server",
  memberCount: 100,
  ownerId: "111222333444555666",
  preferredLocale: "en-US",
  verificationLevel: 0,
  premiumTier: 0,
  premiumSubscriptionCount: 0,
  createdTimestamp: Date.now(),
  channels: {
    cache: new Map(),
  },
  emojis: {
    cache: new Map(),
  },
  roles: {
    cache: new Map(),
  },
  members: {
    cache: new Map(),
  },
  iconURL: jest.fn(() => "https://cdn.discordapp.com/icons/987/icon.png"),
  fetch: jest.fn(),
  ...overrides,
});

// Mock TextChannel
export const createMockTextChannel = (overrides: any = {}) => ({
  id: "555666777888999000",
  name: "general",
  type: 0, // GUILD_TEXT
  guild: createMockGuild(),
  send: jest.fn(),
  createMessageCollector: jest.fn(() => createMockMessageCollector()),
  isTextBased: jest.fn(() => true),
  isDMBased: jest.fn(() => false),
  ...overrides,
});

// Mock Message
export const createMockMessage = (overrides: any = {}) => ({
  id: "777888999000111222",
  content: "test message",
  author: createMockUser(),
  guild: createMockGuild(),
  channel: createMockTextChannel(),
  createdTimestamp: Date.now(),
  reply: jest.fn(),
  edit: jest.fn(),
  delete: jest.fn(),
  ...overrides,
});

// Mock MessageCollector
export const createMockMessageCollector = () => {
  const collector = {
    on: jest.fn(),
    stop: jest.fn(),
    ended: false,
    createdTimestamp: Date.now(),
    lastCollectedTimestamp: null,
    endReason: null,
  };

  // Make it behave like EventEmitter
  const events: { [key: string]: Function[] } = {};

  // Add custom event handler for tests
  (collector as any).addListener = (event: string, listener: Function) => {
    if (!events[event]) events[event] = [];
    events[event].push(listener);
    return collector;
  };

  // Add utility to trigger events in tests
  (collector as any).emit = (event: string, ...args: any[]) => {
    if (events[event]) {
      events[event].forEach((listener) => listener(...args));
    }
  };

  return collector;
};

// Mock SlashCommandBuilder
export const createMockSlashCommandBuilder = () => ({
  setName: jest.fn().mockReturnThis(),
  setDescription: jest.fn().mockReturnThis(),
  addStringOption: jest.fn().mockReturnThis(),
  addIntegerOption: jest.fn().mockReturnThis(),
  addBooleanOption: jest.fn().mockReturnThis(),
  toJSON: jest.fn(() => ({
    name: "test-command",
    description: "Test command description",
    options: [],
  })),
});

// Mock EmbedBuilder
export const createMockEmbedBuilder = () => ({
  setColor: jest.fn().mockReturnThis(),
  setTitle: jest.fn().mockReturnThis(),
  setDescription: jest.fn().mockReturnThis(),
  setImage: jest.fn().mockReturnThis(),
  setThumbnail: jest.fn().mockReturnThis(),
  addFields: jest.fn().mockReturnThis(),
  setFooter: jest.fn().mockReturnThis(),
  setTimestamp: jest.fn().mockReturnThis(),
  toJSON: jest.fn(() => ({})),
});

// Mock AttachmentBuilder
export const createMockAttachmentBuilder = () => ({
  name: "test-attachment.png",
  attachment: Buffer.from("test"),
});

// Mock ChatInputCommandInteraction
export const createMockInteraction = (overrides: any = {}) => {
  const interaction = {
    id: "999000111222333444",
    user: createMockUser(),
    guild: createMockGuild(),
    channel: createMockTextChannel(),
    commandName: "test-command",
    deferReply: jest.fn(),
    reply: jest.fn(),
    editReply: jest.fn(),
    followUp: jest.fn(),
    deleteReply: jest.fn(),
    replied: false,
    deferred: false,
    ephemeral: false,
    options: {
      getString: jest.fn(),
      getInteger: jest.fn(),
      getBoolean: jest.fn(),
      getUser: jest.fn(),
      getChannel: jest.fn(),
    },
    isChatInputCommand: jest.fn(() => true),
    isButton: jest.fn(() => false),
    isSelectMenu: jest.fn(() => false),
    ...overrides,
  };

  // Make deferReply set deferred to true
  interaction.deferReply = jest.fn(() => {
    interaction.deferred = true;
    return Promise.resolve();
  });

  // Make reply set replied to true
  interaction.reply = jest.fn(() => {
    interaction.replied = true;
    return Promise.resolve();
  });

  return interaction;
};

// Mock Client
export const createMockClient = (overrides: any = {}) => ({
  user: createMockUser({ bot: true, username: "TestBot" }),
  guilds: {
    cache: new Map(),
  },
  channels: {
    cache: new Map(),
  },
  users: {
    cache: new Map(),
  },
  on: jest.fn(),
  once: jest.fn(),
  emit: jest.fn(),
  login: jest.fn(),
  destroy: jest.fn(),
  isReady: jest.fn(() => true),
  ...overrides,
});

// Mock Collection
export const createMockCollection = (entries: [string, any][] = []) => {
  const map = new Map(entries);
  return {
    ...map,
    first: jest.fn(() => map.values().next().value),
    last: jest.fn(() => Array.from(map.values()).pop()),
    random: jest.fn(() => {
      const values = Array.from(map.values());
      return values[Math.floor(Math.random() * values.length)];
    }),
    find: jest.fn((fn: (value: any, index: number, obj: any[]) => unknown) =>
      Array.from(map.values()).find(fn)
    ),
    filter: jest.fn(
      (fn: (value: any, index: number, array: any[]) => unknown) =>
        Array.from(map.values()).filter(fn)
    ),
    map: jest.fn((fn: (value: any, index: number, array: any[]) => unknown) =>
      Array.from(map.values()).map(fn)
    ),
  };
};
