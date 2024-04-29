
export default class StatsModifier {
  name: string;
  stat: string;
  value: number;
  duration: number;

  constructor(name: string, value: number, duration: number) {
    this.name = name;
    this.value = value;
    this.duration = duration;
  }
}