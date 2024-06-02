const ConfirmPage = require("../pageobjects/confirm.page");
const LoginPage = require("../pageobjects/login.page");
const MyPage = require("../pageobjects/my.page");
const PlansPage = require("../pageobjects/plans.page");
const ReservePage = require("../pageobjects/reserve.page");
const TopPage = require("../pageobjects/top.page");

describe("第1課題", () => {
  afterEach(async () => {
    if ((await browser.getWindowHandles()).length > 1) {
      await browser.closeWindow();
    }
    await browser.switchWindow(/^宿泊プラン一覧.+$/);
  });

  it("「宿泊予約確認」画面に前の画面に入力したデータが正しく表示されていること_プレミアム会員ログイン済み", async () => {
    await TopPage.open();
    await TopPage.goToLoginPage();
    await LoginPage.email.setValue("ichiro@example.com");
    await LoginPage.password.setValue("password");
    await LoginPage.submit();
    await MyPage.goToPlansPage();
    await PlansPage.openPlanByTitle("プレミアムプラン");
    await browser.switchWindow(/^宿泊予約.+$/);
    await ReservePage.submitButton.waitForClickable();

    await ReservePage.reserveTerm.setValue("3");
    await ReservePage.headCount.setValue("2");
    await ReservePage.setBreakfastPlan(true);
    await ReservePage.setEarlyCheckInPlan(true);
    await ReservePage.setSightseeingPlan(false);
    await ReservePage.contact.selectByVisibleText("電話でのご連絡");
    await ReservePage.tel.setValue("00011112222");
    await ReservePage.reserveDate.setValue("2024/07/15");
    await ReservePage.submit();

    await expect(ConfirmPage.term).toHaveText(
      "2024年7月15日 〜 2024年7月18日 3泊"
    );
    await expect(ConfirmPage.headCount).toHaveText("2名様");
    await expect(ConfirmPage.plans).toHaveTextContaining("朝食バイキング");
    await expect(ConfirmPage.username).toHaveText("山田一郎様");
    await expect(ConfirmPage.contact).toHaveText("電話：00011112222");
    await ConfirmPage.confirm();

    await expect(ConfirmPage.modalTitle).toHaveText("予約を完了しました");
    await ConfirmPage.close();
    await expect(
      await browser.waitUntil(
        async () => (await browser.getWindowHandles()).length === 1
      )
    ).toBeTruthy();
  });
});
