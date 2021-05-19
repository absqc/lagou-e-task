#!/usr/bin/env node

// Node Cli 应用必须要有这样的文件头

//脚手架的工作过程
//1.通过命令行交互询问用户问题
//2.根据用户回答的结果生成文件
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const ejs = require('ejs')

inquirer.prompt([
    {
        type: 'input',
        name: 'name',
        message: 'Project name?'
    }
]).then(answers => {
    console.log(answers);
    //模板目录
    const tmpDir = path.join(__dirname, 'templates')
    // 目标目录
    const destDir = process.cwd()

    // 将模板目录下的文件全部输出到我们的目标目录
    fs.readdir(tmpDir, (err, files) => {
        if (err) throw err
        files.forEach(file => {
            console.log(file)
            //通过模板引擎去渲染
            ejs.renderFile(path.join(tmpDir, file), answers, (err, result) => {
                if (err) throw err
                // 将结果写入目标目录
                fs.writeFileSync(path.join(destDir,file),result)
            })
        })
    })

})
