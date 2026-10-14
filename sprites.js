// Tiny 8x8 pixel-art sprites drawn to canvas at runtime (no image files needed)
const PAL={k:'#5a3a3a',w:'#fffaf3',p:'#f4b6c2',r:'#e8576f',b:'#8b5a3c',t:'#d9a066',y:'#f6d365',g:'#8fb996',l:'#b9a3e3',o:'#f0a060',c:'#fde4ea',s:'#ffd9b8',m:'#6a9a70',n:'#c97b84',a:'#a8d8ea'};
const PERSON='..HHHH.. .HHHHHH. .HssssH. .skssks. ..ssss.. .TTTTTT. TTTTTTTT .TT..TT.';
const CAT='CC...CC. CCCCCCC. CkCCCkC. CCCpCCC. .CCCCCC. CCCCCCCC CCCCCCCC CC....CC';
export const P={
coffee:'..c..c.. ........ .wwwwww. .wbbbbww .wbbbbw. ..wwww.. .wwwwww. ........',
iced:'....r... ...r.... ..aaaaa. .abbbba. .abttba. .abbbba. ..abba.. ..aaaa..',
smilk:'..wwww.. .wppppw. .wppppw. .wpnppw. .wppppw. ..wwww.. ..wwww.. ........',
choc:'..w..w.. ........ rrrrrr.. rbbbbrrr rbbbbr.r rbbbbrrr .rrrrr.. ........',
cup:'...rr... ..pppp.. .pppppp. .pppppp. .llllll. ..llll.. ..llll.. ........',
cook:'........ ..tttt.. .ttbttt. .tttttt. .tbtttb. .tttttt. ..tttt.. ........',
cake:'...r.... ..wwww.. .wwwwwww .pppppp. .wwwwww. .pppppp. .wwwwww. ........',
hrt:'........ .rr..rr. rrrrrrrr rrrrrrrr .rrrrrr. ..rrrr.. ...rr... ........',
beans:'........ ..bb.... .bkbb.bb .bbbb.kb ..bb.bbb ....bkb. ........ ........',
milk:'..aaaa.. .wwwwww. .wwwwww. .waaaaw. .waaaaw. .wwwwww. .wwwwww. ........',
berry:'...gg... ..gggg.. .rrrrrr. rryrrrrr rrrrryrr .rrrrrr. ..rrrr.. ...rr...',
cocoa:'........ .bbbbbb. .bkbkbk. .bbbbbb. .bkbkbk. .bbbbbb. ..wwww.. ........',
flour:'..wwww.. .wwwwww. .wttttw. .wtwwtw. .wttttw. .wwwwww. .wwwwww. ........',
table:'........ ........ tttttttt bbbbbbbb .b....b. .b....b. .b....b. ........',
plant:'..g.g... .ggmgg.. ..gmg... ...m.... .bbbbbb. .bbbbbb. ..bbbb.. ........',
lamp:'..yyyy.. .yyyyyy. .yyyyyy. ..yyyy.. ...kk... ...kk... ..kkkk.. ........',
fairy:'kkkkkkkk r.y.l.g. n.o.l.m. ........ ........ ........ ........ ........',
window:'wwwwwwww waaawaaw waaawaaw wwwwwwww waaawaaw waaawaaw wwwwwwww ........',
paint:'kkkkkkkk kaaaaaak kaayaaak kagggaak kgggggak kkkkkkkk ........ ........',
plush:'.bb..bb. bbbbbbbb .bkbbkb. .bbttbb. ..bbbb.. .bbbbbb. .bb..bb. ........',
disp:'..pppp.. .pppppp. ppp..ppp ppp..ppp .pppppp. ..pppp.. wwwwwwww ........',
latte:'..c..c.. ........ .wwwwww. .wggggww .wgwwgw. ..wwww.. .wwwwww. ........',
waffle:'tttttttt tbtbtbtt tttttttt tbtbtbtt tttttttt tbtbtbtt tttttttt ........',
matcha:'..mmmm.. .gggggg. .gwwwwg. .gwmmwg. .gwwwwg. .gggggg. .gggggg. ........',
sakura:'..pppp.. .pppppp. pppnpppp .pppppp. ...bb... ...bb... ...bb... ..bbbb..',
pumpkin:'...m.... ..oooo.. .oooooo. ookooko. oooooooo .oookoo. .oooooo. ........',
xtree:'...y.... ..ggg... ..grg... .ggggg.. .gyggg.. gggggrgg ...bb... ...bb...',
bunting:'kkkkkkkk r.y.l.g. rryyllgg .r.y.l.g ........ ........ ........ ........',
star:'...y.... ...y.... yyyyyyyy .yyyyyy. ..yyyy.. ..yy.yy. .yy..yy. ........',
coin:'..yyyy.. .yyoyoy. yyoyyoyy yyoyyoyy yyoyyoyy .yyoyoy. ..yyyy.. ........'};
const V={p1:['#6b4423','#b9a3e3'],p2:['#dddddd','#8fb996'],p3:['#f6d365','#a8d8ea'],p4:['#e8576f','#f4b6c2'],p5:['#3a2a2a','#3a2a2a'],cat:['','#f0a060'],cat0:['','#f0a060'],cat1:['','#f2eee6'],cat2:['','#6b5a6b'],cat3:['','#f4a0b8'],cat4:['','#b9a3e3']};
const cache={};
function url(k){if(cache[k])return cache[k];
 const v=V[k],rows=(P[k]||(k.startsWith('cat')?CAT:PERSON)).split(' '),pal={...PAL};
 if(v){pal.H=v[0];pal.T=v[1];pal.C=v[1]}
 const c=document.createElement('canvas');c.width=c.height=8;const x=c.getContext('2d');
 rows.forEach((r,j)=>[...r].forEach((ch,i)=>{if(pal[ch]){x.fillStyle=pal[ch];x.fillRect(i,j,1,1)}}));
 return cache[k]=c.toDataURL()}
export const ic=(k,s=24)=>`<img class="px" src="${url(k)}" width="${s}" height="${s}" alt="">`;
