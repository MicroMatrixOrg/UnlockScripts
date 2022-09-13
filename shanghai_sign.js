const puppeteer = require(`puppeteer`);
const axios = require(`axios`);
function Env (t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send (t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get (t) { return this.send.call(this.env, t) } post (t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode () { return "undefined" != typeof module && !!module.exports } isQuanX () { return "undefined" != typeof $task } isSurge () { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon () { return "undefined" != typeof $loon } toObj (t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr (t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson (t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson (t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript (t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript (t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata () { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata () { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get (t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set (t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata (t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata (t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval (t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval (t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv (t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get (t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post (t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time (t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg (e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log (...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr (t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait (t) { return new Promise(e => setTimeout(e, t)) } done (t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }

const sendMessage = (title = "填写失败", content) => {
  axios.get(`http://www.pushplus.plus/send`, { params: { token: `4d2717a4dbfd4bcf97ce78d8a14a12a5`, title: title, content: content, } })
}

async function handleSubmit (page) {
  await page.$$eval(`a[role='button']`, divs => {
    for (let i = 0; i < divs.length; i++) {
      if (divs[i].innerText === "确定") {
        return divs[i].click();
      }
    }
  })
}

// 每日一报实际脚本
const dayReportFun = async (page) => {

  // console.log(`进来了`, page);

  const promiseBtn = await page.$(`input#p1_ChengNuo-inputEl`);
  await promiseBtn.evaluate(b => b.click());
  const inShangHaiBtn = await page.$(`input#fineui_7-inputEl`)
  await inShangHaiBtn.evaluate(b => b.click());

  const needGoSchoolBtn = await page.$(`input#fineui_22-inputEl`)
  await needGoSchoolBtn.evaluate(b => b.click())
  const riskArea = await page.$(`input#fineui_26-inputEl`)
  await riskArea.evaluate(b => b.click());
  const contiguityBtn = await page.$(`input#fineui_31-inputEl`)
  await contiguityBtn.evaluate(b => b.click())
  const quarantineBtn = await page.$(`input#fineui_33-inputEl`)
  await quarantineBtn.evaluate(b => b.click())


  await page.waitForSelector(`input#fineui_11-inputEl`, { visible: true }).then(async () => {

    const schoolAreaName = await page.$(`input#fineui_11-inputEl`)
    await schoolAreaName.evaluate(b => { if (!b.checked) b.click() });

    // 点击确定
    const submitReportBtn = await page.$(`a#p1_ctl01_btnSubmit`)
    await submitReportBtn.click();
    await page.waitForSelector(`div.f-messagebox-confirm`)
    await handleSubmit(page)


    await page.waitForSelector(`div.f-messagebox-alert`)
    await handleSubmit(page)
  })
  // return new Promise(async (resolve) => {
  //   resolve(true)
  // })
}

let southDoor = async (page) => {
  // 常态化申请
  const permissionB1 = await page.$('input#persinfo_XiZhi-inputEl')
  await permissionB1.evaluate(b => b.click())
  const otherPermissionBtns = await page.$$eval("input[id^=persinfo_ChengNuo]", doms => {
    let visibleDoms = [];
    for (let i = 0; i < doms.length; i++) {
      let domRect = doms[i].getBoundingClientRect()
      if (domRect.x == 0 && domRect.y == 0 && domRect.width == 0 && domRect.height == 0) {

      } else {
        doms[i].click()
        visibleDoms.push(doms[i])
      }
    }
    return visibleDoms
  })
  const copyA = await page.$('a#persinfo_ctl01_btnCopy')
  await copyA.evaluate(b => b.click())
  await page.waitForSelector(`a[role=button][id^='fineui_'] > span.f-btn-inner > span.f-btn-text`).then(async () => {
    const alertBtn = await page.$(`a[role=button][id^='fineui_'] > span.f-btn-inner > span.f-btn-text`)
    await alertBtn.click()
  })


  await page.$eval(`input#persinfo_JinCRQ-inputEl`, el => {
    let today = new Date();
    today.setTime(today.getTime() + 24 * 60 * 60 * 1000);
    let tomorrow = today.getFullYear() + `-` + (today.getMonth() + 1) + `-` + today.getDate();
    el.value = tomorrow
  })
  const submitConfirmCTH = await page.$(`a#persinfo_ctl01_btnSubmit`);
  await submitConfirmCTH.click()


  await page.waitForSelector(`a[role=button][id^='fineui_'] > span.f-btn-inner > span.f-btn-text`).then(async () => {
    const errorInnerHtml = await page.$eval(`.f-messagebox-message`, el => {
      if (el.innerHTML.startsWith(`无72小时内有效的采样信息`)) {
        return el.innerHTML;
      }
    })
    const alertBtn = await page.$(`a[role=button][id^='fineui_'] > span.f-btn-inner > span.f-btn-text`)
    await alertBtn.click()
    if (errorInnerHtml) {
      sendMessage(errorInnerHtml)
    }
  })

}

const getReportList = async (page,browser) => {
  await page.waitForNavigation({
    waitUntil: `load`,
  })
  let reportList = await page.$$eval(`a[href]`, items => {
    let href = []
    for (let i = 0; i < items.length; i++) {
      if (i < 14 && items[i].innerText.includes("未填报")) {
        href.push(items[i].href)
      }
      if (i == 14) {
        break;
      }
    }
    return href;
  });
  let willReportList = [...reportList]
  for (let i = willReportList.length - 1; i >= 0; i--) {
    const newPage = await browser.newPage();
    await newPage.goto(willReportList[i]).then(async () => {
      await dayReportFun(newPage)
    });

  }
}

let login = async (page, accountName, accountPassword) => {

  await page.goto('https://selfreport.shu.edu.cn/Default.aspx');
  // if(/login/g.exec(page.url())){
  const username = await page.$(`input#username`);
  await username.type(accountName);

  const password = await page.$(`input#password`);
  await password.type(accountPassword);

  const submitBtn = await page.$(`button#submit-button`);
  await submitBtn.click();
  //}
  return await page.waitForNavigation({
    waitUntil: `load`,
  })
}

let dayReport = (page) => {
  return new Promise(async (resolve, reject) => {
    // 每日一报
    const lbReport = await page.$(`a#lnkReport`);
    await lbReport.click();

    await page.waitForNavigation({
      waitUntil: `load`,
    })


    let daysOut14 = false
    try {
      daysOut14 = await page.$eval(`.f-messagebox-message`, (el) => {
        return el.innerHTML.includes(`历史过去14天`)
      })

    } catch (error) {

    }
    if (daysOut14) {
      // console.log(`侦查到未补保全`);
      await page.waitForSelector(`a[role=button][id^='fineui_'] > span.f-btn-inner > span.f-btn-text`).then(async () => {
        const alertBtns = await page.$$(`a[role=button][id^='fineui_'] > span.f-btn-inner > span.f-btn-text`)
        await alertBtns[1].click();
        await getReportList(page,browser)
      })

    } else {
      await dayReportFun(page)
    }
    let currentUrl = page.url()
    if (currentUrl.includes(`https://selfreport.shu.edu.cn/Default.aspx`)) {

      await page.waitForNavigation({
        waitUntil: `load`,
      })
      let normalizeA = await page.$(`a[href^='XiaoYJ']`)
      if (normalizeA) {
        await normalizeA.click()
      }
    }
    resolve(true);
  })
}

let main = async () => {
  const $ = new Env('上海大学签到');
  let accounts = process.env.signAccount.split(",")
  let msg = ""
  for (let i = 0; i < accounts.length; i++) {
    let temAccount = accounts[i].split("&")
    let username = temAccount[0];
    let password = temAccount[1];
//     const browser = await puppeteer.launch({ devtools: true });
    const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium-browser', args: [ '--disable-gpu', '--disable-setuid-sandbox', '--no-sandbox', '--no-zygote' ] });
    const page = await browser.newPage();
    console.log("开始签到", username)
    await login(page, username, password);
    // 进入每日一报
    let result = await dayReport(page,browser);
    if (result) {
      if (page.url().includes("JiaoZGJCSQ_List.aspx")) {
        await page.waitForSelector("a[id=p1_ctl00]").then(async () => {
          const toSouthDoor = await page.$("a[id=p1_ctl00]")
          await toSouthDoor.click()
          await page.waitForNavigation({
            waitUntil: `load`,
          })
          await southDoor(page)
        })
      } else if (page.url().includes("/JiaoZGJCSQ.aspx")) {
        await southDoor(page)
      }
      msg += `${username}上报成功 \n`
      console.log(`${username}上报成功`)
    }
    sendMessage("上报成功", `${username}上报成功`)
    await browser.close();
  }
}
main()
