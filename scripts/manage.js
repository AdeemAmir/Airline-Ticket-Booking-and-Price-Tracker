function ciciphus(text, shift) {
const alphU = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const alphL = 'abcdefghijklmnopqrstuvwxyz';
const nmn = '0123456789';
let fallback = '';
for (let i = 0; i < text.length; i++) {let a = text[i];
if (alphL.includes(a)) {
const lf = (alphL.indexOf(a) + shift + 26) % 26; 
fallback += alphL[lf];
}else if (alphU.includes(a)) {
const lf = (alphU.indexOf(a) + shift + 26) % 26;
fallback += alphU[lf];
}else if (nmn.includes(a)) {
const lf = (nmn.indexOf(a) + shift + 10) % 10; 
fallback += nmn[lf];
}else {fallback += a;}}return fallback;}
export async function apiCall() {try {
        const rez = await fetch('files/file');
        const ciphX = await rez.text();
        const deciF = ciciphus(ciphX, -3);
        return deciF;} catch (error) {
        console.error('Error f:d: ', error);
return null;}}
