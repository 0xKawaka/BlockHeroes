import frostbolt from "../projectiles/frostbolt.png"

const projectilesImgDict: {[key: string]: any} = {
    "frostbolt": frostbolt
}

export default function loadProjectile(name: string): string {
    return projectilesImgDict[name];
}