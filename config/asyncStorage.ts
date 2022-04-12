import AsyncStorage from "@react-native-async-storage/async-storage";

export async function setData(
  data: object | string,
  key: string
): Promise<void> {
  const type = typeof data;
  const dataToSave = JSON.stringify(data);
  await AsyncStorage.setItem(key, dataToSave);
}

export async function getData(
  key: string,
  isObject: boolean
): Promise<object | string | null> {
  let data = await AsyncStorage.getItem(key);
  if (data === null) return null;
  if (isObject) return JSON.parse(data);
  return data;
}
