//First lines are established variables clientId and code, nothing more
const clientId = "3cedf68c688a4659bb73cb08489c3d67"; // Replace with your client id
const params = new URLSearchParams(window.location.search);
const code = params.get("code");


/*If there isn't a code, then we use clientId in the function to authorize
 * If there is, accessToken is the output of getAccessToken, using both
 * of the variables from above. profile then uses that token to return
 * the profile. populateUI uses the profile later
*/

if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    const accessToken = await getAccessToken(clientId, code);
    const profile = await fetchProfile(accessToken);
    const userInfo = await getData(accessToken);
    const topInfoSong = await getTopSong(accessToken);
    const topInfoArtists = await getTopArtists(accessToken);
    const topAlbumsSaved = await getTopAlbums(accessToken);
    const artistsAndGenres = await getArtistsAndGenres(accessToken);
    populateUI(profile);
    populateUIRecent(userInfo)
    populateUITopSong(topInfoSong);
    populateUISavedAlbums(topAlbumsSaved);
    populateUITopArtists(topInfoArtists);
    populateArtistsAndGenres(artistsAndGenres);
}


//This is the function that uses clientId to redirect users to SAP
export async function redirectToAuthCodeFlow(clientId: string) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:5173/callback");
    params.append("scope", "user-read-private user-read-private user-read-email user-library-read user-top-read playlist-read-private user-read-currently-playing playlist-read-collaborative user-follow-read"); //add scopes here
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length: number) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier: string) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}


//This is the function that gets access token from clientID and code
export async function getAccessToken(clientId: string, code: string): Promise<string> {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:5173/callback");
    params.append("code_verifier", verifier!);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
}


//This is the function that fetches profile from the above token
async function fetchProfile(token : string) : Promise<UserProfile> {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    const data =  await result.json();
    return data;
}

async function getData(token : string) : Promise<any>{
    const result = await fetch("https://api.spotify.com/v1/me/tracks?limit=1&offset=0", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    const data = await result.json();
    return data;
}

async function getTopSong(token : string) : Promise<any>{
    const result = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=3&offset=0", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    const data = await result.json();
    return data;
}

async function getTopArtists(token : string) : Promise<any>{
    const result = await fetch("https://api.spotify.com/v1/me/top/artists?limit=3&offset=0", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    const data = await result.json();
    return data;
}

async function getTopAlbums(token : string) : Promise<any>{
    const result = await fetch("https://api.spotify.com/v1/me/albums?limit=3&offset=0", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    const data = await result.json();
    return data;
}

async function getArtistsAndGenres(token : string) : Promise<any>{
    const result = await fetch("https://api.spotify.com/v1/me/following?type=artist&limit=3", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });
    const data = await result.json();
    return data;
}


//This is the function that fills UI with profile data
function populateUI(profile: UserProfile) {
    document.getElementById("displayName")!.innerText = profile.display_name;
    document.getElementById("uri")!.innerText = profile.uri;
    document.getElementById("uri")!.setAttribute("href", profile.external_urls.spotify);
    document.getElementById("url")!.innerText = profile.href;
    document.getElementById("url")!.setAttribute("href", profile.href);
}


function populateUIRecent(topThings : any){
    document.getElementById("recent_save")!.innerText = topThings.items[0].track.name;
    document.getElementById("recent_save_artist")!.innerText = topThings.items[0].track.artists[0].name;
    document.getElementById("recent_save_genres")!.innerText = topThings.items[0].track.artists[0].genres;
}

function populateUITopSong(topSong : any){

    document.getElementById("top_song1")!.innerText = topSong.items[0].name;
    document.getElementById("top_song1_2")!.innerText = topSong.items[0].name;
    document.getElementById("top_song2")!.innerText = topSong.items[1].name;
    document.getElementById("top_song3")!.innerText = topSong.items[2].name;
    document.getElementById("top_song_popularity1")!.innerText = topSong.items[0].popularity;
    document.getElementById("top_song_popularity2")!.innerText = topSong.items[1].popularity;
    document.getElementById("top_song_popularity3")!.innerText = topSong.items[2].popularity;

    document.getElementById("top_song_artist")!.innerText = topSong.items[0].artists[0].name;
    document.getElementById("top_song_preview")!.innerText = topSong.items[0].preview_url;
    document.getElementById("top_song_preview")!.setAttribute("href", topSong.items[0].preview_url);
}

function populateUISavedAlbums(savedAlbumss : any){
    document.getElementById("saved_album_1")!.innerText = savedAlbumss.items[0].album.name;
    document.getElementById("saved_album_2")!.innerText = savedAlbumss.items[1].album.name;
    document.getElementById("saved_album_3")!.innerText = savedAlbumss.items[2].album.name;
}


function populateUITopArtists(topArtists : any){
    document.getElementById("top_artists1")!.innerText = topArtists.items[0].name;
    document.getElementById("top_artists2")!.innerText = topArtists.items[1].name;
    document.getElementById("top_artists3")!.innerText = topArtists.items[2].name;
}

function populateArtistsAndGenres(artistsAndGenres : any){
    document.getElementById("followed_artist_1")!.innerText = artistsAndGenres.artists.items[0].name;
    document.getElementById("followed_artist_2")!.innerText = artistsAndGenres.artists.items[1].name;
    document.getElementById("followed_artist_3")!.innerText = artistsAndGenres.artists.items[2].name;
    document.getElementById("related_genre_1")!.innerText = artistsAndGenres.artists.items[0].genres[0];
    document.getElementById("related_genre_2")!.innerText = artistsAndGenres.artists.items[1].genres[0];
    document.getElementById("related_genre_3")!.innerText = artistsAndGenres.artists.items[2].genres[0];
}
