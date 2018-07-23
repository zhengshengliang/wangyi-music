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

        const parsedLyric = this.parseLyric(originLyric) || [];

        parsedLyric.forEach(item => {
            if (item) {
                const $p = $('<p></p>');
                $p.attr('data-time', item.time);
                $p.text(item.piece);
                $('.song-lyric').append($p);
            }
        });
    };

    parseLyric(originLyric) {
        const pieces = originLyric.split('\n');

        const regex = /^\[(.+)\](.*)$/;
        const pieceArr = pieces.map(item => {
            const matches = item.match(regex);
            if (matches) {
                return {
                    time: matches[1],
                    piece: matches[2],
                }
            }
        });
        return pieceArr;

    };
    initPlayer(src) {
        audio.src = src;

        audio.oncanplay = () => {
            audio.play();
            $('.song-player').addClass('playing');
        };

        const clock = setInterval(() => {
            // 59.151343 => 00:59.989869
            const preciseSeconds = audio.currentTime; // 当前秒数 59.151343 很精确
            const minutes = ~~(preciseSeconds / 60); // 当前分钟
            const left = preciseSeconds - minutes * 60; //
            const time = `${this.pad(minutes)}:${this.pad(left)}`;

            // 获取当前高亮行
            const $lines = $('.song-lyric > p');
            let $highLight = '';
            for (let i = 0; i < $lines.length; i++) {
                const currentTime = $lines.eq(i).attr('data-time');
                const nextTime = $lines.eq(i + 1).attr('data-time');
                if (nextTime.length === 0) {
                    clearInterval(clock);
                    return;
                }
                if (currentTime < time && time < nextTime) {
                    $highLight = $lines.eq(i);
                    break;
                }
            }

            // 移动高亮行
            if ($highLight) {
                $highLight.addClass('active').prev().removeClass('active');
                const top = $highLight.offset().top;
                let linesTop = $('.song-lyric').offset().top;
                let delta = top - linesTop - $('.song-lyric').height()/3;
                $('.song-lyric').css('transform', `translateY(-${delta}px)`)
            }


        }, 300);


    };
    pad(number){
        return number>=10 ? number + '' : '0' + number
    }
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
