const DateTime = require("luxon").DateTime;
const ConfirmPage = require("../pageobjects/confirm.page");
const LoginPage = require("../pageobjects/login.page");
const MyPage = require("../pageobjects/my.page");
const PlansPage = require("../pageobjects/plans.page");
const ReservePage = require("../pageobjects/reserve.page");
const TopPage = require("../pageobjects/top.page");

describe("第2課題", () => {
  it("無効なメールフォーマットでエラーとなること_サインイン時", async () => {
    await TopPage.open();
    await TopPage.goToLoginPage();
    await LoginPage.email.setValue("invalid-email");
    await LoginPage.password.setValue("password");
    await LoginPage.submit();

    await expect(LoginPage.emailMessage).toHaveText(
      "メールアドレスを入力してください。"
    );
  });

  it("無効なメールフォーマットでエラーとなること_予約時_メール選択", async () => {
    await TopPage.open();
    await TopPage.goToPlansPage();
    await PlansPage.openPlanByTitle("お得な特典付きプラン");
    await browser.switchWindow(/^宿泊予約.+$/);
    await ReservePage.submitButton.waitForClickable();

    await ReservePage.contact.selectByVisibleText("メールでのご連絡");
    await ReservePage.email.setValue("invalid-email");
    await ReservePage.submit();

    await expect(ReservePage.emailMessage).toHaveText(
      "メールアドレスを入力してください。"
    );
  });

  it("無効な電話番号の形式でエラーとなること_予約時_電話番号選択", async () => {
    await ReservePage.username.setValue("テスト太郎");
    await ReservePage.contact.selectByVisibleText("電話でのご連絡");
    await ReservePage.tel.setValue("invalid-phone");

    await ReservePage.submit();

    await expect(ReservePage.telMessage).toHaveText(
      "指定されている形式で入力してください。"
    );
  });
});
