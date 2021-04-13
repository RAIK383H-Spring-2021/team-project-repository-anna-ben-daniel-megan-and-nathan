import jwtDecode from "jwt-decode";
import { API } from "./api";

interface TokenUser {
  sub: number;
  email: string;
  name: string;
}

export class User {
  private static user: User;
  private static _isAuthorized = false;

  constructor(
    public id: number,
    public email: string,
    public first_name: string,
    public last_name: string
  ) {}

  static getUser() {
    const token = localStorage.getItem("token");
    if (token) {
      if (!this.user) {
        const claims = jwtDecode<TokenUser>(token);
        this.user = new User(claims.sub, claims.email, claims.name, "");
      }

      return this.user;
    }
  }

  static get isAuthorized() {
    const user = this.getUser();
    if (this._isAuthorized) return true;
    return new Promise<boolean>((resolve, reject) => {
      if (!user) resolve(false);
      else {
        fetch(API.makeUrl(`users/${user.id}`), {
          headers: { Authorization: `Bearer ${API.getToken()}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.user?.id === user.id) {
              this._isAuthorized = true;
              resolve(true);
            } else {
              resolve(false);
            }
          })
          .catch((res) => reject(res));
      }
    });
  }
}
