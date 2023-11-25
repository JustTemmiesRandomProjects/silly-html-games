// we don't have to inform the user that we're using cookies, since our cookies are considered as "strictly necessary" 
// and they don't actually include any identifiable information, and they never leave the device in any capacity

export function getCookie(c_name) {
let name = c_name + "=";
    let decoded_cookie = decodeURIComponent(document.cookie);
    let ca = decoded_cookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return JSON.parse(c.substring(name.length, c.length))
        }
    }
    return {};
}

export function setCookie(c_name, c_value) {
    const d = new Date();
    // set the cookie to expire in ~1 year
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = c_name + "=" + JSON.stringify(c_value) + ";" + expires + ";path=/" + ";SameSite=Strict";
}