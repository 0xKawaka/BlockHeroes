import "./RuneMiniature.css"

type RuneMiniatureProps = {
  image: string,
  rank: number,
  imageWidth: string,
}

function computeLeftBottomGap(imageWidth: string) {
  // if(imageWidth.slice(-3) !== "rem") throw new Error("imageWidth must be in rem")
  const imageWidthNumber = parseInt(imageWidth.slice(0, -3))
  const bottomGap = imageWidthNumber * 0.1
  const leftGap = imageWidthNumber * 0.5
  return [leftGap, bottomGap]
}

function computeFontSize(imageWidth: string) {
  // if(imageWidth.slice(-3) !== "rem") throw new Error("imageWidth must be in rem")
  const imageWidthNumber = parseInt(imageWidth.slice(0, -3))
  const fontSize = Math.log(imageWidthNumber) * 1.17
  return fontSize
}

export default function RuneMiniature({image, rank, imageWidth}: RuneMiniatureProps) {

  const [leftGap, bottomGap] = computeLeftBottomGap(imageWidth)
  const fontSize = computeFontSize(imageWidth)
  return(
    <div className="RuneMiniatureContainer">
      <img className="RuneMiniatureImage" src={image} style={{width: imageWidth}}/>
      {rank >= 0 &&
        <div className="RuneMiniatureRank" style={{left: leftGap + "rem", bottom: bottomGap + "rem", fontSize: fontSize + "rem"}}>+{rank}</div>
        // <div className="RuneMiniatureRank">{rank}</div>
      }
    </div>
  )
}