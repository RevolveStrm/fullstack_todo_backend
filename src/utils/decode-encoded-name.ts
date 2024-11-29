export const decodeEncodedName = (encodedName: string) => {
  try {
    return decodeURIComponent(escape(encodedName));
  } catch (error) {
    return encodedName;
  }
};
