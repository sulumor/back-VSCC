export const frAlphaNum = /^[a-zA-ZÀ-ÿ0-9-]+$/;
export const passwordRegex =
  /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,}$/;
export const stravaIdRegex = /^[\d]+$/;
export const stravaHashRegex = /^\d\.[\d]+\/[\d]{2}\.[\d]+\/\d\.[\d]+$/;
