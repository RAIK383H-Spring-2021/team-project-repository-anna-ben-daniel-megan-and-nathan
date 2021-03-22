import { useEffect, useState } from "react";
import { API } from "../api";

interface GenericRequest {
  path: string;
  query?: { [key: string]: string | number | boolean };
  onComplete?<T = unknown>(data: T): unknown;
  debug?: () => any | Promise<any>;
}

export interface MutativeRequest extends GenericRequest {
  method: "POST" | "PUT" | "PATCH" | "DELETE";
  body?: object;
}

export interface FetchRequest extends GenericRequest {
  method: "GET";
}

type unknownArray = Array<any>;

export type Request = MutativeRequest | FetchRequest;

export type MutativeRequestGenerator = (
  ...args: unknownArray
) => MutativeRequest;

export type FetchRequestGenerator = (...args: unknownArray) => FetchRequest;

export type RequestGenerator = MutativeRequestGenerator | FetchRequestGenerator;

export interface Resource {
  get?: FetchRequestGenerator;
  post?: MutativeRequestGenerator;
  put?: MutativeRequestGenerator;
  patch?: MutativeRequestGenerator;
  delete?: MutativeRequestGenerator;
}

export function useRequest<T>(
  request?: RequestGenerator,
  ...params: Parameters<typeof request | any>
) {
  if (!request) throw new Error("Please specify a request.");

  const [value, setValue] = useState<T>();
  const [isLoading, setIsLoading] = useState(params.length > 0);

  useEffect(() => {
    if (params.length > 0) {
      makeRequest(...params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  type requestParams = Parameters<typeof request>;
  async function makeRequest(...params: requestParams) {
    setIsLoading(true);

    const r = request!(...params);
    const url = API.makeUrl(r.path);

    if (r.method === "GET") {
      const cached = API.getCacheItem(url);

      if (cached) {
        setValue(cached as T);
        setIsLoading(false);
      }
    }

    if (localStorage.getItem("debug") === "debug") {
      if (r.debug) {
        const v = await r.debug();
        await new Promise<void>((r) => setTimeout(() => r(), 1200));
        r.onComplete?.(v);
        setValue(v as T);
        setIsLoading(false);
        return;
      }
    }

    const data = await fetch(url, makeFetchOptions(r)).then(
      (res) => res.json() as Promise<T>
    );

    if (r.onComplete) {
      r.onComplete(data);
    }

    if (r.method === "GET") {
      API.setCacheItem(url, data);
    }

    setIsLoading(false);
    setValue(data);
  }

  return [value, isLoading, makeRequest] as const;
}

function makeFetchOptions(
  r: Request
): { headers?: any; method?: any; body?: string } {
  const token = API.getToken();
  if (r.method === "GET") {
    return {
      headers: { Authorization: `Bearer ${token}` },
      method: "GET",
    };
  } else {
    return {
      method: r.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(r.body),
    };
  }
}
