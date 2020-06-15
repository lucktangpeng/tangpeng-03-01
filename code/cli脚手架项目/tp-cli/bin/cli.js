#!/usr/bin/env node

const program = require("commander");
const chalk = require("chalk");
const ora = require("ora");
const download = require("download-git-repo");
const { parse } = require("commander");
const tplObj = require(`${__dirname}/../template`);

// 这里写的只是相当于一个帮助信息
// program.usage("<template-name> [project-name]");

program
  .command("init <template> [project]")
  .description("初始化项目模板")
  // 前面是后面的缩写，都是通过force来获取值
  .option("-f, --force <template>")
  // action是前面参数的回调，前面的输入都会在action中拿到，需要后面加.parse(process.argv)，action才会执行
  .action(function (template, project) {
    url = tplObj[template];
    console.log(chalk.white("\n Start generating... \n"));

    // 出现加载图标
    const spinner = ora("Downloading...");
    // 加载的开始
    spinner.start();

    // 执行下载
    // 这里就是通过github上面的地址，然后把模块下载到本地
    download(`direct:${url}`, project, { clone: true }, (err) => {
      if (err) {
        // 加载错误
        spinner.fail();
        console.log(chalk.red(`Generation failed. ${err}`));
        return;
      }
      // 加载成功
      spinner.succeed();
      console.log(chalk.green("\n Generation completed!"));
      console.log("\n To get started");
      console.log(`\n cd ${project} \n`);
    });
  });
program.parse(process.argv);
