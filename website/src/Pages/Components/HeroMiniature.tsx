import "./HeroMiniature.css"

type HeroMiniatureProps = {
  image: string,
  rank: number,
  level: number,
  imageWidth: string,
}

export default function HeroMiniature({image, rank, level, imageWidth}: HeroMiniatureProps) {

  const bottomGap = parseInt(imageWidth.slice(0, -2)) * 0.02 + "rem"

  return(
  <div className="HeroMiniatureContainer">
    <img className="HeroMiniatureImage" src={image} style={{width: imageWidth}}/>
    <div className="HeroMiniatureLevel" style={{bottom: bottomGap}}>Lvl {level}</div>
  </div>
  )
}