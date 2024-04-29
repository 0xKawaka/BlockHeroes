import {
  type ConnectOptions,
  type DisconnectOptions,
  connect,
  disconnect,
  StarknetWindowObject,
} from "get-starknet"


async function handleConnect(options?: ConnectOptions): Promise<StarknetWindowObject | null> {
  const res = await connect(options)
  console.log(res)
  return res
}

async function handleDisconnect(options?: DisconnectOptions) {
  await disconnect(options)
}

export { handleConnect, handleDisconnect }