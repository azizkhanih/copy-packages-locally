const fs = require("fs");
const path = require("path");

exports.copyLocally = async (destinationPathList, sourceDirectory) =>
{
  let args = getArgumentTheme(destinationPathList);
  if (!args.isValidArgument)
  {
    consoleLog('project list:');
    Object.keys().forEach(item =>
    {
      consoleLog(item, ' ==> copy to: ' + destinationPathList[item]);
    });

    return;
  }

  const selectedProjectList = args.projectList;

  await selectedProjectList.forEach(async (item) =>
  {
    const destinationDirectory = destinationPathList[item];
    await removeDir(destinationDirectory);
    const destinationRoot = path.resolve(destinationDirectory, '../');
    if (await fs.existsSync(destinationRoot))
    {
      await copyDir(sourceDirectory, destinationDirectory);
      consoleLog(`${ item }`, `copy ${ sourceDirectory } to ${ destinationDirectory }`);
    }
  });
};

/*
 Get theme name from command line "angular cli command".
*/
const getArgumentTheme = (destinationPathList) =>
{
  let isValidArgument = false;

  projectList = [];
  if (process.argv.length > 2)
  {
    process.argv.slice(2, process.argv.length).forEach(function (val, index, array)
    {
      if (Object.keys(destinationPathList).includes(val))
      {
        projectList.push(val);
        isValidArgument = true;
      }
      else
      {
        consoleLog('argument is not valid', val + ' => is not valid project name.');
      }
    });
  }
  else
  {
    Object.keys(destinationPathList).forEach(item => projectList.push(item));
    isValidArgument = true;
  }

  return { 'isValidArgument': isValidArgument, 'projectList': projectList };
};

const consoleLog = (title = "", message = "") =>
{
  console.log("\x1b[37m", title, "\x1b[33m", message, "\x1b[37m", " ");
};

const removeDir = (dir) =>
{
  if (fs.existsSync(dir))
  {
    fs.rmSync(dir, { recursive: true, force: true });
  } else
  {
    consoleLog(`${ dir } - "not found to clear it.`);
  }
};

const copyDir = (from, to) =>
{
  fs.cpSync(from, to, { recursive: true });
};

//TODO: check es6 module
// export { copyLocally as default };

// Make folders recursively.