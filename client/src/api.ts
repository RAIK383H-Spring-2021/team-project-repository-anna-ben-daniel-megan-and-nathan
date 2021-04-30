interface CacheItem {
  data: unknown;
  expires: number;
}

class APIError {
  public error = true;

  constructor(private _data: { status: string; [key: string]: string }) {}

  get status() {
    return this.data.error;
  }

  get data() {
    return this._data;
  }
}

class APISuccess<T> {
  public error = false;

  constructor(public data: T) {}
}

export class API {
  private static base = "";
  private static cache = new Map<string, CacheItem>();

  public static init(base: string) {
    this.base = base;

    const cache = localStorage.getItem("cache");
    if (cache) {
      this.cache = new Map(JSON.parse(cache).cache as [string, CacheItem][]);
    }
  }

  public static makeUrl(
    path: string,
    query?: { [key: string]: string | number | boolean }
  ) {
    const q = makeQuery(query);
    return this.base + ("/" + path).replace(/[/]+/g, "/") + q;
  }

  public static setToken(token: string) {
    localStorage.setItem("token", token);
  }

  public static getToken() {
    return localStorage.getItem("token");
  }

  public static setCacheItem(url: string, data: unknown) {
    // don't include searches since they may change frequently
    if (url.includes("?")) return;

    this.cache.set(url, { data, expires: Date.now() + 1.728e8 });
    queueMicrotask(() =>
      localStorage.setItem("cache", JSON.stringify({ cache: [...this.cache] }))
    );
  }

  public static getCacheItem(url: string) {
    const cached = this.cache.get(url);
    if (cached) {
      if (cached.expires > Date.now()) {
        return cached.data;
      }
    }
  }

  private static makeRequest<T>(
    path: string,
    body: object,
    method: string
  ): Promise<APISuccess<T> | APIError> {
    const url = this.makeUrl(path);
    const data = JSON.stringify(body);

    return fetch(url, {
      method: method,
      body: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getToken()}`,
      },
    }).then(async (res) => {
      if (res.ok) {
        return new APISuccess<T>(await res.json());
      } else {
        return new APIError(await res.json());
      }
    });
  }

  public static put<T>(path: string, body: object) {
    return this.makeRequest<T>(path, body, "PUT");
  }

  public static post<T>(path: string, body: object) {
    return this.makeRequest<T>(path, body, "POST");
  }

  public static get<T>(
    path: string,
    query?: { [key: string]: string | number | boolean }
  ): Promise<APISuccess<T> | APIError> {
    const url = this.makeUrl(path, query);

    return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getToken()}`,
      },
    }).then(async (res) => {
      if (res.ok) {
        return new APISuccess<T>(await res.json());
      } else {
        return new APIError(await res.json());
      }
    });
  }
}

const ec = encodeURIComponent;

function makeQuery(query?: { [key: string]: string | number | boolean }) {
  if (!query) return "";
  else {
    const str = Object.keys(query)
      .map((key) => `${ec(key)}=${ec(query[key])}`)
      .join("&");
    return `?${str}`;
  }
}
