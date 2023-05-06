import CryptoJS from 'crypto-js';

async function gettext(note, password) {
  const url = `https://api.allorigins.win/raw?url=`+`https://www.protectedtext.com/${note}?action=getJSON`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    const data = await response.json();
    const e_orig_content = data["eContent"];
    const text = CryptoJS.AES.decrypt(e_orig_content, password).toString(CryptoJS.enc.Utf8);
    console.log(text);
    return text;
  } else {
    console.error(`Error fetching data: ${response.status} - ${response.statusText}`);
    return 'ERROR';
  }
}

gettext('uhhidk', 'password1234');