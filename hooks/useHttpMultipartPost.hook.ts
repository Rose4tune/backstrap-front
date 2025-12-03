import { AxiosRequestConfig } from "axios";

import useHttpPost, { State } from "./useHttpPost.hook";

export default function useHttpMultipartPost<I, O>(
  url: string,
  config?: Pick<AxiosRequestConfig, "headers">
): [State<I, O>, (data: I) => void] {
  return useHttpPost(url, {
    headers: Object.assign(
      {
        "Content-Type":
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      },
      config?.headers
    ),
  });
}
