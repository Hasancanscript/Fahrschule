import { PDFDocument, rgb, type PDFFont } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { money } from "./gift-shared";
type Voucher = { recipient: string; message?: string; amountCents: number; code: string; activatedAt: Date | null };
const blue = rgb(0.03, 0.28, 0.8), ink = rgb(0.08, 0.12, 0.2), muted = rgb(0.35, 0.4, 0.47);
export async function createGiftPdf(vouchers: Voucher[], lang = "de") {
 if (!vouchers.length || vouchers.some(v => !v.activatedAt)) throw new Error("Gutscheine sind noch nicht aktiviert.");
 const fr = lang === "fr", t = (de: string, french: string) => fr ? french : de;
 const doc = await PDFDocument.create(); doc.registerFontkit(fontkit);
 const loadFont = async (name: string) => doc.embedFont(await readFile(path.join(process.cwd(), "public", "fonts", name)), { subset: true });
 const regular = await Promise.all(["noto-sans-latin-400-normal.woff", "noto-sans-latin-ext-400-normal.woff"].map(loadFont));
 const bold = await Promise.all(["noto-sans-latin-700-normal.woff", "noto-sans-latin-ext-700-normal.woff"].map(loadFont));
 const sets = new Map([...regular, ...bold].map(font => [font, new Set(font.getCharacterSet())]));
 const logo = await doc.embedPng(await readFile(path.join(process.cwd(), "public", "logo.png")));
 let signature: Awaited<ReturnType<typeof doc.embedPng>> | null = null;
 // Optional genuine signature asset; never synthesize a handwritten signature.
 try { signature = await doc.embedPng(await readFile(path.join(process.cwd(), "public", "unterschrift.png"))); }
 catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
 for (const voucher of vouchers) {
  const page = doc.addPage([841.89,595.28]);
  page.drawRectangle({ x:0, y:0, width:841.89, height:595.28, color:rgb(1,1,1) });
  function glyphs(value: string, heavy = false) {
   const fonts = heavy ? bold : regular;
   return [...value.replace(/[\u0000-\u001f\u007f]/g," ")].map(character => {
    const font = fonts.find(font => sets.get(font)!.has(character.codePointAt(0)!)) ?? fonts[0];
    return { character: sets.get(font)!.has(character.codePointAt(0)!) ? character : "?", font };
   });
  }
  function text(value: string,x: number,y: number,size=12,color=ink,heavy=false,maxWidth=738) {
   const chars=glyphs(value,heavy);
   const width=chars.reduce((sum,item)=>sum+item.font.widthOfTextAtSize(item.character,size),0);
   const fitted=size*Math.min(1,maxWidth/Math.max(1,width));
   let cursor=x, run="", current: PDFFont | null=null;
   function flush(){if(current && run){page.drawText(run,{x:cursor,y,size:fitted,font:current,color});cursor+=current.widthOfTextAtSize(run,fitted);run="";}}
   for(const item of chars){if(item.font!==current){flush();current=item.font;}run+=item.character;}flush();
  }
  function paragraph(value: string,x: number,y: number,maxWidth: number) {
   let line="";
   const lines:string[]=[];
   for(const word of value.trim().split(/\s+/)) {
    const candidate=line ? line+" "+word : word;
    const width=glyphs(candidate).reduce((sum,item)=>sum+item.font.widthOfTextAtSize(item.character,11),0);
    if(line && width>maxWidth){lines.push(line);line=word;}else line=candidate;
   }
   if(line)lines.push(line);
   const leading=Math.min(16,88/Math.max(1,lines.length));
   lines.forEach((line,index)=>text(line,x,y-index*leading,Math.min(11,leading/1.3),ink,false,maxWidth));
  }
  page.drawImage(logo,{x:742,y:504,width:48,height:48});
  text("Fahrschule",52,550,13,ink,true,640);
  const brandWidth = glyphs("Fahrschule ", true).reduce((sum, item) => sum + item.font.widthOfTextAtSize(item.character, 13), 0);
  text("fürs Leben",52 + brandWidth,550,13,rgb(0.02,0.5,0.22),true,500);
  text(t("Das ist dein Gutschein.","Voici ton bon cadeau."),52,498,32,blue,true,670);
  text(t("Gute Fahrt und viel Freude auf deinem Weg zum Führerausweis!","Bonne route et beaucoup de plaisir sur le chemin du permis !"),52,473,12,muted);
  page.drawLine({start:{x:52,y:446},end:{x:790,y:446},color:blue,thickness:1.5});
  text(t("EIN GESCHENK FÜR","UN CADEAU POUR"),52,412,24,muted,true,490);
  text(voucher.recipient,52,375,30,ink,true,490);
  text(t("GUTSCHEINWERT","VALEUR DU BON"),590,416,10,muted,true,200);
  text(money(voucher.amountCents),590,375,25,blue,true,200);
  text(t("Einlösbar für Fahrlektionen, VKU oder Kurse.","À utiliser pour des leçons de conduite, le cours ECR ou d’autres cours."),52,346,11,muted);
  if(voucher.message?.trim()){
   text(t("DEINE PERSÖNLICHE NACHRICHT","TON MESSAGE PERSONNEL"),52,312,9,muted,true);
   paragraph(voucher.message,52,291,738);
  }else{
   text(t("Jeder Kilometer bringt dich deinem Ziel näher.","Chaque kilomètre te rapproche de ton objectif."),52,291,16,ink,true);
   text(t("Wir freuen uns darauf, dich auf deinem Weg zu begleiten.","Nous nous réjouissons de t’accompagner sur ce chemin."),52,267,11,muted);
  }
  const date=new Intl.DateTimeFormat(fr ? "fr-CH" : "de-CH",{timeZone:"Europe/Zurich",day:"2-digit",month:"2-digit",year:"numeric"}).format(voucher.activatedAt!);
  text(t("AKTIVIERT AM","ACTIVÉ LE"),52,181,9,muted,true);
  text(date,52,160,12);
  text(t("AUSGESTELLT VON","ÉMIS PAR"),340,181,9,muted,true);
  text("Hüseyin · Fahrschule fürs Leben",340,160,12);
  if(signature){const scale=Math.min(155/signature.width,42/signature.height);page.drawImage(signature,{x:635,y:150,width:signature.width*scale,height:signature.height*scale});}
  else text(t("Nach bestätigter Zahlung digital ausgestellt.","Émis numériquement après confirmation du paiement."),340,142,9,muted,false,440);
  page.drawLine({start:{x:52,y:124},end:{x:790,y:124},color:rgb(0.86,0.88,0.92),thickness:0.8});
  text(t("GUTSCHEINCODE","CODE DU BON"),52,101,9,muted,true);
  text(voucher.code,52,78,14,blue,true,738);
  text(t("Bitte bring deinen Gutschein zur Einlösung mit und vereinbare deinen Termin direkt mit uns.","Présente ton bon pour l’utiliser et prends rendez-vous directement avec nous."),52,52,9,muted);
  text("078 777 81 61 · fahrschulefuersleben.ch",52,35,9,muted);
 }
 doc.setTitle(t("Dein Gutschein · Fahrschule fürs Leben","Ton bon cadeau · Fahrschule fürs Leben"));
 doc.setAuthor("Fahrschule fürs Leben");doc.setLanguage(fr ? "fr-CH" : "de-CH");
 return doc.save();
}
