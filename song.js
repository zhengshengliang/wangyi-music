window.$ = $;

const audio = document.createElement('audio');
class My163Music {
    init() {
        const regArr = location.search.match(/\bid=([^&]*)/) || [];
        const id = regArr[1] ? parseInt(regArr[1], 10) : 0;
        if (!id) {
            alert('获取歌曲ID失败');
            return;
        }

        this.getSongInfo(id);
        this.addEvent();
    };

    getSongInfo(id) {
        $.get('./songs.json')
            .then((res = []) => {
                const song = res.find(item => item.id === id);
                if (song) {
                    const {url , name, lyric} = song;
                    this.initPlayer.call(this, url);
                    this.initLyric(name, lyric);
                } else {
                    alert('查询歌曲失败');
                }
            });
    }
    initLyric(name, originLyric) {
        $('.song-name').text(name);

        const parsedLyric = this.parseLyric(originLyric);
        $('.song-lyric').text(parsedLyric);

    };

    parseLyric(originLyric) {
        console.log(originLyric);
    };
    initPlayer(src) {
        audio.src = src;

        audio.oncanplay = () => {
            audio.play();
            $('.song-player').addClass('playing');
        };
    };
    addEvent() {
        $('.icon-pause').on('touchstart', (e) => {
            e.stopPropagation(); // 阻止冒泡
            $('.song-player').addClass('playing');
            audio.play();
        });

        $('.disk-container').on('touchstart', () => {
            $('.song-player').removeClass('playing');
            audio.pause();
        });
    }
}


const my163Music = new My163Music();
my163Music.init();
