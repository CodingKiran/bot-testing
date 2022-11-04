const { Telegraf } = require("telegraf");
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  console.log("Received /start command");
  try {
    return ctx.reply(
      `Hello ${ctx.from.first_name} ${ctx.from.last_name}. Please send the mobile number with country code.`
    );
  } catch (e) {
    console.error("error in start action:", e);
    return ctx.reply("Error occured");
  }
});

bot.hears(Number, async (ctx) => {
  const phoneNum = ctx.message.text;

  if (ctx.message.text.length === 13) {
    return ctx.reply(
      "Ok",
      Markup.inlineKeyboard([
        Markup.button.url(
          JSON.stringify(ctx.from.first_name),
          `https://api.whatsapp.com/send?phone=+${JSON.stringify(
            parseInt(ctx.message.text)
          )}`
        ),
      ])
    );
  } else {
    return ctx.reply(
      "❌ Wrong Number. \n \nThe number must be 10 digits along with country code. \n\nTry again. \n\nWrite help for more information"
    );
  }
});

bot.help((ctx) =>
  ctx.reply(
    "Send me the phone number you want to open in whatsapp along with country code. Eg: +911234567890"
  )
);

// AWS event handler syntax (https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html)
exports.handler = async (event) => {
  try {
    await bot.handleUpdate(JSON.parse(event.body));
    return { statusCode: 200, body: "" };
  } catch (e) {
    console.error("error in handler:", e);
    return {
      statusCode: 400,
      body: "This endpoint is meant for bot and telegram communication",
    };
  }
};
