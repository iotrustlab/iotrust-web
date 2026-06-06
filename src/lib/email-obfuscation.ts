export function encodeEmailAddress(email: string) {
  return Array.from(email)
    .map((char, index) => {
      const offset = (index % 7) + 3;
      return (char.charCodeAt(0) + offset).toString(36);
    })
    .join('-');
}

export function decodeEmailAddress(encodedEmail: string) {
  return encodedEmail
    .split('-')
    .map((part, index) => {
      const offset = (index % 7) + 3;
      return String.fromCharCode(parseInt(part, 36) - offset);
    })
    .join('');
}
