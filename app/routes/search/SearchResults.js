"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SearchResults;
var lucide_react_1 = require("lucide-react");
var react_1 = require("react");
var react_router_1 = require("react-router");
var Pagenation_1 = require("./Pagenation");
var ResultRow_1 = require("./ResultRow");
var SearchContext_1 = require("./SearchContext");
function SearchResults(_a) {
    var _b, _c, _d, _e;
    var data = _a.data;
    var ctx = (0, react_1.useContext)(SearchContext_1.default);
    var start = ((_c = (_b = ctx === null || ctx === void 0 ? void 0 : ctx.paging) === null || _b === void 0 ? void 0 : _b.size) !== null && _c !== void 0 ? _c : 0) * (((_e = (_d = ctx === null || ctx === void 0 ? void 0 : ctx.paging) === null || _d === void 0 ? void 0 : _d.page) !== null && _e !== void 0 ? _e : 1) - 1) + 1;
    var navigation = (0, react_router_1.useNavigation)();
    var isLoading = navigation.state === "submitting" || navigation.state === "loading";
    return (<div className="container mx-auto p-4">
      <div className="results">
        {data.total > 0 ? (<div>
            <h2 className="text-xl font-semibold">検索結果 ({data.total}件)</h2>
            <Pagenation_1.default totalItems={data.total}/>

            {isLoading ? (<div className="flex items-center justify-center">
                <lucide_react_1.LoaderCircle className="animate-spin"/>
              </div>) : (<div className="">
                {data.data.map(function (row, index) { return (<ResultRow_1.default row={row} index={index + start} key={row.center.uid}/>); })}
              </div>)}

            {/* Bottom pagination for easier navigation on long results */}
            <div className="mt-6">
              <Pagenation_1.default totalItems={data.total}/>
            </div>
          </div>) : (<div className="text-center py-8 text-gray-500 dark:text-gray-400">
            検索結果はありません
          </div>)}
      </div>
    </div>);
}
