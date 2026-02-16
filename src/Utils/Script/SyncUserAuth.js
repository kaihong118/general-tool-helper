/* eslint-disable no-undef */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
const readline = require('node:readline');
const Axios = require('axios');
const fs = require('node:fs');

const ENV_PARAMS = {
  DEV: {
    env: 'DEV',
    adminUuid: '32abd7ca-1b05-4a8b-bcf2-940503806bfc',
    authadminserver_base_url: 'https://authadminserverdev.eurus.dev',
    authserver_base_url: 'https://authserverdev.eurus.dev',
  },
  UAT: {
    env: 'UAT',
    adminUuid: '32abd7ca-1b05-4a8b-bcf2-940503806bfc',
    authadminserver_base_url: 'https://authadminserver.eurus.dev',
    authserver_base_url: 'https://authserver.eurus.dev',
  },
  PROD: {
    env: 'PROD',
    adminUuid: '44b833de-20ae-4e93-8ccb-11a801f93c41',
    authadminserver_base_url: 'https://authadminserver.mainnet.eurus.network',
    authserver_base_url: 'https://authserver.mainnet.eurus.network',
  },
};

let global_env = '';
let global_authadminserver_base_url = '';
let global_authserver_base_url = '';
let global_adminUuid = '';
let global_isEnd = false;
let global_accessToken = '';
let global_email = '';
let global_password = '';
let global_ga = '';
let global_appId = null;
let global_appName = '';

// global_env = 'DEV';
// global_email = 'kelvin.lau@metair.org';
// global_password = '';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl._writeToOutput = function _writeToOutput(stringToWrite) {
  if (rl.stdoutMuted) {
    rl.output.write(
      '\x1B[2K\x1B[200D' + '[' + (rl.line.length % 2 == 1 ? '=-' : '-=') + ']'
    );
  } else {
    rl.output.write(stringToWrite);
  }
};

const getInput = async (displayStr, stdoutMuted = false) => {
  rl.stdoutMuted = stdoutMuted;
  console.log(displayStr);
  const output = await new Promise((resolve) => {
    rl.question('', resolve);
  });
  if (output.toUpperCase() === 'END' || output.toUpperCase() === 'EXIT') {
    global_isEnd = true;
    throw new Error('END!');
  }
  return output;
};

const showMenu = async (menu_arr) => {
  rl.output.write('\u001B[2J\u001B[0;0f');
  console.log(`ENV: ${global_env}`);
  console.log(`Selected App ID: ${global_appId}`);
  console.log(`Selected App: ${global_appName}`);
  console.log('Menu');
  console.log('');
  menu_arr.forEach((element) => {
    console.log(`${element.id}. ${element.menuName}`);
  });
  console.log('');
  const selectedMenuNo = await getInput('Input:');
  const selectedMenuObj = menu_arr.find((ele) => ele.id == selectedMenuNo);
  if (selectedMenuObj) {
    if (selectedMenuObj.checkAppIdBol) {
      if (!global_appId) {
        console.log('Please select app first.');
        return;
      }
    }
    await selectedMenuObj.handleMenu();
  }
};

const loginApi = async (email, password, ga) => {
  try {
    const loginBody = {
      nonce: 'dd474954-0f44-4d25-9462-98c6bf1ab23c',
      appId: 0,
      appUuid: global_adminUuid,
      email: email,
      password: password,
      gaCode: ga,
    };
    const config = {
      method: 'post',
      url: global_authserver_base_url + '/account/loginWithGA',
      headers: {
        'Content-Type': 'application/json',
      },
      data: loginBody,
    };
    const resp = await Axios(config);
    if (resp && resp.data && resp.data.data && resp.data.data.accessToken) {
      global_accessToken = resp.data.data.accessToken;
      return true;
    }
  } catch (error) {
    console.log('api failed:', error);
  }
  return false;
};

const appIdListApi = async () => {
  try {
    const config = {
      method: 'get',
      url: global_authadminserver_base_url + '/admin/appIdList',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + global_accessToken,
      },
      params: {},
    };
    const resp = await Axios(config);
    if (resp && resp.data && resp.data.data) {
      return resp.data.data;
    }
  } catch (error) {
    console.log('api failed:', error);
  }
  return [];
};

const roleListApi = async (appId) => {
  try {
    const config = {
      method: 'get',
      url: global_authadminserver_base_url + '/admin/role/list',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + global_accessToken,
      },
      params: {
        appId: appId,
      },
    };
    const resp = await Axios(config);
    if (resp && resp.data && resp.data.data) {
      return resp.data.data;
    }
  } catch (error) {
    console.log('api failed:', error);
  }
  return [];
};

const featureListApi = async (appId) => {
  try {
    const config = {
      method: 'get',
      url: global_authadminserver_base_url + '/admin/feature/list',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + global_accessToken,
      },
      params: {
        appId: appId,
      },
    };
    const resp = await Axios(config);
    if (resp && resp.data && resp.data.data) {
      return resp.data.data;
    }
  } catch (error) {
    console.log('api failed:', error);
  }
  return [];
};

function iterate(arr, target, newArr, previousPath = '') {
  arr.forEach((element) => {
    const currentPath = previousPath + '/' + element.code;
    if (currentPath.includes(target)) {
      // console.log(`${element.id} - ${currentPath} - seq: ${element.seq}`);
      const _currObj = {
        path: currentPath,
        parentPath: previousPath,
        name: element.name,
        code: element.code,
        tag: element.tag,
        featureType: element.featureType,
        isEnabled: element.isEnabled,
        seq: element.seq,
        id: element.id,
      };
      newArr.push(_currObj);
    }
    if (element.children) {
      iterate(element.children, target, newArr, currentPath);
    }
  });
}

const listFeature2 = (arr, target) => {
  const newArr = [];
  iterate(arr, target, newArr);
  return newArr;
};

const listFeature = (input, target, previousCode = '') => {
  for (let index = 0; index < input.length; index++) {
    const element = input[index];
    const current = previousCode + '/' + element.code;
    if (current.includes(target)) {
      console.log(`${element.id} - ${current} - seq: ${element.seq}`);
    }
    if (element.children) {
      listFeature(element.children, target, current);
    }
  }
};

const createFeatureApi = async (
  appId,
  parentFeatureId,
  name,
  code,
  tag,
  featureType,
  ordering
) => {
  const body = {
    appId: appId,
    name: name,
    code: code,
    tag: tag,
    featureType: featureType,
    parentFeatureId: parentFeatureId,
    isEnabled: true,
    ordering: ordering,
  };
  try {
    const config = {
      method: 'post',
      url: global_authadminserver_base_url + '/admin/feature/create',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + global_accessToken,
      },
      data: body,
    };
    const resp = await Axios(config);
    if (resp && resp.data && resp.data.data) {
      return resp.data.data;
    }
  } catch (error) {
    console.log('api failed:', error);
  }
  return null;
};

const handleSelectApp = async () => {
  const appIdListResp = await appIdListApi();
  if (appIdListResp) {
    let appIdObj = {};
    appIdListResp.forEach((element) => {
      console.log(`${element.AppId} - ${element.Name} - ${element.AppUuid}`);
      appIdObj[element.AppId] = element.Name;
    });
    const appIdStr = await getInput('AppId: ');
    global_appId = Number(appIdStr);
    global_appName = appIdObj[global_appId];
  }
};

const handleListRoles = async () => {
  const roleListResp = await roleListApi(global_appId);
  if (roleListResp) {
    roleListResp.forEach((element) => {
      console.log(`${element.roleId} - ${element.roleName}`);
    });
  }
};

const handleListFeatures = async () => {
  const featureListResp = await featureListApi(global_appId);
  if (featureListResp) {
    const target = await getInput('Target permission: ');
    listFeature(featureListResp, target);
  }
};

const handleExportFeatures = async () => {
  const featureListResp = await featureListApi(global_appId);
  if (featureListResp) {
    const target = await getInput('Target permission: ');
    const newArr = listFeature2(featureListResp, target);

    const content = JSON.stringify(newArr);
    fs.writeFile('exportFeatures.json', content, err => {
      if (err) {
        console.error(err);
      } else {
        // file written successfully
        console.log('exportFeatures success');
      }
    });
  }
};

const handleCompareFeatures = async () => {
  const featureListResp = await featureListApi(global_appId);
  if (featureListResp) {
    const _allFeature = listFeature2(featureListResp, '');
    // const newFeaturesArrStr = await new Promise((resolve) => {
    //   rl.question('Compare features array:', resolve);
    // });
    var newFeaturesArrStr = fs.readFileSync('exportFeatures.json', 'utf8');
    const newFeaturesArr = JSON.parse(newFeaturesArrStr);
    const diffFeaturesArr = [];
    for (let index = 0; index < newFeaturesArr.length; index++) {
      const newFeatureEle = newFeaturesArr[index];
      const checkFeatureExist = _allFeature.find(
        (ele) => ele.path == newFeatureEle.path
      );
      if (!checkFeatureExist) {
        diffFeaturesArr.push(newFeatureEle);
        console.log(`${newFeatureEle.path}`);
      }
    }
    console.log('');
    console.log('diffFeaturesArr:');
    console.log(JSON.stringify(diffFeaturesArr));
  }
};

const handleAddFeatures = async () => {
  const featureListResp = await featureListApi(global_appId);
  if (featureListResp) {
    const _allFeature = listFeature2(featureListResp, '');
    const newFeaturesArrStr = await new Promise((resolve) => {
      rl.question('new features array:', resolve);
    });
    const newFeaturesArr = JSON.parse(newFeaturesArrStr);
    for (let index = 0; index < newFeaturesArr.length; index++) {
      const newFeatureEle = newFeaturesArr[index];
      console.log(`Trying to create feature ${newFeatureEle.path} ...`);
      const checkFeatureExist = _allFeature.find(
        (ele) => ele.path == newFeatureEle.path
      );
      if (checkFeatureExist) {
        console.log(`Feature ${newFeatureEle.path} exists`);
        continue;
      }

      let _parentFeatureId = null;
      if (newFeatureEle.parentPath) {
        const parentPermission = _allFeature.find(
          (ele) => ele.path == newFeatureEle.parentPath
        );
        if (parentPermission && parentPermission.id) {
          _parentFeatureId = Number(parentPermission.id);
        } else {
          console.log(`Parent feature ${newFeatureEle.parentPath} not exist`);
          continue;
        }
      } else if (newFeatureEle.parentPath == '') {
        _parentFeatureId = 0;
      }
      if (
        _parentFeatureId ||
        (newFeatureEle.parentPath == '' && _parentFeatureId == 0)
      ) {
        let maxSeq = 0;
        _allFeature.forEach((ele) => {
          if (ele.parentPath == newFeatureEle.parentPath && ele.seq > maxSeq) {
            maxSeq = ele.seq;
          }
        });
        const createFeatureResp = await createFeatureApi(
          global_appId,
          _parentFeatureId,
          newFeatureEle.name,
          newFeatureEle.code,
          newFeatureEle.tag,
          newFeatureEle.featureType,
          maxSeq + 1
        );
        if (createFeatureResp) {
          console.log(
            `Feature ${newFeatureEle.path} created, data: ${createFeatureResp}`
          );
          _allFeature.push({
            path: newFeatureEle.path,
            parentPath: newFeatureEle.parentPath,
            name: newFeatureEle.name,
            code: newFeatureEle.code,
            tag: newFeatureEle.tag,
            featureType: newFeatureEle.featureType,
            isEnabled: 1,
            seq: maxSeq + 1,
            id: createFeatureResp,
          });
        }
      }
    }
  }
};

const loginProcess = async () => {
  if (!global_env) {
    console.log(`1: DEV`);
    console.log(`2: UAT`);
    console.log(`3: PROD`);
    const _inputEnv = await getInput('ENV: ');
    switch (_inputEnv) {
      case '1':
        global_env = ENV_PARAMS.DEV.env;
        break;
      case '2':
        global_env = ENV_PARAMS.UAT.env;
        break;
      case '3':
        global_env = ENV_PARAMS.PROD.env;
        break;
      default:
        throw new Error('END!');
    }
  }
  switch (global_env) {
    case 'DEV':
      global_authadminserver_base_url = ENV_PARAMS.DEV.authadminserver_base_url;
      global_authserver_base_url = ENV_PARAMS.DEV.authserver_base_url;
      global_adminUuid = ENV_PARAMS.DEV.adminUuid;
      break;
    case 'UAT':
      global_authadminserver_base_url = ENV_PARAMS.UAT.authadminserver_base_url;
      global_authserver_base_url = ENV_PARAMS.UAT.authserver_base_url;
      global_adminUuid = ENV_PARAMS.UAT.adminUuid;
      break;
    case 'PROD':
      global_authadminserver_base_url =
        ENV_PARAMS.PROD.authadminserver_base_url;
      global_authserver_base_url = ENV_PARAMS.PROD.authserver_base_url;
      global_adminUuid = ENV_PARAMS.PROD.adminUuid;
      break;
    default:
      throw new Error('END!');
  }
  if (!global_email) {
    global_email = await getInput('Email: ');
  }
  if (!global_password) {
    global_password = await getInput('Password: ', true);
    console.log('');
  }
  global_ga = await getInput('GA: ');
  if (global_email && global_password && global_ga) {
    const loginResult = await loginApi(
      global_email,
      global_password,
      global_ga
    );
    if (loginResult) {
      console.log('login success');
    } else {
      console.log('login failed');
      global_env = '';
      global_email = '';
      global_password = '';
    }
    return loginResult;
  }
  return false;
};

(async () => {
  const menu_arr = [
    {
      id: 1,
      menuName: 'Select App',
      checkAppIdBol: false,
      handleMenu: handleSelectApp,
    },
    {
      id: 2,
      menuName: 'List Roles',
      checkAppIdBol: true,
      handleMenu: handleListRoles,
    },
    {
      id: 3,
      menuName: 'List Features',
      checkAppIdBol: true,
      handleMenu: handleListFeatures,
    },
    {
      id: 4,
      menuName: 'Export Features',
      checkAppIdBol: true,
      handleMenu: handleExportFeatures,
    },
    {
      id: 5,
      menuName: 'Compare Features',
      checkAppIdBol: true,
      handleMenu: handleCompareFeatures,
    },
    {
      id: 6,
      menuName: 'Add Features',
      checkAppIdBol: true,
      handleMenu: handleAddFeatures,
    },
  ];
  let loginResult = false;
  while (!global_isEnd) {
    try {
      if (loginResult) {
        await showMenu(menu_arr);
      } else {
        loginResult = await loginProcess();
      }
    } catch (error) {
      console.log('error:');
      console.log(error);
    }
    if (!global_isEnd) {
      await getInput('Continue...');
    }
  }
  rl.close();
})();
