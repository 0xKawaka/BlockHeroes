import "./TeamDisplay.css"
import HeroMiniature from "./HeroMiniature"
import portraitsDict from "../../assets/portraits/portraitsDict"

type TeamDisplayProps = {
  names: string[],
  levels: number[],
  imagesWidth?: string,
  fontSize?: string
}

export default function TeamDisplay({names, levels, imagesWidth="8rem", fontSize="1.5rem"}: TeamDisplayProps) {
  const imageWidthNumber = parseInt(imagesWidth.slice(0, -2))

  return(
  <div className="TeamDisplay" style={{minHeight: imagesWidth, minWidth: imageWidthNumber*4+"rem"}}>
    {names.map((name, i) => {
      return (
        <div className="HeroMiniatureAndLevelContainer" key={"arenadef"+i}>
          <HeroMiniature key={i} image={portraitsDict[name]} rank={1} imageWidth={imagesWidth}></HeroMiniature>
          <div className="TeamDisplayLevel" style={{fontSize: fontSize}}>Lvl {levels[i]}</div>

        </div>
      )
    })}
  </div>
  )
}