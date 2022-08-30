const puppeteer = require("puppeteer");
const axios = require("axios");
(async () => {
  const browser = await puppeteer.launch({ devtools: true });
  const page = await browser.newPage();
  const sendMessage = (content) => {
    axios.get("http://www.pushplus.plus/send", { params: { token: "4d2717a4dbfd4bcf97ce78d8a14a12a5", title: "填写失败", content: content, } })
  }

  // 每日一报实际脚本
  const dayReportFun = async (page) => {

    // console.log("进来了", page);

    const promiseBtn = await page.$("input#p1_ChengNuo-inputEl");
    await promiseBtn.evaluate(b => b.click());
    const inShangHaiBtn = await page.$("input#fineui_7-inputEl")
    await inShangHaiBtn.evaluate(b => b.click());

    const needGoSchoolBtn = await page.$("input#fineui_22-inputEl")
    await needGoSchoolBtn.evaluate(b => b.click())
    const riskArea = await page.$("input#fineui_26-inputEl")
    await riskArea.evaluate(b => b.click());
    const contiguityBtn = await page.$("input#fineui_31-inputEl")
    await contiguityBtn.evaluate(b => b.click())
    const quarantineBtn = await page.$("input#fineui_33-inputEl")
    await quarantineBtn.evaluate(b => b.click())


    await page.waitForSelector("input#fineui_11-inputEl", { visible: true }).then(async () => {

      const schoolAreaName = await page.$("input#fineui_11-inputEl")
      await schoolAreaName.evaluate(b => { if (!b.checked) b.click() });

      // 点击确定
      const submitReportBtn = await page.$("a#p1_ctl01_btnSubmit")
      await submitReportBtn.click();
      await page.waitForSelector("a#fineui_39")
      const subAlert = await page.$("a#fineui_39")
      await subAlert.evaluate(b => b.click());

      await page.waitForSelector("a#fineui_44")
      const subConfirm = await page.$("a#fineui_44")
      await subConfirm.evaluate(b => b.click());
    })
    // return new Promise(async (resolve) => {
    //   resolve(true)
    // })
  }

  let southDoor = async () => {
    // 常态化申请
    const permissionB1 = await page.$("input#persinfo_XiZhi-inputEl")
    await permissionB1.evaluate(b => b.click())
    const permissionB2 = await page.$("input#persinfo_ChengNuo1-inputEl")
    await permissionB2.evaluate(b => b.click())
    const permissionB3 = await page.$("input#persinfo_ChengNuo2-inputEl")
    await permissionB3.evaluate(b => b.click())
    const permissionB4 = await page.$("input#persinfo_ChengNuo3-inputEl")
    await permissionB4.evaluate(b => b.click())
    const copyA = await page.$("a#persinfo_ctl01_btnCopy")
    await copyA.evaluate(b => b.click())
    await page.waitForSelector("a[role=button][id^='fineui_'] > span.f-btn-inner > span.f-btn-text").then(async () => {
      const alertBtn = await page.$("a[role=button][id^='fineui_'] > span.f-btn-inner > span.f-btn-text")
      await alertBtn.click()
    })


    await page.$eval("input#persinfo_JinCRQ-inputEl", el => {
      let today = new Date();
      today.setTime(today.getTime() + 24 * 60 * 60 * 1000);
      let tomorrow = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
      el.value = tomorrow
    })
    const submitConfirmCTH = await page.$("a#persinfo_ctl01_btnSubmit");
    await submitConfirmCTH.click()


    await page.waitForSelector("a[role=button][id^='fineui_'] > span.f-btn-inner > span.f-btn-text").then(async () => {
      const errorInnerHtml = await page.$eval(".f-messagebox-message", el => {
        if (el.innerHTML.startsWith("无72小时内有效的采样信息")) {
          return el.innerHTML;
        }
      })
      const alertBtn = await page.$("a[role=button][id^='fineui_'] > span.f-btn-inner > span.f-btn-text")
      await alertBtn.click()
      if (errorInnerHtml) {
        sendMessage(errorInnerHtml)
      }
    })

  }

  const getReportList = async () => {
    await page.waitForNavigation({
      waitUntil: "load",
    })
    let reportList = await page.$$eval("a[href]", items => items.map(item => item.href));
    let willReportList = reportList.splice(-1)
    for (let i = willReportList.length - 1; i >= 0; i--) {
      const newPage = await browser.newPage();
      await newPage.goto(willReportList[i]).then(async () => {
        await dayReportFun(newPage)
      });

    }
  }

  let login = async () => {

    await page.goto('https://selfreport.shu.edu.cn/Default.aspx');

    // if(/login/g.exec(page.url())){
    const username = await page.$("input#username");
    await username.type("k1000342");

    const password = await page.$("input#password");
    await password.type("SHhy123456");

    const submitBtn = await page.$("button#submit-button");
    await submitBtn.click();
    //}
    return await page.waitForNavigation({
      waitUntil: "load",
    })
  }
  await login();

  let dayReport = () => {
    return new Promise(async (resolve, reject) => {
      // 每日一报
      const lbReport = await page.$("a#lnkReport");
      await lbReport.click();

      await page.waitForNavigation({
        waitUntil: "load",
      })


      let daysOut14 = false
      try {
        daysOut14 = await page.$eval(".f-messagebox-message", (el) => {
          return el.innerHTML.includes("历史过去14天")
        })

      } catch (error) {

      }
      if (daysOut14) {
        // console.log("侦查到未补保全");
        await page.waitForSelector("a[role=button][id^='fineui_'] > span.f-btn-inner > span.f-btn-text").then(async () => {
          const alertBtns = await page.$$("a[role=button][id^='fineui_'] > span.f-btn-inner > span.f-btn-text")
          await alertBtns[1].click();
          getReportList()
        })

      } else {
        await dayReportFun(page)
      }
      let currentUrl = page.url()
      if (currentUrl.includes("https://selfreport.shu.edu.cn/Default.aspx")) {

        await page.waitForNavigation({
          waitUntil: "load",
        })
        let normalizeA = await page.$("a[href^='XiaoYJ']")
        if (normalizeA) {
          await normalizeA.click()
        }
      } else {
        await page.waitForNavigation({
          waitUntil: "load",
        })
        await southDoor()
      }
      resolve(true);
    })
  }
  // 进入每日一报
  await dayReport();








})();
