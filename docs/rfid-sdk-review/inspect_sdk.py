"""Read legacy Word text and PE headers without loading SDK binaries."""
from pathlib import Path
import struct, json, hashlib, re, sys

BASE = Path(__file__).parent
ROOT = Path(sys.argv[1]) if len(sys.argv)>1 else BASE / 'extracted'
OUT = BASE / 'evidence'
OUT.mkdir(exist_ok=True)
def u16(b, p): return struct.unpack_from('<H', b, p)[0]
def u32(b, p): return struct.unpack_from('<I', b, p)[0]

class CFB:
    def __init__(self, data):
        self.b = data
        self.ss = 1 << u16(data, 30)
        self.ms = 1 << u16(data, 32)
        dif = list(struct.unpack_from('<109I', data, 76))
        nxt = u32(data, 68)
        for _ in range(u32(data, 72)):
            sec = self.sector(nxt)
            dif.extend(struct.unpack_from('<%dI' % (self.ss//4-1), sec))
            nxt = u32(sec, self.ss-4)
        self.fat = []
        for sid in dif:
            if sid < 0xfffffffa:
                self.fat.extend(struct.unpack('<%dI' % (self.ss//4), self.sector(sid)))
        directory = self.chain(u32(data, 48), self.fat)
        self.entries = {}
        for p in range(0, len(directory), 128):
            d = directory[p:p+128]
            ln = u16(d, 64)
            if ln >= 2:
                self.entries[d[:ln-2].decode('utf-16le')] = (d[66], u32(d,116), struct.unpack_from('<Q',d,120)[0])
        rt = next(v for v in self.entries.values() if v[0] == 5)
        self.mini = self.chain(rt[1],self.fat)[:rt[2]]
        mf = self.chain(u32(data,60),self.fat)
        self.mfat = list(struct.unpack('<%dI' % (len(mf)//4),mf))
    def sector(self,sid): return self.b[(sid+1)*self.ss:(sid+2)*self.ss]
    def chain(self,sid,fat,mini=False):
        result = bytearray(); seen=set()
        while sid < 0xfffffffa and sid not in seen:
            seen.add(sid)
            result.extend(self.mini[sid*self.ms:(sid+1)*self.ms] if mini else self.sector(sid))
            sid = fat[sid]
        return bytes(result)
    def stream(self,name):
        _,sid,size = self.entries[name]
        return self.chain(sid,self.mfat,True)[:size] if size < 4096 else self.chain(sid,self.fat)[:size]

def word_text(path):
    c = CFB(path.read_bytes()); w = c.stream('WordDocument')
    table = c.stream('1Table' if u16(w,10)&512 else '0Table')
    p = 32; csw=u16(w,p); p+=2+csw*2; cslw=u16(w,p); p+=2+cslw*4
    pairs=u16(w,p); p+=2
    fc,lcb=struct.unpack_from('<II',w,p+33*8)
    clx=table[fc:fc+lcb]; p=0
    while clx[p] == 1: p+=3+u16(clx,p+1)
    assert clx[p] == 2
    sz=u32(clx,p+1); plc=clx[p+5:p+5+sz]; n=(sz-4)//12
    chunks=[]
    for i in range(n):
        length=u32(plc,(i+1)*4)-u32(plc,i*4)
        offset=u32(plc,(n+1)*4+i*8+2); compressed=bool(offset&0x40000000); offset &= 0x3fffffff
        if compressed:
            offset//=2; chunks.append(w[offset:offset+length].decode('cp1252',errors='replace'))
        else: chunks.append(w[offset:offset+length*2].decode('utf-16le',errors='replace'))
    return ''.join(chunks).replace('\r','\n').replace('\x07',' | ')

docs=[]
for p in ROOT.rglob('*.doc'):
    if '_archive-audit' in p.parts: continue
    try:
        t=word_text(p); target=OUT/(p.name+'.txt'); target.write_text(t,encoding='utf-8')
        docs.append({'file':str(p.relative_to(ROOT)),'chars':len(t),'output':target.name})
    except Exception as e: docs.append({'file':str(p),'error':str(e)})

bins=[]
for p in ROOT.rglob('*.dll'):
    if '_archive-audit' in p.parts: continue
    b=p.read_bytes(); pe=u32(b,60); machine=u16(b,pe+4); opt=pe+24; magic=u16(b,opt)
    dd=opt+(96 if magic==0x10b else 112); clr=u32(b,dd+14*8)
    sections=[]
    for si in range(u16(b,pe+6)):
        sp=opt+u16(b,pe+20)+si*40
        sections.append((u32(b,sp+12),max(u32(b,sp+8),u32(b,sp+16)),u32(b,sp+20)))
    def rva(v):
        return next(raw+v-va for va,size,raw in sections if va <= v < va+size)
    exports=[]; er=u32(b,dd)
    if er:
        ep=rva(er); count=u32(b,ep+24); names=rva(u32(b,ep+32))
        for ni in range(count):
            np=rva(u32(b,names+ni*4)); exports.append(b[np:b.index(b'\0',np)].decode('ascii',errors='replace'))
    flags=u32(b,rva(clr)+16) if clr else None
    bins.append({'path':str(p.relative_to(ROOT)),'machine':hex(machine),'managed':bool(clr),'clr_flags':flags,'export_count':len(exports),'exports':exports if len(exports)<200 else ['(support library exports omitted)'],'sha256':hashlib.sha256(b).hexdigest(),'bytes':len(b)})
    if p.name == 'RfidApiLib.dll':
        strings=re.findall(rb'[\x20-\x7e]{4,}',b)
        (OUT/(p.parent.name+'-'+str(len(b))+'-assembly-strings.txt')).write_text('\n'.join(x.decode('ascii') for x in strings),encoding='utf-8')
(OUT/'inventory.json').write_text(json.dumps({'documents':docs,'binaries':bins},indent=2,ensure_ascii=False),encoding='utf-8')
print(json.dumps({'documents':docs,'unique_binaries':list({x['sha256']:x for x in bins}.values())},indent=2,ensure_ascii=True))
