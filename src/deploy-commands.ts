import { REST, Routes } from "discord.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

// Get __dirname equivalent in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const commands: any[] = [];

// Check if we're in src (development) or dist (production)
const isDevMode = __dirname.includes("src");
const foldersPath = isDevMode
  ? path.join(__dirname, "commands")
  : path.join(__dirname, "commands");

console.log(`Running in ${isDevMode ? "development" : "production"} mode`);
console.log(`Looking for commands in: ${foldersPath}`);

// Ensure the commands directory exists
if (!fs.existsSync(foldersPath)) {
  console.error(`Commands directory does not exist: ${foldersPath}`);
  process.exit(1);
}

const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);

  if (
    !fs.existsSync(commandsPath) ||
    !fs.statSync(commandsPath).isDirectory()
  ) {
    console.log(`Skipping ${commandsPath} - not a directory`);
    continue;
  }

  const commandFiles = fs.readdirSync(commandsPath).filter((file) => {
    const isValidFile = isDevMode ? file.endsWith(".ts") : file.endsWith(".js");
    console.log(`Checking file: ${file} - Valid: ${isValidFile}`);
    return isValidFile;
  });

  console.log(`Found ${commandFiles.length} command files in ${folder}`);

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);

    try {
      // Dynamic import for ES6 modules
      const command = await import(`file://${filePath}`);

      // Access default export
      const commandModule = command.default || command;

      if ("data" in commandModule && "execute" in commandModule) {
        commands.push(commandModule.data.toJSON());
        console.log(
          `✅ Loaded command: ${commandModule.data.name} from ${file}`
        );
      } else {
        console.log(
          `⚠️ [WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    } catch (error) {
      console.error(`❌ Error loading command from ${filePath}:`, error);
    }
  }
}

if (commands.length === 0) {
  console.error(
    "No commands found! Make sure your command files are in the correct location."
  );
  process.exit(1);
}

console.log("token: ", process.env.DISCORD_TOKEN);

const rest = new REST().setToken(process.env.DISCORD_TOKEN ?? "");

try {
  console.log(
    `Started refreshing ${commands.length} application (/) commands.`
  );

  // Clear both guild AND global commands
  console.log("🧹 Clearing guild commands...");
  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID || "",
      process.env.GUILD_ID || ""
    ),
    {
      body: [],
    }
  );

  console.log("🧹 Clearing global commands...");
  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID || ""), {
    body: [],
  });

  console.log("🧹 All commands cleared, waiting 2 seconds...");
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const data = (await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID || "",
      process.env.GUILD_ID || ""
    ),
    {
      body: commands,
    }
  )) as any[];

  console.log(`Successfully reloaded ${data.length} application (/) commands.`);
} catch (error) {
  console.error("Error during deployment:", error);
}
