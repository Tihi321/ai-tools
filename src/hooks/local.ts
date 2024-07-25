export const getStringValue = (name: string): string => {
  const data = localStorage.getItem(name);
  return data || "";
};

export const saveStringValue = (name: string, value: string) => {
  localStorage.setItem(name, value);
};

export const getBooleanValue = (name: string): boolean => {
  const data: string = localStorage.getItem(name) || "";
  return data === "true" ? true : false;
};

export const saveBooleanValue = (name: string, value: boolean) => {
  localStorage.setItem(name, value ? "true" : "false");
};
