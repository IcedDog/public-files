import os

tsdeno = [1, 2, 4, 8, 16, 32, 64, 128]
beatConversion = 192
bpmMultiplier = 1000
autoBar = 2
barLength = 8
screenWidth = 352
fontSize = 16
charWidth = 3 * fontSize / 10
spaceWidth = 1 * fontSize / 10

debug = True

bpms = []
tss = []
chart = []
output = ''
template = ''


class TimingPoint:
    beat = 0
    originalBeat = 0
    type = 'B'
    bpm = 0
    note = 0
    bar = 0

    beatNum = 0
    beatBar = 0

    def __init__(self, originalBeat, type, a, b=-1):
        self.originalBeat = originalBeat
        self.type = type

        self.beat = originalBeat/beatConversion
        self.beatBar = int(self.beat/barLength)+1
        self.beatNum = self.beat % barLength+1

        if type == 'B':
            if b != -1 or a <= 0:
                raise Exception('Wrong structure')
            else:
                self.bpm = a/bpmMultiplier
        elif type == 'TS':
            self.note = a
            if b == -1:
                b = autoBar
            self.bar = tsdeno[b]
        else:
            raise Exception('Wrong structure')


def processStr(strin):
    str = strin.strip()
    count = 0
    output = []
    for i in str.split(' '):
        count += 1
        if i.isdigit():
            output.append(int(i))
        else:
            output.append(i)
    if output[1] != '=':
        raise Exception('Wrong structure')
    else:
        if count == 4:
            return TimingPoint(output[0], output[2], output[3])
        if count == 5:
            return TimingPoint(output[0], output[2], output[3], output[4])


def spaced(num, seperator: str):
    st = ''
    for i in range(num):
        a = i+1
        if a == 1:
            st += str(a)
        else:
            st = st + seperator+str(a)
    return st


def positioned(num):
    rtn = 0
    for i in range(num):
        a = i+1
        if a == 1:
            rtn += charWidth
        else:
            rtn += charWidth + spaceWidth
            if (a >= 10):
                rtn += charWidth
    return (screenWidth/2 - rtn)/screenWidth*100


if debug:
    print('start')

with open('template.txt', encoding='utf-8') as file:
    for line in file:
        template += line

with open('notes.chart', encoding='utf-8') as file:
    start = 0
    for line in file:
        if start == 2:
            if line.strip() == '}':
                start = 3
                if debug:
                    print('end')
            else:
                chart.append(processStr(line))
        if start == 1:
            if line.strip() != '{':
                raise Exception('Wrong structure')
            else:
                start = 2
                if debug:
                    print('2')
        if line.strip() == '[SyncTrack]':
            start = 1
            if debug:
                print('1')

firstBpm = True
firstTs = True
formerBar = 0
formerNote = 0
formerBeatBar = 0
formerBeatNote = 0
trackerBar = 0
trackerNote = 0
counter = 0
increment = 0
flag = 0
tid = 0
bp = 0
bpmCounter = -1
tsCounter = -1
reached = False
for timing in chart:
    if timing.type == 'B':
        if firstBpm:
            formatStr = '{ "bar": %s, "beat": %s, "y": 0, "type": "PlaySong", "filename": "song.ogg", "volume": 100, "pitch": 100, "pan": 0, "offset": 0, "bpm": %s, "loop": false },'\
                % (timing.beatBar, timing.beatNum, timing.bpm)
            firstBpm = False
        else:
            formatStr = '{ "bar": %s, "beat": %s, "y": 0, "type": "SetBeatsPerMinute", "beatsPerMinute": %s },'\
                % (timing.beatBar, timing.beatNum, timing.bpm)
        output += '        '
        output += formatStr
        output += '\n'
        bp = timing.bpm
        bpmCounter += 1
    if timing.type == 'TS':
        if firstTs:
            formerBeatBar = timing.beatBar
            formerBeatNote = timing.beatNum
            formerBar = timing.bar
            formerNote = timing.note
            firstTs = False
            formatStr = '{ "bar": %s, "beat": %s, "y": 2, "type": "PlaySound", "filename": "MetronomeClickHigh", "volume": 100, "pitch": 100, "pan": 0, "offset": 0, "isCustom": false, "customSoundType": "CueSound" },'\
                        % (trackerBar, trackerNote)
            output += '        '
            output += formatStr
            output += '\n'
        else:
            trackerBar = formerBeatBar
            trackerNote = formerBeatNote
            increment = 4/formerBar
            counter = 1
            start = []
            start.append((trackerBar, trackerNote, trackerBar, trackerNote))
            reached = False
            while (trackerBar < timing.beatBar) or ((not reached) or (trackerNote < timing.beatNum)):
                flag = 0
                if trackerBar >= timing.beatBar:
                    reached = True
                trackerNote += increment
                if trackerNote >= barLength+1:
                    delta = trackerNote - barLength - 1
                    trackerNote = 1 + delta
                    trackerBar += 1
                counter += 1
                if counter > formerNote:
                    counter = 1
                    flag = 1
                    tid += 1
                    if trackerNote < 1.01:
                        start.append((trackerBar-1, trackerNote +
                                     7.99, trackerBar, trackerNote))
                    else:
                        start.append((trackerBar, trackerNote -
                                     0.01, trackerBar, trackerNote))
                    if len(start) > 3:
                        start.pop(0)

                if flag == 0:
                    formatStr = '        { "bar": %s, "beat": %s, "y": 3, "type": "PlaySound", "filename": "MetronomeClickMid", "volume": 300, "pitch": 100, "pan": 0, "offset": 0, "isCustom": false, "customSoundType": "CueSound" },\n'\
                        % (trackerBar, trackerNote)
                    textStr = '        { "bar": %s, "beat": %s, "y": %s, "type": "AdvanceText", "id": %s },\n'\
                        % (trackerBar, trackerNote, tid % 4, tid)
                else:
                    formatStr = '        { "bar": %s, "beat": %s, "y": 2, "type": "PlaySound", "filename": "MetronomeClickHigh", "volume": 300, "pitch": 100, "pan": 0, "offset": 0, "isCustom": false, "customSoundType": "CueSound" },\n'\
                        % (start[-2][2], start[-2][3])
                    textStr = '        { "bar": %s, "beat": %s, "y": %s, "type": "FloatingText", "rooms": [4], "id": %s, "text": "%s", "times": "", "textPosition": [%s, 50], "size": 16, "angle": 0, "mode": "HideAbruptly", "showChildren": true, "color": "ffffff", "outlineColor": "000000ff", "anchor": "MiddleLeft", "fadeOutRate": %s, "narrate": true, "narrationCategory": "Notification" },\n'\
                        % (start[-2][2], start[-2][3], (tid-1) % 4, tid-1, spaced(formerNote, ' /'), positioned(formerNote), increment+0.02)
                    textStr += '        { "bar": %s, "beat": %s, "y": %s, "type": "FloatingText", "rooms": [0], "id": %s, "text": "%s|%s", "times": "", "textPosition": [50,15], "size": 18, "angle": 0, "mode": "HideAbruptly", "showChildren": true, "color": "ffae49", "outlineColor": "000000ff", "anchor": "MiddleCenter", "fadeOutRate": %s, "narrate": true, "narrationCategory": "Notification" },\n'\
                        % (start[-2][2], start[-2][3], tid % 4, (tid-1)*1000, formerNote, formerBar, increment*formerNote+0.02)
                    textStr += '        { "bar": %s, "beat": %s, "y": %s, "type": "FloatingText", "rooms": [0], "id": %s, "text": "BPM:%s", "times": "", "textPosition": [50,85], "size": 18, "angle": 0, "mode": "HideAbruptly", "showChildren": true, "color": "b5e61d", "outlineColor": "000000ff", "anchor": "MiddleCenter", "fadeOutRate": %s, "narrate": true, "narrationCategory": "Notification" },\n'\
                        % (start[-2][2], start[-2][3], (tid-3) % 4, (tid-1)*1001, bp, increment*formerNote+0.02)
                    textStr += '        { "bar": %s, "beat": %s, "y": %s, "type": "FloatingText", "rooms": [0], "id": %s, "text": "%s", "times": "", "textPosition": [20,87], "size": 12, "angle": 0, "mode": "HideAbruptly", "showChildren": true, "color": "99d9ea", "outlineColor": "000000ff", "anchor": "MiddleCenter", "fadeOutRate": %s, "narrate": true, "narrationCategory": "Notification" },\n'\
                        % (start[-2][2], start[-2][3], (tid-2) % 4, (tid-1)*1000000, bpmCounter, increment*formerNote+0.02)
                    textStr += '        { "bar": %s, "beat": %s, "y": %s, "type": "FloatingText", "rooms": [0], "id": %s, "text": "%s", "times": "", "textPosition": [80,87], "size": 12, "angle": 0, "mode": "HideAbruptly", "showChildren": true, "color": "99d9ea", "outlineColor": "000000ff", "anchor": "MiddleCenter", "fadeOutRate": %s, "narrate": true, "narrationCategory": "Notification" },'\
                        % (start[-2][2], start[-2][3], (tid-2) % 4, (tid-1)*1001000, tsCounter, increment*formerNote+0.02)
                    textStr += '        { "bar": %s, "beat": %s, "y": %s, "type": "FloatingText", "rooms": [0], "id": %s, "text": "%s", "times": "", "textPosition": [%s, 50], "size": 16, "angle": 0, "mode": "HideAbruptly", "showChildren": true, "color": "777777", "outlineColor": "000000ff", "anchor": "MiddleLeft", "fadeOutRate": %s, "narrate": true, "narrationCategory": "Notification" },\n'\
                        % (start[-2][0], start[-2][1], 4, (tid-1)*1001001, spaced(formerNote, ' '), positioned(formerNote), increment*formerNote+0.02)

                output += formatStr
                output += textStr
        formerBeatBar = timing.beatBar
        formerBeatNote = timing.beatNum
        formerBar = timing.bar
        formerNote = timing.note
        tsCounter += 1
        if debug:
            print(tid, end=' ')
trackerBar = formerBeatBar
trackerNote = formerBeatNote
increment = 4/formerBar
counter = 1
start = []
start.append((trackerBar, trackerNote, trackerBar, trackerNote))
reached = False
for i in range(4):
    flag = 0
    if trackerBar >= timing.beatBar:
        reached = True
    trackerNote += increment
    if trackerNote >= barLength+1:
        delta = trackerNote - barLength - 1
        trackerNote = 1 + delta
        trackerBar += 1
    counter += 1
    if counter > formerNote:
        counter = 1
        flag = 1
        tid += 1
        if trackerNote < 1.01:
            start.append((trackerBar-1, trackerNote +
                         7.99, trackerBar, trackerNote))
        else:
            start.append((trackerBar, trackerNote -
                         0.01, trackerBar, trackerNote))
        if len(start) > 3:
            start.pop()
    if flag == 0:
        formatStr = '        { "bar": %s, "beat": %s, "y": 3, "type": "PlaySound", "filename": "MetronomeClickMid", "volume": 300, "pitch": 100, "pan": 0, "offset": 0, "isCustom": false, "customSoundType": "CueSound" },\n'\
            % (trackerBar, trackerNote)
        textStr = '        { "bar": %s, "beat": %s, "y": %s, "type": "AdvanceText", "id": %s },\n'\
            % (trackerBar, trackerNote, tid % 4, tid)
    else:
        formatStr = '        { "bar": %s, "beat": %s, "y": 2, "type": "PlaySound", "filename": "MetronomeClickHigh", "volume": 300, "pitch": 100, "pan": 0, "offset": 0, "isCustom": false, "customSoundType": "CueSound" },\n'\
            % (start[-2][2], start[-2][3])
        textStr = '        { "bar": %s, "beat": %s, "y": %s, "type": "FloatingText", "rooms": [0], "id": %s, "text": "%s", "times": "", "textPosition": [%s, 19], "size": 10, "angle": 0, "mode": "HideAbruptly", "showChildren": true, "color": "ffffff", "outlineColor": "000000ff", "anchor": "MiddleLeft", "fadeOutRate": %s, "narrate": true, "narrationCategory": "Notification" },\n'\
            % (start[-2][2], start[-2][3], (tid-1) % 4, tid-1, spaced(formerNote, ' /'), positioned(formerNote), increment+0.02)
        textStr += '        { "bar": %s, "beat": %s, "y": %s, "type": "FloatingText", "rooms": [0], "id": %s, "text": "%s|%s", "times": "", "textPosition": [50,13], "size": 18, "angle": 0, "mode": "HideAbruptly", "showChildren": true, "color": "ffae49", "outlineColor": "000000ff", "anchor": "MiddleCenter", "fadeOutRate": %s, "narrate": true, "narrationCategory": "Notification" },\n'\
            % (start[-2][2], start[-2][3], tid % 4, (tid-1)*1000, formerNote, formerBar, increment*formerNote+0.02)
        textStr += '        { "bar": %s, "beat": %s, "y": %s, "type": "FloatingText", "rooms": [0], "id": %s, "text": "BPM:%s", "times": "", "textPosition": [50,85], "size": 18, "angle": 0, "mode": "HideAbruptly", "showChildren": true, "color": "b5e61d", "outlineColor": "000000ff", "anchor": "MiddleCenter", "fadeOutRate": %s, "narrate": true, "narrationCategory": "Notification" },\n'\
            % (start[-2][2], start[-2][3], (tid-3) % 4, (tid-1)*1001, bp, increment*formerNote+0.02)
        textStr += '        { "bar": %s, "beat": %s, "y": %s, "type": "FloatingText", "rooms": [0], "id": %s, "text": "%s", "times": "", "textPosition": [25,80], "size": 12, "angle": 0, "mode": "HideAbruptly", "showChildren": true, "color": "99d9ea", "outlineColor": "000000ff", "anchor": "MiddleCenter", "fadeOutRate": %s, "narrate": true, "narrationCategory": "Notification" },\n'\
            % (start[-2][2], start[-2][3], (tid-2) % 4, (tid-1)*1000000, bpmCounter, increment*formerNote+0.02)
        textStr += '        { "bar": %s, "beat": %s, "y": %s, "type": "FloatingText", "rooms": [0], "id": %s, "text": "%s", "times": "", "textPosition": [75,80], "size": 12, "angle": 0, "mode": "HideAbruptly", "showChildren": true, "color": "99d9ea", "outlineColor": "000000ff", "anchor": "MiddleCenter", "fadeOutRate": %s, "narrate": true, "narrationCategory": "Notification" },'\
            % (start[-2][2], start[-2][3], (tid-2) % 4, (tid-1)*1001000, tsCounter, increment*formerNote+0.02)
        textStr += '        { "bar": %s, "beat": %s, "y": %s, "type": "FloatingText", "rooms": [0], "id": %s, "text": "%s", "times": "", "textPosition": [%s, 19], "size": 10, "angle": 0, "mode": "HideAbruptly", "showChildren": true, "color": "aaaaaa", "outlineColor": "444444ff", "anchor": "MiddleLeft", "fadeOutRate": %s, "narrate": true, "narrationCategory": "Notification" },\n'\
            % (start[-2][2], start[-2][3], 4, (tid-1)*1001001, spaced(formerNote, ' '), positioned(formerNote), increment*formerNote+0.02)
    output += formatStr
    output += textStr


template = template.replace('&INSERT&', output)

with open('output.rdlevel', 'w', encoding='utf-8') as file:
    file.write(template)
