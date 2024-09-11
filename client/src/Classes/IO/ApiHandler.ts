const apiEndpoint = process.env.REACT_APP_API_ENDPOINT

export default class ApiHandler {


  static async get(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => response.json())
            .then(data => resolve(data))
            .catch(error => reject(error));
    });
  }

  static async getSkillsDict() {
    return await this.get(apiEndpoint + 'skillsDict')
  }

  static async getSkillSets() {
    return await this.get(apiEndpoint + 'skillSets')
  }

  static async getBaseStats() {
    return await this.get(apiEndpoint + 'baseStats')
  }
  
  static async getBattlesInfos() {
    return await this.get(apiEndpoint + 'battlesInfos')
  }

  static async getRuneStats() {
    return await this.get(apiEndpoint + 'runeStats')
  }

}