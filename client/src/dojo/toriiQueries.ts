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

function getGlobalQuestsQuery() {
  return new ToriiQueryBuilder()
  .withClause(KeysClause([], [undefined], "VariableLen").build())
  .withEntityModels(["game-GlobalQuests"])
}

function getGlobalQuestsPlayerQuery(globalQuestsIds: string[]) {
  return new ToriiQueryBuilder()
  .withClause(KeysClause([], globalQuestsIds, "VariableLen").build())
  .withEntityModels(["game-AccountQuests"])
}

function getConfigQuery() {
  return new ToriiQueryBuilder()
  .withClause(KeysClause([], [undefined], "VariableLen").build())
  .withEntityModels(["game-Config"])
}

function getRunesQuery(accountAdrs: string) {
  return new ToriiQueryBuilder()
  .withClause(KeysClause([], [accountAdrs], "VariableLen").build())
  .withEntityModels(["game-Runes"])
}

export { getQueryPlayer, getGlobalQuestsQuery, getGlobalQuestsPlayerQuery, getConfigQuery, getRunesQuery };
