// Read copy-i-like-en.md and paste this script into browser Console
// Прочитайте copy-i-like.md и вставьте данный скрипт в Консоль браузера согласно инструкции

async function copyTracks() {
	let revision = 1;

	console.info(`Copying of ${tracks.length} tracks is started!`);
	for(let i = 0; i < tracks.length; i++) {
		const current = i;
		const track = tracks[current];
		const from = current;
		const to = 0; // Shuffling each track at the beginning
		const trackId = track.id;
		const albumId = track.albumId;

		const params = new URLSearchParams({
			diff: JSON.stringify([{ op: "insert", at: current, tracks: [{ id: trackId, albumId }] }]),
			revision: revision,
		});
		const result = await fetch(`https://api.music.yandex.ru/users/${userId}/playlists/${newPlaylistId}/change-relative?${params.toString()}`, {
			"headers": getHeaders(),
			"referrer": "https://music.yandex.ru/",
			"body": null,
			"method": "POST",
			"mode": "cors",
			"credentials": "include"
		});
		const data = await result.json();
		
		revision++;

		console.log(`[${i+1}/${tracks.length}] Track ${trackId}:${albumId} copied to position ${i}`);

		if(sleepTime) await sleep(sleepTime);
	};
	console.info(`Copying of ${tracks.length} tracks is completed!`);
}
function getUser() {
	const el = document.querySelector('.UserWidget-Iframe');
	if(el === undefined) throw Error('No UserWidget-Iframe, specify <userId> manually');

	const uid = new URL(el.getAttribute('src') ?? '')?.searchParams?.get('uid');
	if(!uid) throw Error('No uid, specify <userId> manually');

	console.info(`User id found: ${uid}`);
	return Number(uid);
}
async function getPlaylist() {
	const result = await fetch(`https://api.music.yandex.ru/landing-blocks/collection/playlist-with-likes?count=50`, {
		"headers": getHeaders(),
		"referrer": "https://music.yandex.ru/",
		"body": null,
		"method": "GET",
		"mode": "cors",
		"credentials": "include"
	});
	const data = await result.json();

	const playlist = data?.playlist?.playlistUuid;
	if(!playlist) throw Error("Playlist with likes doesn't found");

	console.info(`Playlist id found: ${playlist}`);
	return playlist;
}
async function getTracks() {
	const result = await fetch(`https://api.music.yandex.ru/playlist/${playlistId}?resumeStream=false&richTracks=false`, {
		"headers": getHeaders(),
		"referrer": "https://music.yandex.ru/",
		"body": null,
		"method": "GET",
		"mode": "cors",
		"credentials": "include"
	});
	const data = await result.json();

	return data.tracks;
}
async function createPlaylist() {
	const title = `I LIKE – COPY`;
	const result = await fetch(`https://api.music.yandex.ru/users/${userId}/playlists/create?visibility=public&title=${title}`, {
		"headers": getHeaders(),
		"referrer": "https://music.yandex.ru/",
		"body": null,
		"method": "POST",
		"mode": "cors",
		"credentials": "include"
	});
	const data = await result.json();

	if(data.kind) {
		console.info(`Playlist with name ${title} is created!`);
	}
	return data.kind;
}

function getHeaders() {
	return {
		"accept": "*/*",
		"accept-language": "ru",
		"cache-control": "no-cache",
		"sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
		"sec-ch-ua-mobile": "?0",
		"sec-ch-ua-platform": "\"Windows\"",
		"sec-fetch-dest": "empty",
		"sec-fetch-mode": "cors",
		"sec-fetch-site": "same-site",
		"x-request-id": "17b3d621-6b22-4439-b27d-bcab64929be4",
		"x-requested-with": "XMLHttpRequest",
		"x-retpath-y": "https://music.yandex.ru/",
		"x-yandex-music-client": "YandexMusicWebNext/1.0.0",
		"x-yandex-music-multi-auth-user-id": userId,
		"x-yandex-music-without-invocation-info": "1"
	}
}
function sleep(ms) {
	return new Promise((resolve, reject) => setTimeout(() => resolve(), ms));
}

const sleepTime = 200;
const userId = getUser();

const playlistId = await getPlaylist();
if(sleepTime) await sleep(sleepTime);

let tracks = await getTracks();
if(sleepTime) await sleep(sleepTime);

let newPlaylistId = await createPlaylist();
if(sleepTime) await sleep(sleepTime);

await copyTracks();
