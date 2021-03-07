export class API {
  public static base = "";

  public static makeUrl(path: string) {
    return (this.base + "/" + path).replace(/[/]+/g, "/");
  }

  public static setToken(token: string) {
    localStorage.setItem("token", token);
  }

  public static getToken() {
    return localStorage.getItem("token");
  }
}
