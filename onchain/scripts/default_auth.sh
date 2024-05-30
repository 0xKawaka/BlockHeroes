#!/bin/bash
set -euo pipefail
pushd $(dirname "$0")/..

export RPC_URL="http://localhost:5050"

export WORLD_ADDRESS=$(cat ./manifests/dev/manifest.json | jq -r '.world.address')

echo "---------------------------------------------------------------------------"
echo world : $WORLD_ADDRESS
echo "---------------------------------------------------------------------------"

# enable system -> models authorizations
sozo auth grant --world $WORLD_ADDRESS --wait writer \
  Account,game::systems::game::Game\
  Heroes,game::systems::game::Game\
  ArenaAccount,game::systems::game::Game\
  ArenaCurrentRankIndex,game::systems::game::Game\
  ArenaTeam,game::systems::game::Game\
  ArenaBattleStorage,game::systems::game::Game\
  BattleStorage,game::systems::game::Game\
  EntityStorage,game::systems::game::Game\
  HealthOnTurnProcStorage,game::systems::game::Game\
  TurnTimelineStorage,game::systems::game::Game\
  ArenaConfig,game::systems::game::Game\
  EnemyRanges,game::systems::game::Game\
  GemsRewards,game::systems::game::Game\
  LevelEnemy,game::systems::game::Game\
  LevelInfos,game::systems::game::Game\
  SkillBuff,game::systems::game::Game\
  SkillInfos,game::systems::game::Game\
  SkillNameSet,game::systems::game::Game\
  BaseStatistics,game::systems::game::Game\
  BonusRuneStatistics,game::systems::game::Game\
  RuneStatistics,game::systems::game::Game\
  ArenaConfig,game::systems::settings::Settings\
  EnemyRanges,game::systems::settings::Settings\
  GemsRewards,game::systems::settings::Settings\
  LevelEnemy,game::systems::settings::Settings\
  LevelInfos,game::systems::settings::Settings\
  SkillBuff,game::systems::settings::Settings\
  SkillInfos,game::systems::settings::Settings\
  SkillNameSet,game::systems::settings::Settings\
  BaseStatistics,game::systems::settings::Settings\
  BonusRuneStatistics,game::systems::settings::Settings\
  RuneStatistics,game::systems::settings::Settings\

echo "Default authorizations have been successfully set."
