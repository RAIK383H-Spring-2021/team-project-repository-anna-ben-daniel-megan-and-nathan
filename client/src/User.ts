import jwtDecode from "jwt-decode";
import { API } from "./api";
import { IQuestionnaire, getBaseQ } from "./pages/partials/Questionnaire";

interface TokenUser {
  sub: number;
  email: string;
  name: string;
}

export class User {
  private static _user: User;
  private static _isAuthorized = false;
  private static _questionnaire: IQuestionnaire | null = null;

  constructor(
    public id: number,
    public email: string,
    public first_name: string,
    public last_name: string
  ) {}

  static get user() {
    const token = localStorage.getItem("token");

    if (token) {
      if (!this._user) {
        const claims = jwtDecode<TokenUser>(token);
        this._user = new User(claims.sub, claims.email, claims.name, "");

        if (!this._questionnaire) {
          this.updateQuestionnaire();
        }
      }

      return this._user;
    }

    return null;
  }

  static get isAuthorized() {
    const user = this.user;

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

  private static async updateQuestionnaire() {
    const user = this.user;
    if (user) {
      if (!navigator.onLine) {
        const q = API.getCacheItem(
          API.makeUrl(`users/${user.id}/questionnaire`)
        );
        this._questionnaire = q as any;
        return;
      }

      const result = await API.get<IQuestionnaire>(
        `users/${user.id}/questionnaire`
      );

      if (Object.values(result).every((q) => q)) {
        delete (result as any).id;
        API.setCacheItem(API.makeUrl(`users/${user.id}/questionnaire`), result);
        this._questionnaire = result as any;
      } else {
        this._questionnaire = getBaseQ();
      }
    }
  }

  static get questionnaire() {
    if (this._questionnaire) {
      return this._questionnaire;
    } else {
      return getBaseQ();
    }
  }
}
