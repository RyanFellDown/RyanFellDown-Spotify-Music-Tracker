interface UserProfile {
    country: string;
    display_name: string;
    email: string;
    explicit_content: {
        filter_enabled: boolean,
        filter_locked: boolean
    },
    external_urls: { 
        spotify: string; 
    };
    followers: { 
        href: string; 
        total: number; 
    };
    href: string;
    id: string;
    images: Image[];
    product: string;
    type: string;
    uri: string;
}

interface TopItems{
    href: string;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
    items: Items[];
}

interface Items{
    artistObject: {
        external_urls: {
            spotify: string;
        }
        followers: { 
            href: string; 
            total: number; 
        }
        genres: string[];
        href: string;
        id: string;
        images: Image[];
        name: string;
        popularity: number;
        type: string;
        uri: string;
    }
    trackObject: {
        album: {
            album_type: string;
            total_tracks: number;
            available_markets: string[];
            external_urls: {
                spotify: string;
            }
            href: string;
            id: string;
            images: Image[];
            releast_date: string;
            release_date_precision: string;
            restrictions: {
                reason: string;
            }
            type: string;
            uri: string;
            artists: SimplifiedArtistObject[];
        }
        artists: ArtistObject[];
        available_markets: string[];
        disc_number: number;
        duration_ms: number;
        explicit: boolean;
        external_ids: {
            isrc: string;
            ean: string;
            upc: string;
        }
        external_urls: {
            spotify: string;
        }
        href: string;
        id: string;
        is_playable: boolean;
        linked_from: {
        }
        restrictions: {
            reason: string;
        }
        name: string;
        popularity: number;
        preview_url: string;
        track_number: number;
        type: string;
        uri: string;
        is_local: boolean;
    }
}

interface Image {
    url: string;
    height: number;
    width: number;
}

interface SimplifiedArtistObject{
    external_urls: {
        spotify: string;
    }
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}

interface ArtistObject{
    external_urls: {
        spotify: string;
    }
    followers: {
        followers: {
            href: string;
            total: number;
        }
    }
    genres: string[];
    href: string;
    id: string;
    images: Image[];
    name: string;
    popularity: number;
    type: string;
    uri: string;
}