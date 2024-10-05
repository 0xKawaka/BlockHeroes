import "./HeroMiniature.css";
import star from "../../assets/icons/star.png";

type HeroMiniatureProps = {
  image: string;
  rank?: number;
  level?: number;
  imageWidth: string;
  owned?: boolean;
};

export default function HeroMiniature({
  image,
  rank = -1,
  level,
  imageWidth,
  owned = true,
}: HeroMiniatureProps) {
  return (
    <div className="HeroMiniatureContainer">
      <div className="HeroMiniatureImgAndRankContainer">
        <img
          className={owned ? "HeroMiniatureImage" : "HeroMiniatureGrayedImage"}
          src={image}
          style={{ width: imageWidth }}
        />
        <div className="HeroMiniatureStars">
        {Array.from({ length: rank + 1 }).map((_, index) => (
          <img key={index} src={star} alt="star" className="HeroStar" />
        ))}
        </div>
      </div>
          
      {level && <div className="HeroMiniatureLevel">Lvl {level}</div>}
      {/* Rank stars */}
    </div>
  );
}
