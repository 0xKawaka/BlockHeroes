import "./HeroMiniature.css"

type HeroMiniatureProps = {
  image: string,
  rank?: number,
  level?: number,
  imageWidth: string,
  owned?: boolean
}

export default function HeroMiniature({image, rank, level, imageWidth, owned= true}: HeroMiniatureProps) {

  // const bottomGap = parseInt(imageWidth.slice(0, -2)) * 0.02 + "rem"

  return(
  <div className="HeroMiniatureContainer">
    <img className={owned ? "HeroMiniatureImage" : "HeroMiniatureGrayedImage"} src={image} style={{width: imageWidth}}/>
    {level && <div className="HeroMiniatureLevel">Lvl {level}</div>}
  </div>
  )
}