import Skill from "../../Classes/Skill/Skill";
import SkillTooltipText from "../../Classes/Entity/SkillTooltipText";
import "./SpellsPanel.css"

type SpellsPanelProps = {
  spells: Array<Skill>
}

export default function SpellsPanel({spells}: SpellsPanelProps){
  return(
    <div className="SpellsPanelContainer">
    {spells.map((spell, index) => {
      return(
        <div key={index} className="SpellContainer">
          <img className="SpellsPanelSpellImg" src={spell.image} />
          <div className="SpellsPanelSpellDescriptionContainer">
            <div className="SpellsPanelSpellName">{index === 0 ? "Basic Attack" : spell.name}</div>
            <div className="SpellsPanelSpellCooldown">Cooldown: {spell.cooldown} turns</div>
            {SkillTooltipText.createText(spell).split('\n').map((line, index) => {
              return <div key={index} className="SpellsPanelSpellText">{line}</div>
            })}
          </div>
        </div>
      )
    })}
  </div>
  )
}