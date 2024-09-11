import "./LootItem.css"

type LootItemProps = {
  name: string,
  amount: number,
  image: string
}

export default function LootItem({name, amount, image}: LootItemProps) {

  return(
  <div className="LootItemContainer">
    <img className="LootItemImage" src={image}/>
    <div className="LootItemNameAndQuatity">
      <div className="LootItemName">{name}</div>
      <div className="LootItemQuantity">x{amount}</div>
    </div>
    <div className="LootItemMintButton">
      Mint
    </div>
  </div>
  )
}