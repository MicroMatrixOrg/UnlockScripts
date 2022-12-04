/**
 * @version v1.0.0
 * @origin 傻妞官方
 * @create_at 2022-09-08 09:27:18
 * @title 来个妹妹
 * @rule 来个妹妹
 * @rule 来个妹妹 ?
 * @rule 来个妹妹?
 * @description 🐒这个人很懒什么都没有留下。
 * @author 猫咪
 * @public true
 * @icon https://p.qqan.com/up/2022-6/16549158799370176.jpg
 */

const s = sender
s.recallMessage(s.getMessageId())
let param = s.param(1)
let baseUrl = "https://3650000.xyz/view/api.php";
let combinationUrl = ''
let coserName = ["过期米线线喵","抖娘利世" , "蜜汁猫裘",
"黑川" , "腐团儿" , "半半子" , "疯猫ss" , "小野妹子" , "秋和柯基",
"弥音音" , "念念_D" , "水淼aqua" , "白金Saki" , "蠢沫沫" , "三度_69",
"九曲Jean" , "你的负卿" , "周叽是可爱兔兔" , "菌烨Tako" , "起司块wii" ,
 "ElyEE_E子","南桃Momoko","抖娘利世","桜井宁宁","少女映画"]



// 图集名称返回
if(param == '图集名'){
    s.reply(coserName.join(','))
    
}

// 查询图片
if(coserName.includes(param)){
    switch (param){
        case "过期米线线喵": 
            combinationUrl = baseUrl + '?p=miao';
            break;
        case "少女映画":
            combinationUrl = baseUrl + '?p=1621436448';
            break;
        
        case "桜井宁宁":
            combinationUrl = baseUrl +'?p=1619508824';
            break;
        case "南桃Momoko":
            combinationUrl = baseUrl +'?p=nantao';
            break;
        case "抖娘利世":
            combinationUrl = baseUrl +'?p=douniang';
            break;
        case "蜜汁猫裘":
            combinationUrl = baseUrl + '?p=mizhimaoqiu';
            break;
        case "黑川":
            combinationUrl = baseUrl + "?p=heichuan";
            break;
        case "腐团儿":
            combinationUrl = baseUrl + "?p=futuaner";
            break;
        case "半半子":
            combinationUrl = baseUrl + "?p=banbanzi";
            break;
        case "疯猫ss":
            combinationUrl = baseUrl + "?p=fengmaoss";
            break;
        case "小野妹子":
            combinationUrl = baseUrl + "?p=xiaoye";
            break;
        
        case "秋和柯基":
            combinationUrl = baseUrl + "?p=qiu";
            break;
        case "弥音音":
            combinationUrl = baseUrl + "?p=miyinyinyin";
            break;
        case "念念_D":
            combinationUrl = baseUrl + "?p=niannian";
            break;
        case "水淼aqua":
            combinationUrl = baseUrl + "?p=shuimiao";
            break;
        case "白金Saki":
            combinationUrl = baseUrl + "?p=baijin";
            break;
        case "蠢沫沫":
            combinationUrl = baseUrl + "?p=chunmomo";
            break;
        case "三度_69":
            combinationUrl = baseUrl + "?p=sandu69";
            break;
        case "九曲Jean":
            combinationUrl = baseUrl + "?p=jiuqu";
            break;
        case "你的负卿":
            combinationUrl = baseUrl + "?p=fuqing";
            break;
        case "周叽是可爱兔兔":
            combinationUrl = baseUrl + "?p=zhouji";
            break;
        case "菌烨Tako":
            combinationUrl = baseUrl + "?p=junye";
            break;
        case "起司块wii":
            combinationUrl = baseUrl + "?p=qisikuai";
            break;
        case "ElyEE_E子":
            combinationUrl = baseUrl + "?p=elyee";
            break;
        
        default:
            combinationUrl = "http://3650000.xyz/random/";
    }
    const { headers } = request({
        url: combinationUrl,
        method: "get",
        allowredirects: false, //禁止重定向
    })

    s.reply(image(headers.Location))
}


