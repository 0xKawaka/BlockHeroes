import RuneMiniature from "./RuneMiniature"
import "./RunePlaceholder.css"

type RunePlaceholderProps = {
  image: string,
  rank: number,
  imageWidth: string,
}

export default function RunePlaceholder({image, rank, imageWidth}: RunePlaceholderProps) {

  return(
    <div className="RunePlaceholderContainer">
      {rank >= 0 &&
        <RuneMiniature imageWidth={imageWidth} rank={rank} image={image}/>
      }
      {rank < 0 &&
        <img className="TransparentRuneImg" src={image} width={imageWidth}/>
      }
      
    </div>
  )
}