/*　China Fujian Huanyutong Technology Co., Ltd. */
const vorpal=require("vorpal")(),shell=require("./command/entry")(vorpal);console.log("\n\tWelcome to Voerka IoT Server!\n"),console.log("\tType <help> to get help\n"),vorpal.delimiter("HYT>").show();