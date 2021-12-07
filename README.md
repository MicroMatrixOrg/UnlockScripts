# my_scripts
脚本备份

白嫖项目青龙脚本之-看看集
1. 项目介绍
微信阅读类项目，收益不错
2. 注册地址
微信扫码
![image](https://user-images.githubusercontent.com/21361701/143727534-752678cb-ac23-4a2e-a9e8-8e04e52739b1.jpg)

3.抓取参数
微信扫码打开上面网站后，打开抓包软件，返回微信，点击右上角三个点，点击刷新就可以抓取到参数
筛选url:ticket

复制ticket参数↓
![image (3)](https://user-images.githubusercontent.com/21361701/143727635-e341fafc-0131-4993-b529-a816a2cf41b9.jpg)

然后点击请求复制User-Agent参数↓
![image (4)](https://user-images.githubusercontent.com/21361701/143727642-51db85d6-9c81-430d-ba06-a164b277d2c1.jpg)

然后到青龙面板配置文件添加下面代码
#看看集 
export soy_kkj_ticket='上面抓取的ticket' 
export soy_kkj_UA='上面抓取的User-Agent'




白嫖项目青龙脚本之-聚看点
1. 项目介绍
阅读类app，满阅读时常送金币，金币兑换现金10000金币=1元。满2可提现，30无门槛
2. 下载地址
http://a.app.qq.com/o/simple.jsp?ctx=1636797108749&pkgname=com.xiangzi.jukandian&ckey=CK1416436838701
记得填写作者的邀请码喔:18820089(必得金币)
3. 抓取参数
打开抓包后进入聚看点app点击我的，点击头像，再点击头像。就可获取到参数了
![image (1)](https://user-images.githubusercontent.com/21361701/143727586-9632d613-235e-41a1-8ba6-82fc3a757541.jpg)

筛选url:favicon.ico
请求的ck里面有xz_jkd_appkey这个参数，复制=号到！之间的数据。
4. 添加变量
到青龙面板配置文件尾部添加下面代码
### 聚看点
export jkdhd='{"openid": "填入刚才复制的内容"}' 
export jkdck='{"Cookie":"xz_jkd_appkey=填入刚才复制的内容"}'



##滴滴果园
小程序进入滴滴果园，首页，5天水果
抓包
https://game.xiaojukeji.com/api/game/mission/get?... """整条url
