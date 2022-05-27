export function processCommandCalculations(commands: Command[]) {
  const amounts: { name: string; characters: number }[] = [];

  for (const command of commands) {
    const characters = calculateCharacters(command);
    if (characters > 4000) console.warn(`Command ${command.name} is ${characters} characters long. Max is 4000.`);

    amounts.push({ name: command.name, characters });
  }

  console.table(amounts.sort((a, b) => b.characters - a.characters), ["name", "characters"]);
}

function calculateCharacters(command: Command) {
  let characters = 0;

  // Count the characters in the commands name
  characters += Math.max(
    [...command.name].length,
    ...Object.values(command.name_localizations ?? {}).map((name) => [...name].length),
  );
  // Count the characters in the command description
  characters += Math.max(
    [...command.description].length,
    ...Object.values(command.description_localizations ?? {}).map((name) => [...name].length),
  );

  for (const option of command.options ?? []) {
    characters += calculateCharactersInOption(option);
  }

  return characters;
}

function calculateCharactersInOption(option: Option) {
  let characters = 0;

  // Count the characters in the option name
  characters += Math.max(
    [...option.name].length,
    ...Object.values(option.name_localizations ?? {}).map((name) => [...name].length),
  );
  // Count the characters in the option description
  characters += Math.max(
    [...option.description].length,
    ...Object.values(option.description_localizations ?? {}).map((name) => [...name].length),
  );

  // Count the characters in the option choices
  for (const choice of option.choices ?? []) {
    characters += Math.max(
      [...choice.name].length,
      ...Object.values(choice.name_localizations ?? {}).map((name) => [...name].length),
    );

    characters += [...choice.value.toString()].length;
  }

  // Count the characters in the sub-options
  for (const subOption of option.options ?? []) {
    characters += calculateCharactersInOption(subOption);
  }

  return characters;
}

/**
 * BELOW HERE ARE TYPINGS
 */

interface Command {
  type: number;
  dm_permission?: boolean;
  name_localizations?: Record<string, string>;
  description_localizations?: Record<string, string>;
  id?: string;
  name: string;
  description: string;
  options?: Option[];
}

interface Choice {
  name: string;
  value: string | number;
  name_localizations?: Record<string, string>;
}

interface Option {
  name: string;
  description: string;
  type: number;
  choices?: Choice[];
  options?: Option[];
  name_localizations?: Record<string, string>;
  description_localizations?: Record<string, string>;
  required?: boolean;
  channel_types?: number[];
}
