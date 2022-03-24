export const LAYOUT_TEMPLATE = `<div style="background-color: #f5f6f7; padding: 24px;">
<div style="">
    <a href="https://notbucai.com" target="_blank" style="color: #323430; font-size: 20px;line-height: 36px;text-decoration:none;">
        <span style="font-size: 26px;font-weight: bold;margin-right: 10px;">不才的博客</span>
        <span>notbucai.com</span>
    </a>
    <a href="https://notbucai.com" target="_blank" style="float: right;line-height: 36px;color: #888; text-decoration:none;">
        点击进入网站
    </a>
</div>
<div style="background-color: #fff;box-sizing:border-box;margin: 36px auto;width: 90%;min-height: 36px;padding: 36px;border-radius: 6px;box-shadow:0 4px 20px rgba(100,100,100,0.1)">
  <%--content--%>
</div>
</div>`;
export const SEND_CODE_TEMPLATE = LAYOUT_TEMPLATE.replace('<%--content--%>', `
<h2>您好</h2>
<p style="margin-top: 36px;">请使用下面的验证码验证您的操作，验证码 10 分钟内有效:</p>
<div style="margin-top: 36px;background-color: #ff5252;border-radius: 6px;font-size: 26px;padding: 10px 20px;color: #000;width: 120px;text-align: center;"><%--code--%></div>
`);
