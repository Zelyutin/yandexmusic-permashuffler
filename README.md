# Permanent playlist shuffle script for Yandex Music

Browser console script that allows to permanently shuffle your playlist.
### Permanent shuffle is better than default shuffle mode because:
- Every track is guaranteed to play
- You can restore your current track after app exit

## Instruction

1) Open playlist you want to shuffle
<img width="920" height="657" alt="image" src="https://github.com/user-attachments/assets/ee520152-1495-4665-bebd-d200329d34f1" />

2) Open dev instruments in browser (Ctrl/Cmd + Shift + I), see image below and do these actions:
- Go to Network tab
- Enable filters with filter button 
- Clear network log with clear button
- Enter "change" in filter field
- Enable Fetch/XHR type filter
- Move one track manually in your playlist before the other (change the position) in Yandex Music interface (as usual user)
- Pick "change-relative" request appeared in Network log
- Go to "Preview" tab on request window on the right side of the log
- Find "kind" and "uid" parameters
- Copy them or write down

<img width="1172" height="517" alt="image" src="https://github.com/user-attachments/assets/962d9ce6-4682-4982-8896-0b8f2916f00f" />

3) Paste script from yandex-music-shuffle.js into browser Console and set "playlistId" and "userId" values from "kind" and "uid" values copied before accordingly
<img width="1165" height="773" alt="image" src="https://github.com/user-attachments/assets/483d49fc-f8b7-433f-99f3-6e5c738533e3" />

4) Press Enter and watch your whole playlist shuffle
<img width="1151" height="709" alt="image" src="https://github.com/user-attachments/assets/c194231b-48e4-40df-aeee-cbaf0844326a" />

5) Wait for the last message for completion and enjoy your new playlist order!
