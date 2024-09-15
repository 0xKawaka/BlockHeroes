import "./TeamDisplay.css"
import HeroMiniature from "./HeroMiniature"
import portraitsDict from "../../assets/portraits/portraitsDict"

type TeamDisplayProps = {
  names: string[],
  levels: number[],
  imagesWidth?: string,
  fontSize?: string
  bordersTopBottom?: boolean
  bordersLeftRight?: boolean
}

export default function TeamDisplay({names, levels, imagesWidth="8rem", fontSize="1.5rem", bordersTopBottom=true, bordersLeftRight=true }: TeamDisplayProps) {
  const imageWidthNumber = parseFloat(imagesWidth.slice(0, -2))    


  return(
    <div className="TeamDisplay" style={{
      borderTop: bordersTopBottom ? "0.2rem solid rgb(146, 113, 47)" : "none",
      borderBottom: bordersTopBottom ? "0.2rem solid rgb(146, 113, 47)" : "none",
      borderLeft: bordersLeftRight ? "0.2rem solid rgb(146, 113, 47)" : "none",
      borderRight: bordersLeftRight ? "0.2rem solid rgb(146, 113, 47)" : "none",
      minHeight: imagesWidth, minWidth: imageWidthNumber*4 + "rem"}}>
    {names.map((name, i) => {
      return (
        <div className="HeroMiniatureAndLevelContainer" key={"arenadef"+i} >
          <HeroMiniature key={i} image={portraitsDict[name]} rank={1} imageWidth={imagesWidth}></HeroMiniature>
          <div className="TeamDisplayLevel" style={{fontSize: fontSize}}>Lvl {levels[i]}</div>
        </div>
      )
    })}
  </div>
  )
}