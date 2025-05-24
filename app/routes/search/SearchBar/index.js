"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SearchBar;
var lucide_react_1 = require("lucide-react");
var react_1 = require("react");
var react_router_1 = require("react-router");
var SearchContext_1 = require("../SearchContext");
var SearchConfig_1 = require("./SearchConfig");
function SearchBar() {
    var _a, _b;
    var searchContext = (0, react_1.useContext)(SearchContext_1.default);
    var navigation = (0, react_router_1.useNavigation)();
    var submit = (0, react_router_1.useSubmit)();
    var _c = (0, react_1.useState)(false), isShown = _c[0], setShown = _c[1];
    if (!searchContext) {
        throw new Error("SearchBar must be used within a SearchProvider");
    }
    var q = searchContext.q, setQ = searchContext.setQ, searchOption = searchContext.searchOption, setSearchOption = searchContext.setSearchOption, paging = searchContext.paging, setPaging = searchContext.setPaging, order = searchContext.order, setOrderBy = searchContext.setOrderBy;
    var isLoading = navigation.state === "submitting" || navigation.state === "loading";
    var toggleShow = function () { return setShown(!isShown); };
    return (<react_router_1.Form action="/search" method="get" className="container mx-auto p-4">
      <div className="flex w-full relative">
        <input type="search" value={q} name="q" onChange={function (ev) {
            setQ(ev.target.value);
        }} placeholder="検索文字列を入力..." className="w-full border dark:bg-gray-800" disabled={isLoading}/>
        <button type="submit" className="md:w-auto px-2 border bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
          {isLoading ? <lucide_react_1.LoaderCircle className="animate-spin"/> : "🔍"}
        </button>
        <button type="button" className="md:w-auto px-2" onClick={toggleShow} disabled={isLoading}>
          ⚙
        </button>
      </div>
      {isShown && (<SearchConfig_1.default paging={paging} order={order} setPaging={setPaging} setOrderBy={setOrderBy} searchOption={searchOption} setSearchOption={setSearchOption}/>)}

      {/* Hidden inputs to ensure all parameters are included in form submission */}
      <input type="hidden" name="page" value={((_a = paging.page) === null || _a === void 0 ? void 0 : _a.toString()) || "1"}/>
      <input type="hidden" name="size" value={((_b = paging.size) === null || _b === void 0 ? void 0 : _b.toString()) || "100"}/>
      <input type="hidden" name="search_type" value={searchOption}/>

      {/* Order parameters */}
      {Object.entries(order).map(function (_a) {
            var key = _a[0], value = _a[1];
            return value !== undefined && (<input key={key} type="hidden" name={key} value={value.toString()}/>);
        })}
    </react_router_1.Form>);
}
// export function CommandDemo() {
//   return (
//   );
// }
