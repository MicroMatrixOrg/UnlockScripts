/**
 * @author muzi
 * @origin 木子科技
 * @create_at 2022-09-12 20:55:53
 * @description VIP影视解析，用法: 解析 http(s)://... 或者 视频解析
 * @public false
 * @icon https://s2.loli.net/2022/07/03/3xfm5RqMDTwEhnW.png
 * @version v1.0.0
 * @title  VIP影视解析
 * @rule 解析 ?
 * @rule 视频解析
 * @priority 66
 */


var parseInterfaces = [
  {
    name: 'B站1(推荐)',
    url: 'https://jx.bozrc.com:4433/player/?url=',
  },
  {
    name: '爱豆',
    url: 'https://jx.aidouer.net/?url=',
  },
  {
    name: 'BL',
    url: 'https://vip.bljiex.com/?v=',
  },
  {
    name: '冰豆',
    url: 'https://api.qianqi.net/vip/?url=',
  },
  {
    name: '百域',
    url: 'https://jx.618g.com/?url=',
  },
  {
    name: 'CK',
    url: 'https://www.ckplayer.vip/jiexi/?url=',
  },
  {
    name: 'CHok',
    url: 'https://www.gai4.com/?url=',
  },
  {
    name: 'ckmov',
    url: 'https://www.ckmov.vip/api.php?url=',
  },
  {
    name: '老板',
    url: 'https://vip.laobandq.com/jiexi.php?url=',
  },
  {
    name: 'MAO',
    url: 'https://www.mtosz.com/m3u8.php?url=',
  },
  {
    name: 'M3U8',
    url: 'https://jx.m3u8.tv/jiexi/?url=',
  },
  {
    name: '维多',
    url: 'https://jx.ivito.cn/?url=',
  },
  {
    name: '虾米',
    url: 'https://jx.xmflv.com/?url=',
  },
  {
    name: '180',
    url: 'https://jx.000180.top/jx/?url=',
  },
  {
    name: '4K',
    url: 'https://jx.4kdv.com/?url=',
  },
  {
    name: '8090',
    url: 'https://www.8090g.cn/?url=',
  },
];

function main() {
  const s = sender;
  const o = new Bucket("otto");
  const Q = new Bucket("qq");
  const sg = new SillyGirl();
  let admin = Q.get("masters");
  var userId = s.getUserId();
  var chatID = s.getChatId();
  var imtype = s.getPlatform();
  var username = s.getUsername();
  var sec = s.param(1);
  var i = 0;
  var reg = /^((ht|f)tps?):\/\/[\w-]+(\.[\w-]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?$/;
  var parseInterfacesName = parseInterfaces
    .map(function (v, i) {
      var num = i + 1;
      return "" + num + "：" + v.name + "";
    })
    .join("\n");
  var parseInterfacesUrl = [];

  while (sec == "" || sec) {
    i++;
    if (i > 6) return s.reply("输入错误次数过多，已退出。");
    if (sec === "q") return s.reply("已退出操作");
    if (!reg.test(sec) && !parseInterfacesUrl.length) {
      s.reply("请输入正确的链接，输入q退出");
      sec = s.listen().getContent();
    } else if (Number(sec) >= 0 && Number(sec) <= parseInterfaces.length) {
      sleep(1000);
      s.reply("" + parseInterfacesUrl[Number(sec - 1)] + "");
      sec = s.listen().getContent();
      return;
    } else {
      !parseInterfacesUrl.length &&
        (parseInterfacesUrl = parseInterfaces.map(function (v, i) {
          var jxurl = parseInterfaces[i].url + sec;
          if (imtype != "tg") {
            var tishi =
              "检测到你使用的平台不支持打开此链接，请复制到浏览器打开。";
          } else {
            var tishi = "请点击播放链接观影。";
          }
          return "播放地址：" + jxurl + "\n" + tishi;
        }));
      sleep(1000);
      s.reply(
        "请您选择需要的线路(输入序号)，输入q退出\n" + parseInterfacesName + ""
      );
      sec = s.listen().getContent();
    }
  }
}

main();
