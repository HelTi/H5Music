/**
 * Created by 29912 on 2017/5/24.
 */

(function ($, window) {
    var musicPlayer = function (options, data) {
        this.dom = getEle(options.domId);
        this.mDurationTime = 0;
        this.mCurrentTime = 0;
        //下一曲
        this.$nexDom = $(options.nexdom);
        //上一曲
        this.$preDom = $(options.predom);
        //播放，暂停
        this.$toogleDom = $(options.toogledom);
        //进度条
        this.$progressDom = $(options.progressdom);
        this.data = data;
        //歌曲列表,歌曲数量
        this.datalen = data.data.length;
        //正在播放的歌曲
        this.mPlayNow = 0;
        //歌名dom
        this.$authoDom = $(options.authodom)
    }

    musicPlayer.prototype = {

        init: function () {
            if (!this.dom) {
                throw new Error('请选择audio对象');
                return false;
            }
            this.mDurationTime = this.dom.duration;
            this.mCurrentTime = this.dom.currentTime;
            this.dom.play();
            var that = this;
            this.$nexDom.on('click', function () {
                that.playNext();
            })
            this.$preDom.on('click', function () {
                that.playPrev();
            })
            this.$toogleDom.on('click', function () {
                that.tooglePlay(that.dom);
            })

            //监听歌曲播放进度
            var m =this.dom;
            var proBarWidth = $('.progress').width();
            m.addEventListener('timeupdate', function () {
                var progressValue = m.currentTime / m.duration;
                var mtime = Math.floor(m.duration);
                var mnow = Math.floor(m.currentTime);
                // console.log('时长：' + mtime)
                if (!isNaN(m.duration)) {

                    if (progressValue == 1) {
                        progressValue = 0;
                    }
                    var barValue = Math.floor((m.currentTime / m.duration) * proBarWidth);
                    progressbar('.progress-bar', barValue);
                    slideBarProgress("#slide_btn", barValue);
                    playTime(mtime, mnow);
                }
            });
            m.addEventListener('ended', function () {
                $(".progress-bar").css('width', 0);
                that.playNext();
            })

        },
        playNext: function () {
            this.mPlayNow = (this.mPlayNow + 1) % this.datalen;
            this.mplayer(this.mPlayNow);
        },
        playPrev: function () {
            this.mPlayNow = (this.mPlayNow + this.datalen - 1) % (this.datalen);
            this.mplayer(this.mPlayNow)
        },
        mplayer: function (mplaynow) {
            this.dom.setAttribute('src', this.data.data[mplaynow].m_url);
            $(this.$authoDom).html(this.data.data[mplaynow].name);
            this.dom.play();
        },
        tooglePlay: function (dom) {
            console.log(dom)
            if (dom.paused) {
                dom.play()
            } else {
                dom.pause();
            }
        }

    }
    //不能返回jquery对象
    function getEle(id) {
        return document.getElementById(id);
    }

    //歌曲时间
    function playTime(time, timenow) {
        var $time_now = $(".m_time_now");
        var $time_t = $(".time_t");
        //分钟
        var minute = parseInt(time / 60) < 10 ? "0" + parseInt(time / 60) : parseInt(time / 60);
        //秒
        var second = (parseInt(time % 60) < 10) ? "0" + parseInt(time % 60) : parseInt(time % 60);
        //总时长
        var alltime = "" + minute + ":" + second;
        //分钟
        var n_minute = parseInt(timenow / 60) < 10 ? "0" + parseInt(timenow / 60) : parseInt(timenow / 60);
        //秒
        var n_second = (parseInt(timenow % 60) < 10) ? "0" + parseInt(timenow % 60) : parseInt(timenow % 60);
        //总时长
        var n_time = "" + n_minute + ":" + n_second;
        //console.log(alltime)
        $time_t.html(alltime);
        $time_now.html(n_time);
    }

    function progressbar(ele, percentage) {
        $(ele).css('width', percentage);
    }

    function slideBarProgress(ele, percentage) {
        $(ele).css('left', percentage);
    }

    window.musicPlayer = musicPlayer;
})($, window);

