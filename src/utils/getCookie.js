export function getCookie(cookieName) {
  const cookies = decodeURIComponent(document.cookie);
  const cookieArray = cookies.split(";");

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];

    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length).slice(1);
    }
  }
  return "";
}
