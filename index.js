// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, cache, entry, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject.parcelRequire === 'function' &&
    globalObject.parcelRequire;
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  globalObject.parcelRequire = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"9a69bea7153a9eaacab8bc6f16455967":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = 12345;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "a985363ba128880e66770ba7cd6ff1d1";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH */

var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept, acceptedAssets; // eslint-disable-next-line no-redeclare

var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = HMR_HOST || location.hostname;
  var port = HMR_PORT || location.port;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    acceptedAssets = {};
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      // Remove error overlay if there is one
      removeErrorOverlay();
      let assets = data.assets.filter(asset => asset.envHash === HMR_ENV_HASH); // Handle HMR Update

      var handled = false;
      assets.forEach(asset => {
        var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

        if (didAccept) {
          handled = true;
        }
      });

      if (handled) {
        console.clear();
        assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });

        for (var i = 0; i < assetsToAccept.length; i++) {
          var id = assetsToAccept[i][1];

          if (!acceptedAssets[id]) {
            hmrAcceptRun(assetsToAccept[i][0], id);
          }
        }
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'error') {
      // Log parcel errors to console
      for (let ansiDiagnostic of data.diagnostics.ansi) {
        let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
        console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
      } // Render the fancy html overlay


      removeErrorOverlay();
      var overlay = createErrorOverlay(data.diagnostics.html);
      document.body.appendChild(overlay);
    }
  };

  ws.onerror = function (e) {
    console.error(e.message);
  };

  ws.onclose = function (e) {
    console.warn('[parcel] 🚨 Connection to the HMR server was lost');
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
    console.log('[parcel] ✨ Error resolved');
  }
}

function createErrorOverlay(diagnostics) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';

  for (let diagnostic of diagnostics) {
    let stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
    errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>
          ${stack}
        </pre>
        <div>
          ${diagnostic.hints.map(hint => '<div>' + hint + '</div>').join('')}
        </div>
      </div>
    `;
  }

  errorHTML += '</div>';
  overlay.innerHTML = errorHTML;
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push([bundle, k]);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    if (asset.type === 'css') {
      var newStyle = document.createElement('style');
      newStyle.innerHTML = asset.output;
      document.body.appendChild(newStyle);
    } else {
      var fn = new Function('require', 'module', 'exports', asset.output);
      modules[asset.id] = [fn, asset.depsByBundle[bundle.HMR_BUNDLE_ID]];
    }
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (v) {
    return hmrAcceptCheck(v[0], v[1]);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached && cached.hot) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      var assetsToAlsoAccept = cb(function () {
        return getParents(global.parcelRequire, id);
      });

      if (assetsToAlsoAccept && assetsToAccept.length) {
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
      }
    });
  }

  acceptedAssets[id] = true;
}
},{}],"9e4bb05f6597d3bd3d3c1e136134b2d2":[function(require,module,exports) {
"use strict";

var _vol = _interopRequireDefault(require("./data/vol1-1.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const index = new FlexSearch();
const resultContainer = document.querySelector('#resultContainer');

for (const id in _vol.default) {
  if (_vol.default.hasOwnProperty(id)) {
    const item = _vol.default[id];
    index.add(id, item.name);
    index.add(id, item.name_en);
  }
}

document.querySelector("#searchText").addEventListener("input", e => {
  const results = index.search(e.target.value, 10);
  const htmls = results.map(id => {
    const item = _vol.default[id];
    const tr = document.createElement('tr');
    return `<tr><th>${id}</th><td>${item.name}</td><td>${item.name_en}</td><td>${item.volume}</td><td>${item.page}</td></tr>`;
  });
  resultContainer.innerHTML = htmls.join('');
});
},{"./data/vol1-1.json":"d72b1fa8b7b5c727d245fb99524f8d89"}],"d72b1fa8b7b5c727d245fb99524f8d89":[function(require,module,exports) {
module.exports = JSON.parse("{\"1\":{\"name\":\"アグニス\",\"name_en\":\"H. agnus\",\"page\":1,\"volume\":1},\"2\":{\"name\":\"アメヂェスタ\",\"name_en\":\"H. amethysta\",\"page\":1,\"volume\":1},\"3\":{\"name\":\"パウシフォリア\",\"name_en\":\"H. angusti. v. paucifolia\",\"page\":1,\"volume\":1},\"4\":{\"name\":\"アラクノイディア\",\"name_en\":\"H. arachnoidea\",\"page\":1,\"volume\":1},\"5\":{\"name\":\"ニガリカンス\",\"name_en\":\"H. arachnoidea v. nigricans\",\"page\":1,\"volume\":1},\"6\":{\"name\":\"ベンテリー\",\"name_en\":\"H. arachnoidea v. nigricans 'Ventery'\",\"page\":1,\"volume\":1},\"7\":{\"name\":\"アラネア\",\"name_en\":\"H. aranea\",\"page\":1,\"volume\":1},\"8\":{\"name\":\"アーチェリー\",\"name_en\":\"H. archeri\",\"page\":1,\"volume\":1},\"9\":{\"name\":\"アルマータ\",\"name_en\":\"H. armata\",\"page\":1,\"volume\":1},\"10\":{\"name\":\"アトロフスカ\",\"name_en\":\"H. atrofsca\",\"page\":2,\"volume\":1},\"11\":{\"name\":\"アトロフスカ\",\"name_en\":\"H. atrofsca\",\"page\":2,\"volume\":1},\"12\":{\"name\":\"バディア\",\"name_en\":\"H. badia\",\"page\":2,\"volume\":1},\"13\":{\"name\":\"ダイアナ\",\"name_en\":\"H. badia'Diana'\",\"page\":2,\"volume\":1},\"14\":{\"name\":\"フロスティ\",\"name_en\":\"H. badia'Frosty'\",\"page\":2,\"volume\":1},\"15\":{\"name\":\"玉鳳\",\"name_en\":\"H. badia'Gyokuho'\",\"page\":2,\"volume\":1},\"16\":{\"name\":\"白鳳\",\"name_en\":\"H. badia'Hakuhou'\",\"page\":2,\"volume\":1},\"17\":{\"name\":\"火の鳥\",\"name_en\":\"H. badia'Hinotori'\",\"page\":2,\"volume\":1},\"18\":{\"name\":\"飛龍\",\"name_en\":\"H. badia'Hiryu'\",\"page\":2,\"volume\":1},\"19\":{\"name\":\"赫鳳\",\"name_en\":\"H. badia'Kakuho'\",\"page\":3,\"volume\":1},\"20\":{\"name\":\"ピンキー\",\"name_en\":\"H. badia'Pinky'\",\"page\":3,\"volume\":1},\"21\":{\"name\":\"翠星\",\"name_en\":\"H. badia'Midoriboshi'\",\"page\":3,\"volume\":1},\"22\":{\"name\":\"紫光\",\"name_en\":\"H. badia'Shikou'\",\"page\":3,\"volume\":1},\"23\":{\"name\":\"栖鳳\",\"name_en\":\"H. badia'Suou'\",\"page\":3,\"volume\":1},\"24\":{\"name\":\"天鳳\",\"name_en\":\"H. badia'Tenho'\",\"page\":3,\"volume\":1},\"25\":{\"name\":\"天紅\",\"name_en\":\"H. badia'Tenkou'\",\"page\":3,\"volume\":1},\"26\":{\"name\":\"夕月\",\"name_en\":\"H. badia'Yuzuki'\",\"page\":3,\"volume\":1},\"27\":{\"name\":\"瑞鳳\",\"name_en\":\"H. badia'Zuihou'\",\"page\":3,\"volume\":1},\"28\":{\"name\":\"ブラックベルディアナ\",\"name_en\":\"H. blackberdiana\",\"page\":4,\"volume\":1},\"29\":{\"name\":\"ボビー\",\"name_en\":\"H. bobii\",\"page\":4,\"volume\":1},\"30\":{\"name\":\"カルバ\",\"name_en\":\"H. calva\",\"page\":4,\"volume\":1},\"31\":{\"name\":\"シリアータ\",\"name_en\":\"H. ciliata\",\"page\":4,\"volume\":1},\"32\":{\"name\":\"太網\",\"name_en\":\"H. comptoniana 'FutoAmi'\",\"page\":4,\"volume\":1},\"33\":{\"name\":\"萩原\",\"name_en\":\"H. comptoniana 'Hagiwara'\",\"page\":4,\"volume\":1},\"34\":{\"name\":\"白鯨\",\"name_en\":\"H. comptoniana 'Hakugei'\",\"page\":4,\"volume\":1},\"35\":{\"name\":\"大瑠璃\",\"name_en\":\"H. comptoniana 'Ooruri'\",\"page\":4,\"volume\":1},\"36\":{\"name\":\"ドドソンオブツーサ\",\"name_en\":\"H. cooperi 'Dodson obtusa\",\"page\":4,\"volume\":1},\"37\":{\"name\":\"黒大窓オブツーサ\",\"name_en\":\"H. cooperi 'Kuroomado'\",\"page\":5,\"volume\":1},\"38\":{\"name\":\"巨大型オブツーサ\",\"name_en\":\"H. cooperi 'Kyodaigata'\",\"page\":5,\"volume\":1},\"39\":{\"name\":\"雫石\",\"name_en\":\"H. cooperi 'Shizukuishi'\",\"page\":5,\"volume\":1},\"40\":{\"name\":\"大黒天\",\"name_en\":\"H. correcta 'Daikokuten'\",\"page\":5,\"volume\":1},\"41\":{\"name\":\"実方コレクタ\",\"name_en\":\"H. correcta 'Sanekata'\",\"page\":5,\"volume\":1},\"42\":{\"name\":\"カミンギー\",\"name_en\":\"H. cummingii\",\"page\":5,\"volume\":1},\"43\":{\"name\":\"カミンギー\",\"name_en\":\"H. cummingii\",\"page\":5,\"volume\":1},\"44\":{\"name\":\"カプリナ\",\"name_en\":\"H. cupurina\",\"page\":5,\"volume\":1},\"45\":{\"name\":\"ダビディ\",\"name_en\":\"H. davidii\",\"page\":5,\"volume\":1},\"46\":{\"name\":\"デシピエンス\",\"name_en\":\"H. decipiens\",\"page\":6,\"volume\":1},\"47\":{\"name\":\"デシピエンス\",\"name_en\":\"H. decipiens\",\"page\":6,\"volume\":1},\"48\":{\"name\":\"ミノール\",\"name_en\":\"H. decipiens v. minor\",\"page\":6,\"volume\":1},\"49\":{\"name\":\"デブリエシー\",\"name_en\":\"H. devriesii\",\"page\":6,\"volume\":1},\"50\":{\"name\":\"ドルディ\",\"name_en\":\"H. doldii\",\"page\":6,\"volume\":1},\"51\":{\"name\":\"アンドロメダ\",\"name_en\":\"H. esterhuizenii 'Andromeda'\",\"page\":6,\"volume\":1},\"52\":{\"name\":\"銀イグアナ\",\"name_en\":\"H. esterhuizenii 'Gin Iguana\",\"page\":6,\"volume\":1},\"53\":{\"name\":\"フロリブンダ\",\"name_en\":\"H. floribunda\",\"page\":6,\"volume\":1},\"54\":{\"name\":\"ギガス\",\"name_en\":\"H. setata v. gigas\",\"page\":6,\"volume\":1},\"55\":{\"name\":\"グロボシフロラ\",\"name_en\":\"H. globosiflora\",\"page\":7,\"volume\":1},\"56\":{\"name\":\"グローエンワルディー\",\"name_en\":\"H. groenwardii\",\"page\":7,\"volume\":1},\"57\":{\"name\":\"イサベラエ\",\"name_en\":\"H. isabellae\",\"page\":7,\"volume\":1},\"58\":{\"name\":\"イソモルフィラ\",\"name_en\":\"H. isomorphra\",\"page\":7,\"volume\":1},\"59\":{\"name\":\"ジェフリーズベイ\",\"name_en\":\"H. jeffreis 'Jeffrey's Bay'\",\"page\":7,\"volume\":1},\"60\":{\"name\":\"ラクノーサ\",\"name_en\":\"H. lachnosa\",\"page\":7,\"volume\":1},\"61\":{\"name\":\"ラクノーサ\",\"name_en\":\"H. lachnosa\",\"page\":7,\"volume\":1},\"62\":{\"name\":\"リビダ\",\"name_en\":\"H. livida\",\"page\":7,\"volume\":1},\"63\":{\"name\":\"ロックウッディ\",\"name_en\":\"H. lockwoodii wide leaf\",\"page\":7,\"volume\":1},\"64\":{\"name\":\"ルプラ\",\"name_en\":\"H. lupula\",\"page\":8,\"volume\":1},\"65\":{\"name\":\"ルプラ\",\"name_en\":\"H. lupula\",\"page\":8,\"volume\":1},\"66\":{\"name\":\"ルテオローサエ\",\"name_en\":\"H. luteorosae\",\"page\":8,\"volume\":1},\"67\":{\"name\":\"長峰マジョール\",\"name_en\":\"H. magnifica v. major'Nagamine'\",\"page\":8,\"volume\":1},\"68\":{\"name\":\"初霜\",\"name_en\":\"H. magnifica v. major'Hatsushimo'\",\"page\":8,\"volume\":1},\"69\":{\"name\":\"ウイミー\",\"name_en\":\"H. magnifica v. major'Wimii '\",\"page\":8,\"volume\":1},\"70\":{\"name\":\"メイリンギー\",\"name_en\":\"H. maraisii v. meiringii\",\"page\":8,\"volume\":1},\"71\":{\"name\":\"マークシー\",\"name_en\":\"H. marxii\",\"page\":8,\"volume\":1},\"72\":{\"name\":\"ベークマニー\",\"name_en\":\"H. mirabilis v. beukmanii\",\"page\":8,\"volume\":1},\"73\":{\"name\":\"モーリシアエ\",\"name_en\":\"H. mucronata v. morrisiae\",\"page\":9,\"volume\":1},\"74\":{\"name\":\"ムチカ\",\"name_en\":\"H. mutica\",\"page\":9,\"volume\":1},\"75\":{\"name\":\"エニグマ\",\"name_en\":\"H. mutica'Enigma'\",\"page\":9,\"volume\":1},\"76\":{\"name\":\"エニグマ\",\"name_en\":\"H. mutica'Enigma'\",\"page\":9,\"volume\":1},\"77\":{\"name\":\"黒ダルマムチカ\",\"name_en\":\"H. mutica'Kurodarumamutica'\",\"page\":9,\"volume\":1},\"78\":{\"name\":\"ホワイトウィドウ\",\"name_en\":\"H. mutica'White widow'\",\"page\":9,\"volume\":1},\"79\":{\"name\":\"ノタビリス\",\"name_en\":\"H. notabilis\",\"page\":9,\"volume\":1},\"80\":{\"name\":\"ノルテリー\",\"name_en\":\"H. nortieri\",\"page\":9,\"volume\":1},\"81\":{\"name\":\"オデッタエ\",\"name_en\":\"H. odetteae\",\"page\":9,\"volume\":1},\"82\":{\"name\":\"オデッタエ\",\"name_en\":\"H. odetteae\",\"page\":10,\"volume\":1},\"83\":{\"name\":\"バークシアナ\",\"name_en\":\"H. parksiana\",\"page\":10,\"volume\":1},\"84\":{\"name\":\"ペーレマニアエ\",\"name_en\":\"H. pehlemanniae\",\"page\":10,\"volume\":1},\"85\":{\"name\":\"天城\",\"name_en\":\"H. picta 'Amagi'\",\"page\":10,\"volume\":1},\"86\":{\"name\":\"紅孔雀\",\"name_en\":\"H. picta 'Benikujaku'\",\"page\":10,\"volume\":1},\"87\":{\"name\":\"クレオパトラ\",\"name_en\":\"H. picta 'Cleopatra'\",\"page\":10,\"volume\":1},\"88\":{\"name\":\"大理\",\"name_en\":\"H. picta 'Dairi'\",\"page\":10,\"volume\":1},\"89\":{\"name\":\"フォーエバービュ＿ティ\",\"name_en\":\"H. picta 'Forever beauty'\",\"page\":10,\"volume\":1},\"90\":{\"name\":\"グレースレディ\",\"name_en\":\"H. picta 'Grace lady'\",\"page\":10,\"volume\":1},\"91\":{\"name\":\"白美人\",\"name_en\":\"H. picta 'Hakubijin'\",\"page\":11,\"volume\":1},\"92\":{\"name\":\"白鳥\",\"name_en\":\"H. picta 'Hakucho'\",\"page\":11,\"volume\":1},\"93\":{\"name\":\"白磁殿\",\"name_en\":\"H. picta 'Hakujiden'\",\"page\":11,\"volume\":1},\"94\":{\"name\":\"花かざり\",\"name_en\":\"H. picta 'Hanakazari'\",\"page\":11,\"volume\":1},\"95\":{\"name\":\"花嫁人形\",\"name_en\":\"H. picta 'Hanayomeningyou'\",\"page\":11,\"volume\":1},\"96\":{\"name\":\"春鹿\",\"name_en\":\"H. picta 'Harushika'\",\"page\":11,\"volume\":1},\"97\":{\"name\":\"微笑\",\"name_en\":\"H. picta 'Hohoemi'\",\"page\":11,\"volume\":1},\"98\":{\"name\":\"皇海\",\"name_en\":\"H. picta 'Koukai'\",\"page\":11,\"volume\":1},\"99\":{\"name\":\"呉竹\",\"name_en\":\"H. picta 'Kuretake'\",\"page\":11,\"volume\":1},\"100\":{\"name\":\"迷路\",\"name_en\":\"H. picta 'Meiro'\",\"page\":12,\"volume\":1},\"101\":{\"name\":\"緑牡丹\",\"name_en\":\"H. picta 'Midoribotan'\",\"page\":12,\"volume\":1},\"102\":{\"name\":\"ミラクルピクタA\",\"name_en\":\"H. picta 'Miracle A'\",\"page\":12,\"volume\":1},\"103\":{\"name\":\"ミラクルピクタB\",\"name_en\":\"H. picta 'Miracle B'\",\"page\":12,\"volume\":1},\"104\":{\"name\":\"桃山\",\"name_en\":\"H. picta 'Momoyama'\",\"page\":12,\"volume\":1},\"105\":{\"name\":\"夢幻\",\"name_en\":\"H. picta 'Mugen'\",\"page\":12,\"volume\":1},\"106\":{\"name\":\"踊り子\",\"name_en\":\"H. picta 'Odoriko'\",\"page\":12,\"volume\":1},\"107\":{\"name\":\"オリオン\",\"name_en\":\"H. picta 'Orion'\",\"page\":12,\"volume\":1},\"108\":{\"name\":\"パール\",\"name_en\":\"H. picta 'Pearl'\",\"page\":12,\"volume\":1},\"109\":{\"name\":\"ロイヤル\",\"name_en\":\"H. picta 'Royal'\",\"page\":13,\"volume\":1},\"110\":{\"name\":\"砂王女\",\"name_en\":\"H. picta 'Saoujo'\",\"page\":13,\"volume\":1},\"111\":{\"name\":\"深海\",\"name_en\":\"H. picta 'Shinkai'\",\"page\":13,\"volume\":1},\"112\":{\"name\":\"白大理\",\"name_en\":\"H. picta 'Shirodairi'\",\"page\":13,\"volume\":1},\"113\":{\"name\":\"白サンゴ\",\"name_en\":\"H. picta 'Shirosango'\",\"page\":13,\"volume\":1},\"114\":{\"name\":\"スノーファンタジ一\",\"name_en\":\"H. picta 'Snow fantasy'\",\"page\":13,\"volume\":1},\"115\":{\"name\":\"スノースター\",\"name_en\":\"H. picta 'Snow star'\",\"page\":13,\"volume\":1},\"116\":{\"name\":\"スノーホワイト\",\"name_en\":\"H. picta 'Snow white No. 1'\",\"page\":13,\"volume\":1},\"117\":{\"name\":\"蘇芳\",\"name_en\":\"H. picta 'Suou'\",\"page\":13,\"volume\":1},\"118\":{\"name\":\"タイタン\",\"name_en\":\"H. picta 'Taitan'\",\"page\":14,\"volume\":1},\"119\":{\"name\":\"桃源香\",\"name_en\":\"H. picta 'Tougenko'\",\"page\":14,\"volume\":1},\"120\":{\"name\":\"薄化粧\",\"name_en\":\"H. picta 'Usugesho'\",\"page\":14,\"volume\":1},\"121\":{\"name\":\"プベッセンス\",\"name_en\":\"H. pubescens\",\"page\":14,\"volume\":1},\"122\":{\"name\":\"萩原ピグマエア\",\"name_en\":\"H. pygmaea 'Hagiwara'\",\"page\":14,\"volume\":1},\"123\":{\"name\":\"白磁\",\"name_en\":\"H. pygmaea 'Hakuji'\",\"page\":14,\"volume\":1},\"124\":{\"name\":\"白王\",\"name_en\":\"H. pygmaea 'Hakuou'\",\"page\":14,\"volume\":1},\"125\":{\"name\":\"雪の里\",\"name_en\":\"H. pygmaea 'Yukinosato'\",\"page\":14,\"volume\":1},\"126\":{\"name\":\"レガリス\",\"name_en\":\"H. regalis\",\"page\":14,\"volume\":1},\"127\":{\"name\":\"レティキュラータ\",\"name_en\":\"H. reticulata\",\"page\":15,\"volume\":1},\"128\":{\"name\":\"レティキュラータ\",\"name_en\":\"H. reticulata\",\"page\":15,\"volume\":1},\"129\":{\"name\":\"ハーリンギー\",\"name_en\":\"H. reticulatav.hurlingi\",\"page\":15,\"volume\":1},\"130\":{\"name\":\"サファイア\",\"name_en\":\"H. sappaia\",\"page\":15,\"volume\":1},\"131\":{\"name\":\"シュルドチアナ\",\"name_en\":\"H. shuldtiana\",\"page\":15,\"volume\":1},\"132\":{\"name\":\"サブグラウカ\",\"name_en\":\"H. subglauca\",\"page\":15,\"volume\":1},\"133\":{\"name\":\"スプレンデンス\",\"name_en\":\"H. splendens\",\"page\":15,\"volume\":1},\"134\":{\"name\":\"スプレンデンス\",\"name_en\":\"H. splendens\",\"page\":15,\"volume\":1},\"135\":{\"name\":\"スプレンデンス\",\"name_en\":\"H. splendens\",\"page\":16,\"volume\":1},\"136\":{\"name\":\"オードリー\",\"name_en\":\"H. splendens 'Audrey'\",\"page\":16,\"volume\":1},\"137\":{\"name\":\"オードリー\",\"name_en\":\"H. splendens 'Audrey'\",\"page\":16,\"volume\":1},\"138\":{\"name\":\"オードリー\",\"name_en\":\"H. splendens 'Audrey'\",\"page\":16,\"volume\":1},\"139\":{\"name\":\"オードリー\",\"name_en\":\"H. splendens 'Audrey'\",\"page\":16,\"volume\":1},\"140\":{\"name\":\"赤カサゴ\",\"name_en\":\"H. splendens 'Akakasago'\",\"page\":16,\"volume\":1},\"141\":{\"name\":\"赤サンゴ\",\"name_en\":\"H. splendens 'Akasango'\",\"page\":16,\"volume\":1},\"142\":{\"name\":\"赤肌No\",\"name_en\":\"H. splendens 'AkahadaNo.2'\",\"page\":16,\"volume\":1},\"143\":{\"name\":\"紅葵\",\"name_en\":\"H. splendens 'Beniaoi'\",\"page\":16,\"volume\":1},\"144\":{\"name\":\"ボブスレッド\",\"name_en\":\"H. splendens 'Bob'sRed'\",\"page\":16,\"volume\":1},\"145\":{\"name\":\"ブーメラン\",\"name_en\":\"H. splendens 'Boomerang'\",\"page\":17,\"volume\":1},\"146\":{\"name\":\"ブラックスプレンデンス\",\"name_en\":\"H. splendens 'Black'\",\"page\":17,\"volume\":1},\"147\":{\"name\":\"ブラックグレイ\",\"name_en\":\"H. splendens 'Blackgrey'\",\"page\":17,\"volume\":1},\"148\":{\"name\":\"グレースター\",\"name_en\":\"H. splendens 'Greystar'\",\"page\":17,\"volume\":1},\"149\":{\"name\":\"花葵\",\"name_en\":\"H. splendens 'Hanaaoi'\",\"page\":17,\"volume\":1},\"150\":{\"name\":\"花園\",\"name_en\":\"H. splendens 'Hanazono'\",\"page\":17,\"volume\":1},\"151\":{\"name\":\"関白\",\"name_en\":\"H. splendens 'Kanpaku'\",\"page\":17,\"volume\":1},\"152\":{\"name\":\"マルクスレッド\",\"name_en\":\"H. sprendens 'Marxred'\",\"page\":17,\"volume\":1},\"153\":{\"name\":\"ピンクストーン\",\"name_en\":\"H. splendens 'Pinkstone'\",\"page\":17,\"volume\":1},\"154\":{\"name\":\"白肌赤耳\",\"name_en\":\"H. splendens 'Shirohadaakamimi'\",\"page\":18,\"volume\":1},\"155\":{\"name\":\"シルバーキング\",\"name_en\":\"H. splendens 'Silverking'\",\"page\":18,\"volume\":1},\"156\":{\"name\":\"シルバークイーン\",\"name_en\":\"H. splendens 'Silverqueen'\",\"page\":18,\"volume\":1},\"157\":{\"name\":\"シルバーストーン\",\"name_en\":\"H. splendens 'Silverstone'\",\"page\":18,\"volume\":1},\"158\":{\"name\":\"ホワイトマクローサ\",\"name_en\":\"H. splendens 'Whitemacrosa'\",\"page\":18,\"volume\":1},\"159\":{\"name\":\"スプリングボクブラケンシス\",\"name_en\":\"H. springbokvlakensis\",\"page\":18,\"volume\":1},\"160\":{\"name\":\"スプリングボクブラケンシス\",\"name_en\":\"H. springbokvlakensis\",\"page\":18,\"volume\":1},\"161\":{\"name\":\"ザラ窓\",\"name_en\":\"H. springbokvlakensis 'Zaramado'\",\"page\":18,\"volume\":1},\"162\":{\"name\":\"キング\",\"name_en\":\"H. silviae 'King'\",\"page\":18,\"volume\":1},\"163\":{\"name\":\"スーパースター\",\"name_en\":\"H. silviae 'Superstar'\",\"page\":19,\"volume\":1},\"164\":{\"name\":\"テネラ\",\"name_en\":\"H. tenera\",\"page\":19,\"volume\":1},\"165\":{\"name\":\"トウーリス\",\"name_en\":\"H. toris\",\"page\":19,\"volume\":1},\"166\":{\"name\":\"トリタヤエンシス\",\"name_en\":\"H. tretyrensis\",\"page\":19,\"volume\":1},\"167\":{\"name\":\"ベヌスタ\",\"name_en\":\"H. venusta\",\"page\":19,\"volume\":1},\"168\":{\"name\":\"ヴェルチナ\",\"name_en\":\"H. veltina\",\"page\":19,\"volume\":1},\"169\":{\"name\":\"風の妖精\",\"name_en\":\"H. vilosa 'Kazenoyousei'\",\"page\":19,\"volume\":1},\"170\":{\"name\":\"ヴィオラセア\",\"name_en\":\"H. violacea\",\"page\":19,\"volume\":1},\"171\":{\"name\":\"ウィロモーレンシス\",\"name_en\":\"H. weromorensis\",\"page\":19,\"volume\":1},\"172\":{\"name\":\"雨音\",\"name_en\":\"H. maughanii 'Amaoto'\",\"page\":20,\"volume\":1},\"173\":{\"name\":\"嵐山\",\"name_en\":\"H. maughanii 'Arashiyama'\",\"page\":20,\"volume\":1},\"174\":{\"name\":\"アスラン\",\"name_en\":\"H. maughanii 'Asuran'\",\"page\":20,\"volume\":1},\"175\":{\"name\":\"天照\",\"name_en\":\"H. maughanii 'Amaterasu'\",\"page\":20,\"volume\":1},\"176\":{\"name\":\"アメーバーⅡ\",\"name_en\":\"H. maughani 'AmeberI'\",\"page\":20,\"volume\":1},\"177\":{\"name\":\"網笠\",\"name_en\":\"H. maughani 'Amigasa'\",\"page\":20,\"volume\":1},\"178\":{\"name\":\"安寿\",\"name_en\":\"H. maughani 'Anju'\",\"page\":20,\"volume\":1},\"179\":{\"name\":\"オーロラ\",\"name_en\":\"H. maughani 'Aurora'\",\"page\":20,\"volume\":1},\"180\":{\"name\":\"彩\",\"name_en\":\"H. maughani 'Aya'\",\"page\":20,\"volume\":1},\"181\":{\"name\":\"万雷\",\"name_en\":\"H. maughanii 'Banrai'\",\"page\":21,\"volume\":1},\"182\":{\"name\":\"白象\",\"name_en\":\"H. maughanii 'Byakuzo'\",\"page\":21,\"volume\":1},\"183\":{\"name\":\"白夜\",\"name_en\":\"H. maughanii 'Byakuya'\",\"page\":21,\"volume\":1},\"184\":{\"name\":\"白匠\",\"name_en\":\"H. maughanii 'Byakusho'\",\"page\":21,\"volume\":1},\"185\":{\"name\":\"ブラックホール\",\"name_en\":\"H. maughanii 'Blackhole'\",\"page\":21,\"volume\":1},\"186\":{\"name\":\"珍竜\",\"name_en\":\"H. maughani 'Chinryu'\",\"page\":21,\"volume\":1},\"187\":{\"name\":\"シンデレラ\",\"name_en\":\"H. maughanii 'Cinderella'\",\"page\":21,\"volume\":1},\"188\":{\"name\":\"大白雲\",\"name_en\":\"H. maughanii 'Oaihakuun'\",\"page\":21,\"volume\":1},\"189\":{\"name\":\"曇天の稲妻\",\"name_en\":\"H. maughanii 'Dontenno inazuma'\",\"page\":21,\"volume\":1},\"190\":{\"name\":\"ドラゴン\",\"name_en\":\"H. maughanii 'Dragon'\",\"page\":22,\"volume\":1},\"191\":{\"name\":\"恵比須\",\"name_en\":\"H. maughanii 'Ebisu'\",\"page\":22,\"volume\":1},\"192\":{\"name\":\"アイガー\",\"name_en\":\"H. maughanii 'Eiger'\",\"page\":22,\"volume\":1},\"193\":{\"name\":\"永楽\",\"name_en\":\"H. maughanii 'Eiraku'\",\"page\":22,\"volume\":1},\"194\":{\"name\":\"エメラルドスター\",\"name_en\":\"H. maughaniiEmeraldstar\",\"page\":22,\"volume\":1},\"195\":{\"name\":\"笑\",\"name_en\":\"H. maughanii 'Emi'\",\"page\":22,\"volume\":1},\"196\":{\"name\":\"エベレスト\",\"name_en\":\"H. maughanii 'Evelest'\",\"page\":22,\"volume\":1},\"197\":{\"name\":\"ファンタジ一\",\"name_en\":\"H. maughanii 'Fantasy'\",\"page\":22,\"volume\":1},\"198\":{\"name\":\"富士の華\",\"name_en\":\"H. maughaniiFujinohana\",\"page\":22,\"volume\":1},\"199\":{\"name\":\"富士の春\",\"name_en\":\"H. maughaniiFujinoharu\",\"page\":23,\"volume\":1},\"200\":{\"name\":\"富士の海原\",\"name_en\":\"H. maughaniiFujinounabara\",\"page\":23,\"volume\":1},\"201\":{\"name\":\"富士の雷\",\"name_en\":\"H. maughaniiFujinora\",\"page\":23,\"volume\":1},\"202\":{\"name\":\"富士の竜華\",\"name_en\":\"H. maughaniiFujinoryuka\",\"page\":23,\"volume\":1},\"203\":{\"name\":\"富士山\",\"name_en\":\"H. maughaniiFujisan\",\"page\":23,\"volume\":1},\"204\":{\"name\":\"富士雲海\",\"name_en\":\"H. maughaniiFujiunka\",\"page\":23,\"volume\":1},\"205\":{\"name\":\"醍醐\",\"name_en\":\"H. maughanii 'Daigo'\",\"page\":23,\"volume\":1},\"206\":{\"name\":\"大白星\",\"name_en\":\"H. maughanii 'Daihakusei'\",\"page\":23,\"volume\":1},\"207\":{\"name\":\"大観\",\"name_en\":\"H. maughanii 'Daikan'\",\"page\":23,\"volume\":1},\"208\":{\"name\":\"大仙\",\"name_en\":\"H. maughanii 'Daisen'\",\"page\":24,\"volume\":1},\"209\":{\"name\":\"童夢\",\"name_en\":\"H. maughanii 'Domu'\",\"page\":24,\"volume\":1},\"210\":{\"name\":\"風雷\",\"name_en\":\"H. maughanii 'Furai'\",\"page\":24,\"volume\":1},\"211\":{\"name\":\"銀月\",\"name_en\":\"H. maughanii 'Gingetsu'\",\"page\":24,\"volume\":1},\"212\":{\"name\":\"銀月\",\"name_en\":\"H. maughanii 'Gingetsu'\",\"page\":24,\"volume\":1},\"213\":{\"name\":\"銀雷\",\"name_en\":\"H. maughani 'Ginrai'\",\"page\":24,\"volume\":1},\"214\":{\"name\":\"銀嶺\",\"name_en\":\"H. maughani 'Ginrei'\",\"page\":24,\"volume\":1},\"215\":{\"name\":\"銀竜帝\",\"name_en\":\"H. maughani 'Ginryutei'\",\"page\":24,\"volume\":1},\"216\":{\"name\":\"銀世界\",\"name_en\":\"H. maughani 'Ginsekai'\",\"page\":25,\"volume\":1},\"218\":{\"name\":\"銀司光\",\"name_en\":\"H. maughani 'Ginshiko'\",\"page\":25,\"volume\":1},\"219\":{\"name\":\"銀山\",\"name_en\":\"H. maughanii 'Ginzan'\",\"page\":25,\"volume\":1},\"220\":{\"name\":\"五光\",\"name_en\":\"H. maughanii 'Goko'\",\"page\":25,\"volume\":1},\"221\":{\"name\":\"極楽鳥\",\"name_en\":\"H. maughanii 'Gokurakucho'\",\"page\":25,\"volume\":1},\"222\":{\"name\":\"紅蓮\",\"name_en\":\"H. maughanii 'Guren'\",\"page\":25,\"volume\":1},\"223\":{\"name\":\"羽衣\",\"name_en\":\"H. maughanii 'Hagoromo'\",\"page\":25,\"volume\":1},\"224\":{\"name\":\"白磁レンズ\",\"name_en\":\"H. maughanii 'Hakujilenz'\",\"page\":25,\"volume\":1},\"225\":{\"name\":\"白俊\",\"name_en\":\"H. maughanii 'Hakushun'\",\"page\":25,\"volume\":1},\"226\":{\"name\":\"花菱\",\"name_en\":\"H. maughani 'Hanabishi'\",\"page\":26,\"volume\":1},\"227\":{\"name\":\"花衣\",\"name_en\":\"H. maughanii 'Hanagoromo'\",\"page\":26,\"volume\":1},\"228\":{\"name\":\"花道\",\"name_en\":\"H. maughanii 'Hanamichi'\",\"page\":26,\"volume\":1},\"229\":{\"name\":\"春茜\",\"name_en\":\"H. maughanii 'Haruakane'\",\"page\":26,\"volume\":1},\"230\":{\"name\":\"春王\",\"name_en\":\"H. maughanii 'Haruo'\",\"page\":26,\"volume\":1},\"231\":{\"name\":\"服部トリコロール\",\"name_en\":\"H. maughani 'Hatoritricolor'\",\"page\":26,\"volume\":1},\"232\":{\"name\":\"隼\",\"name_en\":\"H. maughanii 'Hayabusa'\",\"page\":26,\"volume\":1},\"233\":{\"name\":\"飛燕\",\"name_en\":\"H. maughani 'Hien'\",\"page\":26,\"volume\":1},\"234\":{\"name\":\"光新星\",\"name_en\":\"H. maughani 'Hikarishinsei'\",\"page\":26,\"volume\":1},\"235\":{\"name\":\"晩蝉\",\"name_en\":\"H. maughani 'Higurashi'\",\"page\":27,\"volume\":1},\"236\":{\"name\":\"聖\",\"name_en\":\"H. maughani 'Hijiri'\",\"page\":27,\"volume\":1},\"237\":{\"name\":\"響\",\"name_en\":\"H. maughani 'Hibiki'\",\"page\":27,\"volume\":1},\"238\":{\"name\":\"飛翔\",\"name_en\":\"H. maughani 'Hisho'\",\"page\":27,\"volume\":1},\"239\":{\"name\":\"放光\",\"name_en\":\"H. maughanii 'Hoko'\",\"page\":27,\"volume\":1},\"240\":{\"name\":\"誉\",\"name_en\":\"H. maughanii 'Homare'\",\"page\":27,\"volume\":1},\"241\":{\"name\":\"宝輪\",\"name_en\":\"H. maughani 'Horin'\",\"page\":27,\"volume\":1},\"242\":{\"name\":\"百雷\",\"name_en\":\"H. maughani 'Hyakurai'\",\"page\":27,\"volume\":1},\"243\":{\"name\":\"一番\",\"name_en\":\"H. maughani 'Ichiban'\",\"page\":27,\"volume\":1},\"244\":{\"name\":\"アイスオーロラ\",\"name_en\":\"H. maughani 'Ice aurora'\",\"page\":28,\"volume\":1},\"245\":{\"name\":\"斑鳩\",\"name_en\":\"H. maughani 'Ikaruga'\",\"page\":28,\"volume\":1},\"246\":{\"name\":\"稲妻\",\"name_en\":\"H. maughani 'Inazuma'\",\"page\":28,\"volume\":1},\"247\":{\"name\":\"彩春\",\"name_en\":\"H. maughani 'Iroha'\",\"page\":28,\"volume\":1},\"248\":{\"name\":\"蛇紋石\",\"name_en\":\"H. maughani 'Jamonseki'\",\"page\":28,\"volume\":1},\"249\":{\"name\":\"神竜\",\"name_en\":\"H. maughani 'Jinryu'\",\"page\":28,\"volume\":1},\"250\":{\"name\":\"神楽\",\"name_en\":\"H. maughanii 'Kagura'\",\"page\":28,\"volume\":1},\"251\":{\"name\":\"快慶\",\"name_en\":\"H. maughanii 'Kaikei'\",\"page\":28,\"volume\":1},\"252\":{\"name\":\"煌\",\"name_en\":\"H. maughanii  1Kirameki'\",\"page\":28,\"volume\":1},\"253\":{\"name\":\"雲母\",\"name_en\":\"H. maughanii 'Kirara'\",\"page\":29,\"volume\":1},\"254\":{\"name\":\"霧がくれ\",\"name_en\":\"H. maughanii 'Kirigakure'\",\"page\":29,\"volume\":1},\"255\":{\"name\":\"妃\",\"name_en\":\"H. maughanii 'Kisaki'\",\"page\":29,\"volume\":1},\"256\":{\"name\":\"吉祥紋\",\"name_en\":\"H. maughanii 'Kissyomon'\",\"page\":29,\"volume\":1},\"257\":{\"name\":\"光悦\",\"name_en\":\"H. maughanii 'Koetsu'\",\"page\":29,\"volume\":1},\"258\":{\"name\":\"胡弓\",\"name_en\":\"H. maughanii 'Kokyu'\",\"page\":29,\"volume\":1},\"259\":{\"name\":\"晃玉\",\"name_en\":\"H. maughanii 'Kougyoku'\",\"page\":29,\"volume\":1},\"260\":{\"name\":\"晃輝\",\"name_en\":\"H. maughanii 'Kouki'\",\"page\":29,\"volume\":1},\"261\":{\"name\":\"光琳\",\"name_en\":\"H. maughanii 'Kourin'\",\"page\":29,\"volume\":1},\"262\":{\"name\":\"光陽\",\"name_en\":\"H. maughanii 'Koyo'\",\"page\":30,\"volume\":1},\"263\":{\"name\":\"梢\",\"name_en\":\"H. maughanii 'Kozue'\",\"page\":30,\"volume\":1},\"264\":{\"name\":\"京あぶり\",\"name_en\":\"H. maughanii 'Kyoaburi'\",\"page\":30,\"volume\":1},\"265\":{\"name\":\"京三彩\",\"name_en\":\"H. maughanii 'Kyosansai'\",\"page\":30,\"volume\":1},\"266\":{\"name\":\"円\",\"name_en\":\"H. maughanii 'Madoka'\",\"page\":30,\"volume\":1},\"267\":{\"name\":\"舞\",\"name_en\":\"H. maughanii 'Mai'\",\"page\":30,\"volume\":1},\"268\":{\"name\":\"舞姫\",\"name_en\":\"H. maughanii 'Maihime'\",\"page\":30,\"volume\":1},\"269\":{\"name\":\"舞孔雀\",\"name_en\":\"H. maughanii 'Maikujaku'\",\"page\":30,\"volume\":1},\"270\":{\"name\":\"曼荼羅\",\"name_en\":\"H. maughanii 'Mandara\",\"page\":30,\"volume\":1},\"271\":{\"name\":\"翠\",\"name_en\":\"H. maughanii 'Midori'\",\"page\":31,\"volume\":1},\"272\":{\"name\":\"緑星\",\"name_en\":\"H. maughanii 'Midoriboshi'\",\"page\":31,\"volume\":1},\"273\":{\"name\":\"帝\",\"name_en\":\"H. maughanii 'Mikado'\",\"page\":31,\"volume\":1},\"274\":{\"name\":\"帝の位\",\"name_en\":\"H. maughanii 'Mikadonokurai'\",\"page\":31,\"volume\":1},\"275\":{\"name\":\"ミレニアム\",\"name_en\":\"H. maughanii 'Mireniam'\",\"page\":31,\"volume\":1},\"276\":{\"name\":\"美雪\",\"name_en\":\"H. maughanii 'Miyuki'\",\"page\":31,\"volume\":1},\"277\":{\"name\":\"みぞれ\",\"name_en\":\"H. maughanii 'Mizore'\",\"page\":31,\"volume\":1},\"278\":{\"name\":\"桃月\",\"name_en\":\"H. maughanii 'Momotsuki'\",\"page\":31,\"volume\":1},\"279\":{\"name\":\"紫鏡\",\"name_en\":\"H. maughanii 'Murasakikagami'\",\"page\":31,\"volume\":1},\"280\":{\"name\":\"無限\",\"name_en\":\"H. maughanii 'Mugen'\",\"page\":32,\"volume\":1},\"281\":{\"name\":\"叢雲\",\"name_en\":\"H. maughanii 'Murakumo'\",\"page\":32,\"volume\":1},\"282\":{\"name\":\"紫万象\",\"name_en\":\"H. maughanii 'Murasaki'\",\"page\":32,\"volume\":1},\"283\":{\"name\":\"妙法\",\"name_en\":\"H. maughanii 'Myoho'\",\"page\":32,\"volume\":1},\"284\":{\"name\":\"中山寺\",\"name_en\":\"H. maughanii 'Nakayamadera'\",\"page\":32,\"volume\":1},\"285\":{\"name\":\"浪の花\",\"name_en\":\"H. maughanii 'Naminohana'\",\"page\":32,\"volume\":1},\"286\":{\"name\":\"鳴神\",\"name_en\":\"H. maughanii 'Narugam,\",\"page\":32,\"volume\":1},\"287\":{\"name\":\"ナスカ\",\"name_en\":\"H. maughanii 'Naska'\",\"page\":32,\"volume\":1},\"288\":{\"name\":\"日輪\",\"name_en\":\"H. maughanii 'Nichirin'\",\"page\":32,\"volume\":1},\"289\":{\"name\":\"西龍\",\"name_en\":\"H. maughanii 'Nishiryu'\",\"page\":33,\"volume\":1},\"290\":{\"name\":\"望\",\"name_en\":\"H. maughanii 'Nozomi'\",\"page\":33,\"volume\":1},\"291\":{\"name\":\"布引\",\"name_en\":\"H. maughanii 'Nunobiki'\",\"page\":33,\"volume\":1},\"292\":{\"name\":\"おぼろげ\",\"name_en\":\"H. maughanii 'Oboroge'\",\"page\":33,\"volume\":1},\"293\":{\"name\":\"大菊\",\"name_en\":\"H. maughanii 'Oogiku'\",\"page\":33,\"volume\":1},\"294\":{\"name\":\"大台\",\"name_en\":\"H. maughanii 'Oodai'\",\"page\":33,\"volume\":1},\"295\":{\"name\":\"大紫\",\"name_en\":\"H. maughanii 'Oomurasaki'\",\"page\":33,\"volume\":1},\"296\":{\"name\":\"オレコレ\",\"name_en\":\"H. maughanii 'Orekore'\",\"page\":33,\"volume\":1},\"297\":{\"name\":\"プラズマ\",\"name_en\":\"H. maughanii 'Plasma'\",\"page\":33,\"volume\":1},\"298\":{\"name\":\"彩海\",\"name_en\":\"H. maughanii 'Saikai'\",\"page\":34,\"volume\":1},\"299\":{\"name\":\"彩光\",\"name_en\":\"H. maughanii 'Saiko'\",\"page\":34,\"volume\":1},\"300\":{\"name\":\"櫻\",\"name_en\":\"H. maughanii 'Sakura'\",\"page\":34,\"volume\":1},\"301\":{\"name\":\"五月雨\",\"name_en\":\"H. maughanii 'Samidare'\",\"page\":34,\"volume\":1},\"302\":{\"name\":\"世海\",\"name_en\":\"H. maughanii 'Sekai'\",\"page\":34,\"volume\":1},\"303\":{\"name\":\"赤竜\",\"name_en\":\"H. maughanii 'Sekiryu\",\"page\":34,\"volume\":1},\"304\":{\"name\":\"旋風\",\"name_en\":\"H. maughanii 'Senpu＇\",\"page\":34,\"volume\":1},\"305\":{\"name\":\"繊細白線\",\"name_en\":\"H. maughanii 'Sensai hakusen'\",\"page\":34,\"volume\":1},\"306\":{\"name\":\"雪峯\",\"name_en\":\"H. maughanii 'Seppo'\",\"page\":34,\"volume\":1},\"307\":{\"name\":\"雪山\",\"name_en\":\"H. maughanii 'Setsuzan'\",\"page\":35,\"volume\":1},\"308\":{\"name\":\"雪光\",\"name_en\":\"H. maughanii 'Setsuko'\",\"page\":35,\"volume\":1},\"309\":{\"name\":\"紫晃星\",\"name_en\":\"H. maughanii 'Shikosei'\",\"page\":35,\"volume\":1},\"310\":{\"name\":\"紫皇帝\",\"name_en\":\"H. maughanii 'Shikoutei'\",\"page\":35,\"volume\":1},\"311\":{\"name\":\"星\",\"name_en\":\"H. maughanii 'Shin'\",\"page\":35,\"volume\":1},\"312\":{\"name\":\"新月\",\"name_en\":\"H. maughanii 'Shingetsu'\",\"page\":35,\"volume\":1},\"313\":{\"name\":\"蜃気楼\",\"name_en\":\"H. maughanii 'Shinkiro'\",\"page\":35,\"volume\":1},\"314\":{\"name\":\"忍\",\"name_en\":\"H. maughanii 'Shinobu'\",\"page\":35,\"volume\":1},\"315\":{\"name\":\"辰砂\",\"name_en\":\"H. maughanii 'Shinsya'\",\"page\":35,\"volume\":1},\"316\":{\"name\":\"潮見\",\"name_en\":\"H. maughanii 'shiomi'\",\"page\":36,\"volume\":1},\"317\":{\"name\":\"白絹\",\"name_en\":\"H. maughanii 'Shiraginu'\",\"page\":36,\"volume\":1},\"318\":{\"name\":\"白梅\",\"name_en\":\"H. maughanii 'Shiraume'\",\"page\":36,\"volume\":1},\"319\":{\"name\":\"白春星\",\"name_en\":\"H. maughanii 'Shiroharuboshi'\",\"page\":36,\"volume\":1},\"320\":{\"name\":\"白孔雀\",\"name_en\":\"H. maughanii 'Shirokujaku'\",\"page\":36,\"volume\":1},\"321\":{\"name\":\"白妙\",\"name_en\":\"H. maughanii 'Shirotae'\",\"page\":36,\"volume\":1},\"322\":{\"name\":\"四天王\",\"name_en\":\"H. maughanii 'Shitenno'\",\"page\":36,\"volume\":1},\"323\":{\"name\":\"紫電改\",\"name_en\":\"H. maughanii 'Shidenkai'\",\"page\":36,\"volume\":1},\"324\":{\"name\":\"紫城\",\"name_en\":\"H. maughanii 'Shijo'\",\"page\":36,\"volume\":1},\"325\":{\"name\":\"篠原オーロラ\",\"name_en\":\"H. maughanii 'Shinohara aurora'\",\"page\":37,\"volume\":1},\"326\":{\"name\":\"白富士\",\"name_en\":\"H. maughanii 'Sirofuji'\",\"page\":37,\"volume\":1},\"327\":{\"name\":\"紫翠\",\"name_en\":\"H. maughanii 'Shisui'\",\"page\":37,\"volume\":1},\"328\":{\"name\":\"手裏剣\",\"name_en\":\"H. maughanii 'Shuriken'\",\"page\":37,\"volume\":1},\"329\":{\"name\":\"シルク\",\"name_en\":\"H. maughanii 'Silk'\",\"page\":37,\"volume\":1},\"330\":{\"name\":\"シリウス\",\"name_en\":\"H. maughanii 'Sirius'\",\"page\":37,\"volume\":1},\"331\":{\"name\":\"スタークイーン\",\"name_en\":\"H. maughanii 'Star queen'\",\"page\":37,\"volume\":1},\"332\":{\"name\":\"酔虎\",\"name_en\":\"H. maughanii 'Suiko'\",\"page\":37,\"volume\":1},\"333\":{\"name\":\"翠星\",\"name_en\":\"H. maughanii 'Suisei'\",\"page\":37,\"volume\":1},\"334\":{\"name\":\"スーパーフレアー\",\"name_en\":\"H. maughanii 'Super flare'\",\"page\":38,\"volume\":1},\"335\":{\"name\":\"スーパー万象\",\"name_en\":\"H. maughanii 'Super manzo'\",\"page\":38,\"volume\":1},\"336\":{\"name\":\"鈴\",\"name_en\":\"H. maughanii 'Suzu'\",\"page\":38,\"volume\":1},\"337\":{\"name\":\"朱雀\",\"name_en\":\"H. maughanii 'Syujaku'\",\"page\":38,\"volume\":1},\"338\":{\"name\":\"雷鳥\",\"name_en\":\"H. maughanii 'Raicho'\",\"page\":38,\"volume\":1},\"339\":{\"name\":\"雷峰\",\"name_en\":\"H. maughanii 'Raiho'\",\"page\":38,\"volume\":1},\"340\":{\"name\":\"雷鼓\",\"name_en\":\"H. maughanii 'Raiko'\",\"page\":38,\"volume\":1},\"341\":{\"name\":\"雷文\",\"name_en\":\"H. maughanii 'Raimon'\",\"page\":38,\"volume\":1},\"342\":{\"name\":\"レインボー\",\"name_en\":\"H. maughanii 'Rainbow'\",\"page\":38,\"volume\":1},\"343\":{\"name\":\"霊峰\",\"name_en\":\"H. maughanii 'Reiho'\",\"page\":39,\"volume\":1},\"344\":{\"name\":\"蓮華\",\"name_en\":\"H. maughanii 'Renge'\",\"page\":39,\"volume\":1},\"345\":{\"name\":\"烈風\",\"name_en\":\"H. maughanii 'Reppu'\",\"page\":39,\"volume\":1},\"346\":{\"name\":\"ルビースポット\",\"name_en\":\"H. maughanii 'Ruby spot'\",\"page\":39,\"volume\":1},\"347\":{\"name\":\"緑輝\",\"name_en\":\"H. maughanii 'Ryokuki'\",\"page\":39,\"volume\":1},\"348\":{\"name\":\"太平\",\"name_en\":\"H. maughanii 'Taihei'\",\"page\":39,\"volume\":1},\"349\":{\"name\":\"大湖\",\"name_en\":\"H. maughanii 'Taiko'\",\"page\":39,\"volume\":1},\"350\":{\"name\":\"高飛車\",\"name_en\":\"H. maughanii 'Takabisha'\",\"page\":39,\"volume\":1},\"351\":{\"name\":\"宝\",\"name_en\":\"H. maughanii 'Takara'\",\"page\":39,\"volume\":1},\"352\":{\"name\":\"天下一品\",\"name_en\":\"H. maughanii 'Tenkaippin'\",\"page\":40,\"volume\":1},\"353\":{\"name\":\"天光\",\"name_en\":\"H. maughanii 'Tenko'\",\"page\":40,\"volume\":1},\"354\":{\"name\":\"天女\",\"name_en\":\"H. maughanii 'Tennyo'\",\"page\":40,\"volume\":1},\"355\":{\"name\":\"天翔\",\"name_en\":\"H. maughanii 'Tensho'\",\"page\":40,\"volume\":1},\"356\":{\"name\":\"桃花鳥\",\"name_en\":\"H. maughanii 'Toki'\",\"page\":40,\"volume\":1},\"357\":{\"name\":\"桃源郷\",\"name_en\":\"H. maughanii 'Tougengo'\",\"page\":40,\"volume\":1},\"358\":{\"name\":\"浮舟\",\"name_en\":\"H. maughanii 'Ukifune'\",\"page\":40,\"volume\":1},\"359\":{\"name\":\"運慶\",\"name_en\":\"H. maughanii 'Unkei'\",\"page\":40,\"volume\":1},\"360\":{\"name\":\"運命\",\"name_en\":\"H. maughanii 'Unmei'\",\"page\":40,\"volume\":1},\"361\":{\"name\":\"采女\",\"name_en\":\"H. maughanii 'Uneme'\",\"page\":41,\"volume\":1},\"362\":{\"name\":\"雲龍\",\"name_en\":\"H. maughanii 'Unryu'\",\"page\":41,\"volume\":1},\"363\":{\"name\":\"ヴィーナス\",\"name_en\":\"H. maughanii 'Venus'\",\"page\":41,\"volume\":1},\"364\":{\"name\":\"ヴィーナス\",\"name_en\":\"H. maughanii 'Venus'\",\"page\":41,\"volume\":1},\"365\":{\"name\":\"湧玉\",\"name_en\":\"H. maughanii 'Wakutama'\",\"page\":41,\"volume\":1},\"366\":{\"name\":\"輪波\",\"name_en\":\"H. maughanii 'Wanami'\",\"page\":41,\"volume\":1},\"367\":{\"name\":\"八千代\",\"name_en\":\"H. maughanii 'Yachiyo'\",\"page\":41,\"volume\":1},\"368\":{\"name\":\"八雲\",\"name_en\":\"H. maughanii 'Yakumo'\",\"page\":41,\"volume\":1},\"369\":{\"name\":\"山本エメラルド\",\"name_en\":\"H. maughanii 'Yamamoto emerald'\",\"page\":41,\"volume\":1},\"370\":{\"name\":\"やすらい\",\"name_en\":\"H. maughanii 'Yasurai'\",\"page\":42,\"volume\":1},\"371\":{\"name\":\"陽光\",\"name_en\":\"H. maughanii 'Yoko'\",\"page\":42,\"volume\":1},\"372\":{\"name\":\"雪葵\",\"name_en\":\"H. maughanii 'Yukiaoi'\",\"page\":42,\"volume\":1},\"373\":{\"name\":\"雪国\",\"name_en\":\"H. maughanii 'Yukiguni'\",\"page\":42,\"volume\":1},\"374\":{\"name\":\"雪紫\",\"name_en\":\"H. maughanii 'Yukimurasaki'\",\"page\":42,\"volume\":1},\"375\":{\"name\":\"タ虹\",\"name_en\":\"H. maughanii 'Yuniji'\",\"page\":42,\"volume\":1}}");
},{}]},{},["9a69bea7153a9eaacab8bc6f16455967","9e4bb05f6597d3bd3d3c1e136134b2d2"], null)

//# sourceMappingURL=index.js.map
