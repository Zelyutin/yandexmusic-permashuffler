// Read i-like-en.md and paste this script into browser Console
// Прочитайте i-like.md и вставьте данный скрипт в Консоль браузера согласно инструкции

async function shuffleTracks() {
	console.info(`Shuffling of ${tracks.length} tracks is started!`);
	for(let i = 0; i < tracks.length; i++) {
		const current = randomIntFromInterval(i == 0 ? 1 : i, tracks.length - 1); // Condition for preventing self-shuffling
		const track = tracks[current];
		const from = current;
		const to = 0; // Shuffling each track at the beginning
		const trackId = track.id;
		const albumId = track.albumId;

		const resultRemove = await fetch(`https://api.music.yandex.ru/users/${userId}/likes/tracks/${trackId}:${albumId}/remove`, {
			"headers": getHeaders(),
			"referrer": "https://music.yandex.ru/",
			"body": null,
			"method": "POST",
			"mode": "cors",
			"credentials": "include"
		});
		const dataRemove = await resultRemove.json();

		const resultAdd = await fetch(`https://api.music.yandex.ru/users/${userId}/likes/tracks/add?track-id=${trackId}:${albumId}`, {
			"headers": getHeaders(),
			"referrer": "https://music.yandex.ru/",
			"body": null,
			"method": "POST",
			"mode": "cors",
			"credentials": "include"
		});
		const dataAdd = await resultAdd.json();
		
		tracks.splice(current, 1);
		tracks.unshift(track);

		console.log(`Track ${trackId}:${albumId} moved from ${from} to ${tracks.length - i}`);
	};
	console.info(`Shuffling of ${tracks.length} tracks is completed!`);
}

function randomIntFromInterval(min, max) { // min and max included 
	return Math.floor(Math.random() * (max - min + 1) + min);
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

const userId = getUser();
const playlistId = await getPlaylist();
let tracks = await getTracks();

shuffleTracks();