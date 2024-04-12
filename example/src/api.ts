import { get, post } from "./http";

export function queryTest(data: Record<string, any>) {
  return get("/api/test", data);
}

export function queryUserInfo(data: Record<string, any>) {
  return post("/api/user/info", data);
}

export function queryDisabled(data: Record<string, any>) {
  return post("/api/disabled", data);
}

export function queryFormData(data: Record<string, any>) {
  return post("/api/form/data", data, {
    isFormData: true,
  });
}

export function ignoreTest() {
  return post("/api/ignore/test");
}

export function disabledTest() {
  return post("/api/disabled");
}
export function queryOapiTest(data: Record<string, any>) {
  return post("/oapi/oi", data);
}

export function queryNapiTest(data: Record<string, any>) {
  return post("/napi/ni", data);
}

export function queryTimout() {
  return post("/api/timout", undefined);
}
