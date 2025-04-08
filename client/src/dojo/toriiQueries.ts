import { ClauseBuilder, KeysClause, MemberClause, SchemaType, SDK, ToriiQueryBuilder } from "@dojoengine/sdk";
import { ModelsMapping } from "./generated/models.gen";
import { addAddressPadding, CairoCustomEnum } from "starknet";

function getQueryPlayer(accountAdrs: string) {
  return new ToriiQueryBuilder()
  .withClause(
      KeysClause(
          [],
          [addAddressPadding(accountAdrs)],
          "VariableLen"
      ).build()
  ).includeHashedKeys()
}

function getAccountFixedLenQuery(accountAdrs: string) {
  return new ToriiQueryBuilder()
  .withClause(KeysClause([], [addAddressPadding(accountAdrs)], "FixedLen").build()).includeHashedKeys()
  .withEntityModels(["game-Account"])
}

function getAccountVariableLenQuery(accountAdrs: string) {
  return new ToriiQueryBuilder()
  .withClause(KeysClause([], [addAddressPadding(accountAdrs)], "VariableLen").build()).includeHashedKeys()
  .withEntityModels(["game-AccountQuests", "game-MapProgress", "game-Runes", "game-Heroes"])
}

function getUndefinedKeysQuery() {
  return new ToriiQueryBuilder()
  .withClause(KeysClause([], [undefined], "VariableLen").build()).includeHashedKeys()
  .withEntityModels(["game-Config", "game-GlobalQuests", "game-ArenaAccount", "game-ArenaTeam"])
}

function getGlobalQuestsQuery() {
  return new ToriiQueryBuilder()
  .withClause(KeysClause([], [undefined], "VariableLen").build())
  .withEntityModels(["game-GlobalQuests"])
}

function getConfigQuery() {
  return new ToriiQueryBuilder()
  .withClause(KeysClause([], [undefined], "VariableLen").build())
  .withEntityModels(["game-Config"])
}

function getAccountQuestsQuery(accountAdrs: string) {
  return new ToriiQueryBuilder()
  .withClause(KeysClause([ModelsMapping.AccountQuests], [accountAdrs], "VariableLen").build())
}

function getAccountQuery(accountAdrs: string) {
  return new ToriiQueryBuilder()
  .withClause(KeysClause([ModelsMapping.Account], [addAddressPadding(accountAdrs)], "FixedLen").build()).includeHashedKeys()
}

function getRunesQuery(accountAdrs: string) {
  return new ToriiQueryBuilder()
  .withClause(KeysClause([ModelsMapping.Runes], [accountAdrs], "VariableLen").build())
}

function getMapProgressQuery(accountAdrs: string) {
  return new ToriiQueryBuilder()
  .withClause(KeysClause([ModelsMapping.MapProgress], [accountAdrs], "VariableLen").build())
}

function getArenaAccountQuery() {
  return new ToriiQueryBuilder()
  .withClause(KeysClause([], [undefined], "VariableLen").build())
  .withEntityModels(["game-ArenaAccount"])
}

function getArenaTeamQuery() {
  return new ToriiQueryBuilder()
  .withClause(KeysClause([], [undefined], "VariableLen").build())
  .withEntityModels(["game-ArenaTeam"])
}

function getHeroesQuery() {
  return new ToriiQueryBuilder()
  .withClause(KeysClause([], [undefined], "VariableLen").build())
  .withEntityModels(["game-Heroes"])
}

function getEventsQuery(accountAdrs: string) {
  return new ToriiQueryBuilder()
  .withClause(KeysClause([], [addAddressPadding(accountAdrs)], "VariableLen").build())
  .includeHashedKeys()
}

export { getQueryPlayer, getGlobalQuestsQuery, getAccountQuestsQuery, getConfigQuery, getAccountQuery, getRunesQuery, getMapProgressQuery, getArenaAccountQuery, getArenaTeamQuery, getHeroesQuery, getAccountFixedLenQuery, getAccountVariableLenQuery, getUndefinedKeysQuery, getEventsQuery };
