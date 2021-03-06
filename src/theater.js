function getPlayerByType(a) {
    return players[a]
}

function registerPlayer(a, b) {
    b.prototype = new DefaultVideo, b.prototype.type = a, b.prototype.getType = function() {
        return this.type
    }, players[a] = b
}

function onYouTubePlayerReady(a) {
    var b = theater.getPlayer(),
        c = b && b.getType();
    !b || "youtube" != c && "youtubelive" != c || b.onReady()
}

function livestreamPlayerCallback(a, b) {
    if ("ready" == a) {
        var c = theater.getPlayer();
        c && "livestream" == c.getType() && c.onReady()
    }
}
void 0 === window.swfobject && (window.swfobject = null), window.open = function() {
    return null
};
var theater = {
        VERSION: "1.1.7",
        playerContainer: null,
        playerContent: null,
        hdPlayback: !1,
        player: null,
        volume: 25,
        syncMaxDiff: 5,
        getPlayerContainer: function() {
            return null === this.playerContainer && (this.playerContainer = document.getElementById("player-container") || document.createElement("div")), this.playerContainer
        },
        getPlayerContent: function() {
            return null === this.playerContent && (this.playerContent = document.getElementById("content") || document.createElement("div")), this.playerContent
        },
        resetPlayer: function() {
            this.player && (this.player.onRemove(), delete this.player), this.getPlayerContainer().innerHTML = "<div id='player'></div>"
        },
        enablePlayer: function() {
            var a = this.getPlayerContainer();
            a.style.display = "block";
            var b = this.getPlayerContent();
            b.style.display = "none"
        },
        disablePlayer: function() {
            var a = this.getPlayerContainer();
            a.style.display = "none", this.resetPlayer();
            var b = this.getPlayerContent();
            b.style.display = "block"
        },
        getPlayer: function() {
            return this.player
        },
        loadVideo: function(a, b, c) {
            if (null !== a && null !== b) {
                if ("" === a) return void this.disablePlayer();
                c = Math.max(0, c);
                var d = this.getPlayer();
                if (null === d || d.getType() != a) {
                    this.resetPlayer(), this.enablePlayer();
                    var e = getPlayerByType(a);
                    if (null === e) return void(this.getPlayerContainer().innerText = "Video type not yet implemented.");
                    this.player = new e
                }
                this.player.setVolume(null !== this.volume ? this.volume : 25), this.player.setStartTime(c || 0), this.player.setVideo(b)
            }
        },
        setVolume: function(a) {
            this.volume = a, null !== this.player && this.player.setVolume(a)
        },
        seek: function(a) {
            var b = this.getPlayer();
            b && b.seek(a)
        },
        enableHD: function() {
            this.hdPlayback = !0
        },
        isHDEnabled: function() {
            return this.hdPlayback
        },
        sync: function(a) {
            if (null !== a && null !== this.player) {
                var b = this.player.getCurrentTime();
                null !== b && Math.abs(a - b) > this.syncMaxDiff && this.player.setStartTime(a)
            }
        },
        toggleControls: function(a) {
            null !== this.player && this.player.toggleControls(a)
        },
        enableCC: function() {
            this.closedCaptions = !0
        },
        isCCEnabled: function() {
            return this.closedCaptions
        }
    },
    players = [],
    DefaultVideo = function() {};
DefaultVideo.prototype = {
        player: null,
        lastVideoId: null,
        videoId: null,
        lastVolume: null,
        volume: .123,
        currentTime: 0,
        getCurrentTime: function() {
            return null
        },
        lastStartTime: 0,
        startTime: 0,
        setVolume: function(a) {},
        setStartTime: function(a) {},
        seek: function(a) {},
        onRemove: function() {},
        toggleControls: function() {}
    },
    function() {
        var a = function() {
            var a;
            this.setVideo = function(b) {
                this.lastStartTime = null, this.lastVideoId = null, this.videoId = b, a || (a = new YT.Player("player", {
                    height: "100%",
                    width: "100%",
                    videoId: b,
                    playerVars: {
                        autoplay: 1,
                        controls: 0,
                        iv_load_policy: 3,
                        cc_load_policy: theater.closedCaptions ? 1 : 0
                    },
                    events: {
                        onReady: onYouTubePlayerReady
                    }
                }))
            }, this.setVolume = function(a) {
                this.lastVolume = null, this.volume = a
            }, this.setStartTime = function(a) {
                this.lastStartTime = null, this.startTime = a
            }, this.seek = function(a) {
                null !== this.player && (this.player.seekTo(a, !0), 1 != this.player.getPlayerState() && this.player.playVideo())
            }, this.onRemove = function() {
                clearInterval(this.interval)
            }, this.getCurrentTime = function() {
                return null !== this.player ? this.player.getCurrentTime() : void 0
            }, this.canChangeTime = function() {
                return null !== this.player ? -1 != this.player.getVideoBytesTotal() && 3 != this.player.getPlayerState() : void 0
            }, this.think = function() {
                null !== this.player && (this.videoId != this.lastVideoId && (this.player.loadVideoById(this.videoId, this.startTime), this.lastVideoId = this.videoId, this.lastStartTime = this.startTime), -1 != this.player.getPlayerState() && (this.startTime != this.lastStartTime && (this.seek(this.startTime), this.lastStartTime = this.startTime), this.volume != this.lastVolume && (this.player.setVolume(this.volume), this.lastVolume = this.volume)))
            }, this.onReady = function() {
                this.player = a, theater.isHDEnabled() && this.player.setPlaybackQuality("hd720"), this.interval = setInterval(this.think.bind(this), 100)
            }
        };
        registerPlayer("youtube", a), registerPlayer("youtubelive", a);
        var b = function() {
            var a = this;
            this.froogaloop = null, this.setVideo = function(a) {
                this.videoId = a;
                var b = document.getElementById("player1");
                b && ($f(b).removeEvent("ready"), this.froogaloop = null, b.parentNode.removeChild(b));
                var c = "http://player.vimeo.com/video/" + a + "?api=1&player_id=player1",
                    d = document.createElement("iframe");
                d.setAttribute("id", "player1"), d.setAttribute("src", c), d.setAttribute("width", "100%"), d.setAttribute("height", "100%"), d.setAttribute("frameborder", "0"), document.getElementById("player").appendChild(d), $f(d).addEvent("ready", this.onReady)
            }, this.setVolume = function(a) {
                this.lastVolume = null, this.volume = a / 100
            }, this.setStartTime = function(a) {
                this.lastStartTime = null, this.startTime = Math.max(1, a)
            }, this.seek = function(a) {
                null !== this.froogaloop && a > 1 && this.froogaloop.api("seekTo", a)
            }, this.onRemove = function() {
                this.froogaloop = null, clearInterval(this.interval)
            }, this.think = function() {
                null !== this.froogaloop && (this.volume != this.lastVolume && (this.froogaloop.api("setVolume", this.volume), this.lastVolume = this.volume), this.startTime != this.lastStartTime && (this.seek(this.startTime), this.lastStartTime = this.startTime), this.froogaloop.api("getVolume", function(b) {
                    a.volume = parseFloat(b)
                }), this.froogaloop.api("getCurrentTime", function(b) {
                    a.currentTime = parseFloat(b)
                }))
            }, this.onReady = function(b) {
                a.lastStartTime = null, a.froogaloop = $f(b), a.froogaloop.api("play"), a.interval = setInterval(function() {
                    a.think(a)
                }, 100)
            }
        };
        registerPlayer("vimeo", b);
        var c = function() {
            var a = this;
            this.videoInfo = {}, this.embed = function() {
                if (this.videoInfo.channel && this.videoInfo.archive_id) {
                    var a = {
                            hostname: "www.twitch.tv",
                            channel: this.videoInfo.channel,
                            auto_play: !0,
                            start_volume: this.videoInfo.volume || theater.volume,
                            initial_time: this.videoInfo.initial_time || 0
                        },
                        b = this.videoInfo.archive_id.slice(1),
                        c = this.videoInfo.archive_id.substr(0, 1);
                    a.videoId = c + b, "c" == c ? a.chapter_id = b : a.archive_id = b;
                    var d = "http://www.twitch.tv/swflibs/TwitchPlayer.swf",
                        e = {
                            allowFullScreen: "true",
                            allowNetworking: "all",
                            allowScriptAccess: "always",
                            movie: d,
                            wmode: "opaque",
                            bgcolor: "#000000"
                        };
                    swfobject.embedSWF(d, "player", "100%", "104%", "9.0.0", !1, a, e)
                }
            }, this.setVideo = function(b) {
                this.lastVideoId = null, this.videoId = b;
                var c = b.split(",");
                if (this.videoInfo.channel = c[0], this.videoInfo.archive_id = c[1], null === this.player) {
                    this.lastVideoId = this.videoId, this.embed();
                    var d = 0,
                        e = setInterval(function() {
                            var b = document.getElementById("player");
                            b.mute && (clearInterval(e), a.onReady()), d++, d > 100 && (console.log("Error waiting for player to load"), clearInterval(e))
                        }, 33)
                }
            }, this.setVolume = function(a) {
                this.lastVolume = null, this.volume = a, this.videoInfo.volume = a
            }, this.setStartTime = function(a) {
                this.lastStartTime = null, this.startTime = a, this.videoInfo.initial_time = a
            }, this.seek = function(a) {
                this.setStartTime(a)
            }, this.onRemove = function() {
                clearInterval(this.interval)
            }, this.think = function() {
                this.player && (this.videoId != this.lastVideoId && (this.embed(), this.lastVideoId = this.videoId), this.startTime != this.lastStartTime && (this.embed(), this.lastStartTime = this.startTime), this.volume != this.lastVolume && (this.lastVolume = this.volume))
            }, this.onReady = function() {
                this.player = document.getElementById("player"), this.interval = setInterval(function() {
                    a.think(a)
                }, 100)
            }, this.toggleControls = function(a) {
                this.player.height = a ? "100%" : "104%"
            }
        };
        registerPlayer("twitch", c);
        var d = function() {
            var a = this;
            this.embed = function() {
                var a = {
                        hostname: "www.twitch.tv",
                        hide_chat: !0,
                        channel: this.videoId,
                        embed: 0,
                        auto_play: !0,
                        start_volume: 25
                    },
                    b = "http://www.twitch.tv/swflibs/TwitchPlayer.swf",
                    c = {
                        allowFullScreen: "true",
                        allowNetworking: "all",
                        allowScriptAccess: "always",
                        movie: b,
                        wmode: "opaque",
                        bgcolor: "#000000"
                    };
                swfobject.embedSWF(b, "player", "100%", "104%", "9.0.0", !1, a, c)
            }, this.setVideo = function(b) {
                if (this.lastVideoId = null, this.videoId = b, null === this.player) {
                    this.lastVideoId = this.videoId, this.embed();
                    var c = 0,
                        d = setInterval(function() {
                            var b = document.getElementById("player");
                            b.mute && (clearInterval(d), a.onReady()), c++, c > 100 && (console.log("Error waiting for player to load"), clearInterval(d))
                        }, 33)
                }
            }, this.setVolume = function(a) {
                this.lastVolume = null, this.volume = a
            }, this.onRemove = function() {
                clearInterval(this.interval)
            }, this.think = function() {
                this.player && (this.videoId != this.lastVideoId && (this.embed(), this.lastVideoId = this.videoId), this.volume != this.lastVolume && (this.lastVolume = this.volume))
            }, this.onReady = function() {
                this.player = document.getElementById("player"), this.interval = setInterval(function() {
                    a.think(a)
                }, 100)
            }, this.toggleControls = function(a) {
                this.player.height = a ? "100%" : "104%"
            }
        };
        registerPlayer("twitchstream", d);
        var e = function() {
            var a = this;
            this.lastState = null, this.state = null;
            var b = {
                    autostart: !0,
                    noads: !0,
                    showinfo: !1,
                    onsite: !0,
                    nopostroll: !0,
                    noendcap: !0,
                    showsharebutton: !1,
                    removebrandlink: !0,
                    skin: "BlipClassic",
                    backcolor: "0x000000",
                    floatcontrols: !0,
                    fixedcontrols: !0,
                    largeplaybutton: !1,
                    controlsalpha: ".0",
                    autohideidle: 1e3,
                    file: "http://blip.tv/rss/flash/123123123123"
                },
                c = {
                    allowFullScreen: "true",
                    allowNetworking: "all",
                    allowScriptAccess: "always",
                    wmode: "opaque",
                    bgcolor: "#000000"
                };
            swfobject.embedSWF("http://blip.tv/scripts/flash/stratos.swf", "player", "100%", "100%", "9.0.0", !1, b, c), this.setVideo = function(b) {
                if (this.lastVideoId = null, this.videoId = b, null === this.player) var c = 0,
                    d = setInterval(function() {
                        var b = document.getElementById("player");
                        b.addJScallback && (clearInterval(d), a.onReady()), c++, c > 100 && (console.log("Error waiting for player to load"), clearInterval(d))
                    }, 33);
                else this.player.sendEvent("pause")
            }, this.setVolume = function(a) {
                this.lastVolume = null, this.volume = a / 100
            }, this.setStartTime = function(a) {
                this.lastStartTime = null, this.startTime = a
            }, this.seek = function(a) {
                null !== this.player && this.player.sendEvent("seek", a)
            }, this.onRemove = function() {
                clearInterval(this.interval)
            }, this.think = function() {
                null !== this.player && (this.videoId != this.lastVideoId && (this.player.sendEvent("newFeed", "http://blip.tv/rss/flash/" + this.videoId), this.lastVideoId = this.videoId, this.lastVolume = null, this.lastStartTime = null), "playing" == this.player.getCurrentState() && (this.startTime != this.lastStartTime && (this.seek(this.startTime), this.lastStartTime = this.startTime), this.volume != this.lastVolume && (this.player.sendEvent("volume", this.volume), this.lastVolume = this.volume)))
            }, this.onReady = function() {
                this.player = document.getElementById("player"), this.interval = setInterval(function() {
                    a.think(a)
                }, 100)
            }
        };
        registerPlayer("blip", e);
        var f = function() {
            var a = this;
            this.embed = function() {
                var a = document.getElementById("player1");
                a && a.parentNode.removeChild(a);
                var b = document.createElement("iframe");
                b.setAttribute("id", "player1"), b.setAttribute("src", this.videoId), b.setAttribute("width", "100%"), b.setAttribute("height", "100%"), b.setAttribute("frameborder", "0"), document.getElementById("player").appendChild(b)
            }, this.setVideo = function(b) {
                if (this.lastVideoId = null, this.videoId = b, null === this.player) {
                    this.lastVideoId = this.videoId, this.embed();
                    var c = 0,
                        d = setInterval(function() {
                            var b = document.getElementById("player");
                            b && (clearInterval(d), a.onReady()), c++, c > 100 && (console.log("Error waiting for player to load"), clearInterval(d))
                        }, 33)
                }
            }, this.onRemove = function() {
                clearInterval(this.interval)
            }, this.think = function() {
                this.player && this.videoId != this.lastVideoId && (this.embed(), this.lastVideoId = this.videoId)
            }, this.onReady = function() {
                this.player = document.getElementById("player"), this.interval = setInterval(function() {
                    a.think(a)
                }, 100)
            }
        };
        registerPlayer("url", f);
        var g = function() {
            var a = {},
                b = "http://cdn.livestream.com/chromelessPlayer/wrappers/JSPlayer.swf",
                c = {
                    allowNetworking: "all",
                    allowScriptAccess: "always",
                    movie: b,
                    wmode: "opaque",
                    bgcolor: "#000000"
                };
            swfobject.embedSWF(b, "player", "100%", "100%", "9.0.0", "expressInstall.swf", a, c), this.setVideo = function(a) {
                this.lastVideoId = null, this.videoId = a
            }, this.setVolume = function(a) {
                this.lastVolume = null, this.volume = a / 100
            }, this.onRemove = function() {
                clearInterval(this.interval)
            }, this.think = function() {
                null !== this.player && (this.videoId != this.lastVideoId && (this.player.load(this.videoId), this.player.startPlayback(), this.lastVideoId = this.videoId), this.volume != this.lastVolume && (this.player.setVolume(this.volume), this.lastVolume = this.volume))
            }, this.onReady = function() {
                this.player = document.getElementById("player");
                var a = this;
                this.interval = setInterval(function() {
                    a.think(a)
                }, 100), this.player.setVolume(this.volume)
            }
        };
        registerPlayer("livestream", g);
        var h = function() {
            this.embed = function() {
                var a = document.getElementById("player1");
                a && a.parentNode.removeChild(a);
                var b = document.createElement("div");
                b.setAttribute("id", "player1"), b.style.width = "100%", b.style.height = "100%", b.innerHTML = this.videoId, document.getElementById("player").appendChild(b)
            }, this.setVideo = function(a) {
                this.lastVideoId = null, this.videoId = a, this.embed()
            }
        };
        registerPlayer("html", h);
        var i = function() {
            var a = document.getElementById("flashstream"),
                b = a && a.children[4],
                c = document.getElementById(a.parentNode.id);
            c.style.display = "initial", b && (document.getElementById("rhw_footer").style.display = "none", document.body.style.setProperty("overflow", "hidden"), b.style.setProperty("z-index", "99999"), b.style.setProperty("position", "fixed"), b.style.setProperty("top", "0"), b.style.setProperty("left", "0"), b.width = "100%", b.height = "105%", this.player = b), this.setVideo = function(a) {
                this.lastStartTime = null
            }, this.setVolume = function(a) {
                this.lastVolume = a, null !== this.player && this.player.jwSetVolume(a)
            }, this.setStartTime = function(a) {
                this.seek(a)
            }, this.seek = function(a) {
                if (null !== this.player) {
                    this.player.jwSetVolume(this.lastVolume);
                    var b = this.player.jwGetState();
                    ("BUFFERING" !== b || this.getBufferedTime() > a) && this.player.jwSeek(a), "IDLE" === b && this.player.jwPlay()
                }
            }, this.getCurrentTime = function() {
                return null !== this.player ? this.player.jwGetPosition() : void 0
            }, this.getBufferedTime = function() {
                return this.player.jwGetDuration() * this.player.jwGetBuffer()
            }, this.toggleControls = function(a) {
                this.player.height = a ? "100%" : "105%"
            }
        };
        registerPlayer("viooz", i)
    }(), window.onTheaterReady && onTheaterReady(), console.log("Loaded theater.js v" + theater.VERSION);