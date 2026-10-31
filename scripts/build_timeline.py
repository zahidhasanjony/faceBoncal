#!/usr/bin/env python3
"""Rebuild cue and scene timings from the supplied original SRT; do not retime dialogue."""
from pathlib import Path
import re,json,math
ROOT=Path(__file__).resolve().parent.parent
srt=(ROOT/'public/script.srt').read_text(encoding='utf-8-sig')
audio_ms=129307
fps=60

def timems(x):
 h,m,s,ms=map(int,re.split('[:,]',x))
 return ((h*60+m)*60+s)*1000+ms

def frame(ms):return (ms*fps+500)//1000
cues=[]
for block in re.split(r'\n\s*\n',srt.strip()):
 parts=block.splitlines()
 if len(parts)<3:continue
 m=re.search(r'(\d\d:\d\d:\d\d,\d\d\d)\s*-->\s*(\d\d:\d\d:\d\d,\d\d\d)',parts[1]);assert m,block
 start,end=map(timems,m.groups())
 cues.append({'id':int(parts[0]),'startMs':start,'endMs':end,'startFrame':frame(start),'endFrame':frame(end),'text':'\n'.join(parts[2:])})
# From cue 1 through 47. Ends of shots follow next shot starts, not sums of rounded durations.
def g(first,last,kind,title,kicker,detail,motion):
 return dict(firstCue=first,lastCue=last,kind=kind,title=title,kicker=kicker,detail=detail,motion=motion)
layouts=[
 g(1,1,'hook','হাড় ক্ষয়ের আসল কারণ?','প্রথম প্রশ্ন','শুধু ক্যালসিয়াম নয়','হাড়ের 3D cutaway tumble; halo scan rings rotate; title springs in'),
 g(2,2,'wrong','একদম ভুল!','মিথ বনাম সত্য','এটি পুরো গল্প নয়','ভুল stamp swings in, red fracture line zips across, shake then hold'),
 g(3,3,'pills','মুঠো মুঠো ক্যালসিয়াম?','ভুল ধারণা','ট্যাবলেটই সব নয়','চার tablet stagger-fall with rotation and elastic bounce; counter chips enter'),
 g(4,4,'porous','ভেতর থেকে ঝাঁঝরা','হাড়ের ভেতরে','অদৃশ্য পরিবর্তন','cortical bone expands, pores pop in waves, scanner line passes'),
 g(5,6,'why','কিন্তু কেন?','মূল প্রশ্ন','আরও একটি কারণ আছে','oversized question snaps in, calcium icon slides aside, spotlight hits'),
 g(7,7,'war','দুই দল মিস্ত্রির যুদ্ধ','হাড়ের ভেতর','ভাঙে বনাম গড়ে','worker crews slide in from opposite directions, tools swing, energy beam pulses'),
 g(8,9,'construction','হাড় = নির্মাণস্থল','২৪ ঘণ্টা','কাজ চলছে','bone framework draws left-to-right, clock hand circles, worker moves'),
 g(10,10,'demolition','পুরোনো অংশ ভাঙে','ভাঙচুর দল','পুরোনো হাড় পরিষ্কার','pickaxe swings, cracks draw on stroke, debris falls along arcs'),
 g(11,12,'rebuild','আবার নতুন হাড় তৈরি','রাজমিস্ত্রি দল','নতুন গঠন','cement bricks lift and stack; cracks seal; strength bar rises'),
 g(13,14,'balance','প্রথম ৩০ বছর','হাড় গঠনের ভারসাম্য','গড়ার গতি বেশি','30 years sweeps into view; bars grow at different rates'),
 g(15,16,'sleep','গড়ার দল ধীর হয়ে যায়','বয়স ও অভ্যাস','গতি বদলে যায়','worker helmet droops, Z particles float, workrate shrinks'),
 g(17,18,'use','USE IT OR LOSE IT','হাড়ের নিয়ম','ব্যবহার না করলে ক্ষয়','kinetic English words build one by one; arrow switches directions'),
 g(19,21,'chair','সারাদিন বসে থাকলে','নড়াচড়া কম','হাড়ে কম চাপ পড়ে','seated person legs still, pressure meter drains, idle ring pulses'),
 g(22,22,'leave','মিস্ত্রিদের ছুটি!','কাজের সংকেত','কম কাজ','holiday stamp strikes, hardhat rolls away, scaffold pauses'),
 g(23,24,'risk','ক্ষয়ের গতি বাড়ে','ঝুঁকির কারণ','ধূমপান • চিনি • হরমোন','three hazard icons move in at 6f stagger; bone chip erodes'),
 g(25,26,'pain','ব্যথা, তারপর ট্যাবলেট','ভুল প্রতিক্রিয়া','আগে কারণ বুঝুন','knee joint zoom, red pain arcs oscillate, calcium tablets slide in'),
 g(27,28,'lock','হাড়ের গুদামে তালা','ক্যালসিয়াম গ্রহণ','ভিটামিন ডি দরকার','warehouse door builds; padlock drops and rotates; key silhouette appears'),
 g(29,31,'key','ভিটামিন ডি: চাবি','একটি রূপক','ক্যালসিয়াম শোষণে সহায়তা','gold D key curves to lock, ring rotates, lock pops open, particles flow'),
 g(32,32,'caution','সঠিক ব্যবহার জরুরি','সাপ্লিমেন্ট সতর্কতা','প্রয়োজনে চিকিৎসকের পরামর্শ','pill particles approach kidney icon; warning shield expands; gentle reject stamp'),
 g(33,34,'three','তিনটি কাজ একসাথে','আজ থেকেই','হাড়ের যত্ন নিন','three numbered hoops spring in sequence, orbit dots and quick arc wipe'),
 g(35,37,'walk','১. শরীর নাড়ান','প্রতিদিনের অভ্যাস','দ্রুত হাঁটা • সিঁড়ি • ওজন','animated walking legs, stair ascent and dumbbell lift all offset'),
 g(38,39,'work','চাপেই কাজের সংকেত','হাড়ে ভার পড়লে','নতুন গঠনের সংকেত','footstep pulse travels along bone, WORK ORDER card checks on'),
 g(40,41,'sun','২. ভিটামিন ডি','রোদ ও পুষ্টি','D₃ • K₂','sun rays rotate slowly, vitamin D key ascends, two vitamin coins orbit'),
 g(42,43,'food','৩. খাবার থেকে ক্যালসিয়াম','খাবারের উৎস','মাছ • দই • তিল • ডিম','fish swims in, yogurt scales up, sesame scatters, eggs pivot'),
 g(44,45,'final','শক্ত থাকার কারণ দিন','মনে রাখবেন','হাড়কে কাজে লাগান','cracks reverse and close, healthy bone lights up, check ring completes'),
 g(46,47,'cta','স্বাস্থ্য সহজ ভাষায়','EDUTALK','ফলো করুন','channel pill expands, animated follow arrow, spark ring settles'),
]
assert len(cues)==47 and sum(g['lastCue']-g['firstCue']+1 for g in layouts)==47
end_frames=math.ceil(max(audio_ms,max(c['endMs'] for c in cues))*fps/1000)
scenes=[]
for i,layout in enumerate(layouts):
 start=0 if i==0 else cues[layout['firstCue']-1]['startFrame']
 end=cues[layouts[i+1]['firstCue']-1]['startFrame'] if i+1<len(layouts) else end_frames
 scenes.append(dict(**layout,id=f'S{i+1:02d}',startFrame=start,endFrame=end,durationFrames=end-start,startMs=0 if i==0 else cues[layout['firstCue']-1]['startMs'],endMs=cues[layouts[i+1]['firstCue']-1]['startMs'] if i+1<len(layouts) else audio_ms))
assert scenes[0]['startFrame']==0 and scenes[-1]['endFrame']==end_frames
assert all(a['endFrame']==b['startFrame'] for a,b in zip(scenes,scenes[1:]))
(ROOT/'src/data/cues.json').write_text(json.dumps(cues,ensure_ascii=False,indent=2),encoding='utf-8')
(ROOT/'src/data/scenes.json').write_text(json.dumps(scenes,ensure_ascii=False,indent=2),encoding='utf-8')
print('Wrote',len(cues),'cues',len(scenes),'scenes',end_frames,'frames (seconds)',end_frames/fps)
for s in scenes: print('%-3s %5.1f-%5.1f %-14s %s' % (s['id'],s['startFrame']/fps,s['endFrame']/fps,s['kind'],s['title']))
