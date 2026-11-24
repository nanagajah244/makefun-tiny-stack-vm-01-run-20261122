import {readFileSync,writeFileSync,mkdirSync,readdirSync} from "node:fs";
const IN=(process.env.MAKEFUN_INPUT_DIR||"/input")+"/",OUT=(process.env.MAKEFUN_OUTPUT_DIR||"/output")+"/";
for(const d of readdirSync(IN).sort()){
 const P=readFileSync(IN+d+"/program.bin"),N=readFileSync(IN+d+"/input.bin");
 const S:number[]=[],C:number[]=[],M=new Int32Array(256),O:number[]=[];
 let pc=0,st=0,ip=0,ex=-1;
 while(ex<0){
  if(st>=1e6){ex=10;break}
  if(pc<0||pc>=P.length){ex=9;break}
  const o=P[pc];let im=0;
  if(o===1)im=1;else if(o===2)im=4;else if(o>=48&&o<=51)im=2;
  if(im&&pc+im>=P.length){ex=9;break}
  st++;
  switch(o){
   case 0:ex=0;break;
   case 1:if(S.length>255)ex=3;else{const v=P[pc+1];S.push(v<128?v:v-256);pc+=2}break;
   case 2:if(S.length>255)ex=3;else{S.push(P.readInt32LE(pc+1));pc+=5}break;
   case 3:if(S.length<1)ex=2;else{S.pop();pc++}break;
   case 4:if(S.length<1)ex=2;else if(S.length>255)ex=3;else{S.push(S[S.length-1]);pc++}break;
   case 5:if(S.length<2)ex=2;else{const x=S.pop()!,y=S.pop()!;S.push(x,y);pc++}break;
   case 6:if(S.length<2)ex=2;else if(S.length>255)ex=3;else{S.push(S[S.length-2]);pc++}break;
   case 7:if(S.length<3)ex=2;else{const c1=S.pop()!,b1=S.pop()!,a1=S.pop()!;S.push(b1,c1,a1);pc++}break;
   case 16:if(S.length<2)ex=2;else{const b=S.pop()!,a=S.pop()!;S.push(a+b|0);pc++}break;
   case 17:if(S.length<2)ex=2;else{const b=S.pop()!,a=S.pop()!;S.push(a-b|0);pc++}break;
   case 18:if(S.length<2)ex=2;else{const b=S.pop()!,a=S.pop()!;S.push(Math.imul(a,b));pc++}break;
   case 19:if(S.length<2)ex=2;else{const b=S.pop()!,a=S.pop()!;if(!b)ex=4;else{S.push(a/b|0);pc++}}break;
   case 20:if(S.length<2)ex=2;else{const b=S.pop()!,a=S.pop()!;if(!b)ex=4;else{S.push(a%b|0);pc++}}break;
   case 21:if(S.length<2)ex=2;else{const b=S.pop()!,a=S.pop()!;if(!b)ex=4;else{S.push(Math.floor((a>>>0)/(b>>>0))|0);pc++}}break;
   case 22:if(S.length<2)ex=2;else{const b=S.pop()!,a=S.pop()!;if(!b)ex=4;else{S.push((a>>>0)%(b>>>0)|0);pc++}}break;
   case 23:if(S.length<1)ex=2;else{S.push(-S.pop()!|0);pc++}break;
   case 24:if(S.length<2)ex=2;else{const b=S.pop()!,a=S.pop()!;S.push(a&b);pc++}break;
   case 25:if(S.length<2)ex=2;else{const b=S.pop()!,a=S.pop()!;S.push(a|b);pc++}break;
   case 26:if(S.length<2)ex=2;else{const b=S.pop()!,a=S.pop()!;S.push(a^b);pc++}break;
   case 27:if(S.length<1)ex=2;else{S.push(~S.pop()!);pc++}break;
   case 28:if(S.length<2)ex=2;else{const b=S.pop()!,a=S.pop()!;S.push(a<<(b&31));pc++}break;
   case 29:if(S.length<2)ex=2;else{const b=S.pop()!,a=S.pop()!;S.push(a>>(b&31));pc++}break;
   case 30:if(S.length<2)ex=2;else{const b=S.pop()!,a=S.pop()!;S.push(a>>>(b&31)|0);pc++}break;
   case 32:if(S.length<2)ex=2;else{const b=S.pop()!,a=S.pop()!;S.push(a===b?1:0);pc++}break;
   case 33:if(S.length<2)ex=2;else{const b=S.pop()!,a=S.pop()!;S.push(a<b?1:0);pc++}break;
   case 34:if(S.length<2)ex=2;else{const b=S.pop()!,a=S.pop()!;S.push((a>>>0)<(b>>>0)?1:0);pc++}break;
   case 48:pc=pc+3+P.readInt16LE(pc+1);break;
   case 49:if(S.length<1)ex=2;else{const v=S.pop()!;pc=v===0?pc+3+P.readInt16LE(pc+1):pc+3}break;
   case 50:if(S.length<1)ex=2;else{const v=S.pop()!;pc=v!==0?pc+3+P.readInt16LE(pc+1):pc+3}break;
   case 51:if(C.length>=64)ex=7;else{C.push(pc+3);pc=P.readUInt16LE(pc+1)}break;
   case 52:if(C.length<1)ex=8;else pc=C.pop()!;break;
   case 64:if(S.length<1)ex=2;else{const a=S.pop()!;if(a<0||a>255)ex=6;else{S.push(M[a]);pc++}}break;
   case 65:if(S.length<2)ex=2;else{const a=S.pop()!,v=S.pop()!;if(a<0||a>255)ex=6;else{M[a]=v;pc++}}break;
   case 80:if(S.length<1)ex=2;else{const v=S.pop()!,s=String(v);if(O.length+s.length>65536)ex=11;else{for(let i=0;i<s.length;i++)O.push(s.charCodeAt(i));pc++}}break;
   case 81:if(S.length<1)ex=2;else{const v=S.pop()!;if(O.length+1>65536)ex=11;else{O.push(v&255);pc++}}break;
   case 82:if(S.length>255)ex=3;else{S.push(ip<N.length?N[ip++]:-1);pc++}break;
   case 83:if(S.length<1)ex=2;else ex=S.pop()!&255;break;
   default:ex=5;break;
  }
 }
 mkdirSync(OUT+d,{recursive:true});
 writeFileSync(OUT+d+"/stdout.bin",Buffer.from(O));
 writeFileSync(OUT+d+"/exit.txt",String(ex));
}
