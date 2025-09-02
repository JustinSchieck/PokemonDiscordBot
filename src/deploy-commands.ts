import { REST, Routes } from "discord.js";
import config from "./config.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Get __dirname equivalent in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands: any[] = [];
const foldersPath = path.join(__dirname, "commands");

// Check if we're in src (development) or dist (production)
const isDevMode = __dirname.includes("src");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);

  if (!fs.existsSync(commandsPath)) {
    console.log(`Folder ${commandsPath} does not exist, skipping...`);
    continue;
  }

  const commandFiles = fs.readdirSync(commandsPath).filter((file) => {
    return isDevMode ? file.endsWith(".ts") : file.endsWith(".js");
  });

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);

    try {
      // Dynamic import for ES6 modules
      const command = await import(`file://${filePath}`);

      // Access default export
      const commandModule = command.default || command;

      if ("data" in commandModule && "execute" in commandModule) {
        commands.push(commandModule.data.toJSON());
        console.log(`Loaded command: ${commandModule.data.name}`);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    } catch (error) {
      console.error(`Error loading command from ${filePath}:`, error);
    }
  }
}

if (commands.length === 0) {
  console.error(
    "No commands found! Make sure your command files are in the correct location."
  );
  process.exit(1);
}

const rest = new REST().setToken(config.token);

try {
  console.log(
    `Started refreshing ${commands.length} application (/) commands.`
  );

  // Clear commands first
  await rest.put(
    Routes.applicationGuildCommands(config.clientId, config.guildId),
    {
      body: [],
    }
  );

  console.log("🧹 Cleared all commands");

  const data = (await rest.put(
    Routes.applicationGuildCommands(config.clientId, config.guildId),
    {
      body: commands,
    }
  )) as any[];

  console.log(`Successfully reloaded ${data.length} application (/) commands.`);
} catch (error) {
  console.error("Error during deployment:", error);
}
