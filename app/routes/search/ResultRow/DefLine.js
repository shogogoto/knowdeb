"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DefLine;
var react_router_1 = require("react-router");
function DefLine(_a) {
    var _b;
    var kn = _a.kn;
    return (<div className="break-all">
      <react_router_1.Link to={"/knowde/".concat(kn.uid)} className="hover:underline">
        {((_b = kn.term) === null || _b === void 0 ? void 0 : _b.names) && (<span className="font-semibold text-green-700 dark:text-green-600">
            {kn.term.names.join(", ")}:&nbsp;
          </span>)}
        {kn.sentence}
      </react_router_1.Link>
    </div>);
}
