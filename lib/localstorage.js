/* eslint-disable consistent-return */
/* eslint-disable no-undef */

export async function clear() {
  try {
    if (typeof localStorage !== 'undefined') {
      await localStorage.clear();
    }
  } catch (err) {
    console.log(err);
  }
}

export async function getItem(key, parse = false) {
  try {
    if (typeof localStorage !== 'undefined') {
      if (parse) {
        const value = JSON.parse(await localStorage.getItem(key));
        return value;
      }
      const value = await localStorage.getItem(key);
      return value;
    }
  } catch (err) {
    console.log(err);
  }
}

export async function removeItem(key) {
  try {
    if (typeof localStorage !== 'undefined') {
      await localStorage.removeItem(key);
    }
  } catch (err) {
    console.log(err);
  }
}

export async function setItem(key, value) {
  try {
    if (typeof localStorage !== 'undefined') {
      if (typeof value === 'object') {
        await localStorage.setItem(key, JSON.stringify(value));
      } else {
        await localStorage.setItem(key, value);
      }
    }
  } catch (err) {
    console.log(err);
  }
}
