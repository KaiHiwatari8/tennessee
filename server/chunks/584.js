exports.id = 584;
exports.ids = [584];
exports.modules = {

/***/ 7141:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 9222, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 8301, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 3751, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 4765, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 5192, 23))

/***/ }),

/***/ 4840:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 53, 23))

/***/ }),

/***/ 6876:
/***/ ((module) => {

// Exports
module.exports = {
	"border": "styles_border__iu8zZ",
	"logo_space": "styles_logo_space___3Nii",
	"options_space": "styles_options_space__KyTMq",
	"options": "styles_options__OlkjB",
	"dropdown_wrapper": "styles_dropdown_wrapper__R_sZR"
};


/***/ }),

/***/ 6500:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ ChildLayout),
  "metadata": () => (/* binding */ metadata)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(6786);
// EXTERNAL MODULE: ./node_modules/next/font/google/target.css?{"path":"components/menubar/menubar.tsx","import":"Permanent_Marker","arguments":[{"subsets":["latin"],"weight":"400"}],"variableName":"permanent_marker"}
var menubar_tsx_import_Permanent_Marker_arguments_subsets_latin_weight_400_variableName_permanent_marker_ = __webpack_require__(1554);
var menubar_tsx_import_Permanent_Marker_arguments_subsets_latin_weight_400_variableName_permanent_marker_default = /*#__PURE__*/__webpack_require__.n(menubar_tsx_import_Permanent_Marker_arguments_subsets_latin_weight_400_variableName_permanent_marker_);
// EXTERNAL MODULE: ./components/menubar/styles.module.css
var styles_module = __webpack_require__(6876);
var styles_module_default = /*#__PURE__*/__webpack_require__.n(styles_module);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(2585);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
;// CONCATENATED MODULE: ./components/menubar/menubar.tsx




function MainNavigation() {
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: "flex p-6 w-screen",
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: `logo text-4xl m-0.5 ${(styles_module_default()).logo_space} ${(menubar_tsx_import_Permanent_Marker_arguments_subsets_latin_weight_400_variableName_permanent_marker_default()).className}`,
                children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                    href: "?ref=nav_logo",
                    children: "Tennessee"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: `text-md ${(styles_module_default()).options_space}`,
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("span", {
                        className: `py-3 ${(styles_module_default()).options}`,
                        children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                            href: "/plans",
                            children: "Plan"
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("span", {
                        className: `py-3 ${(styles_module_default()).options}`,
                        children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                            href: "/sights",
                            children: "Sights"
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("span", {
                        className: `py-3 ${(styles_module_default()).options}`,
                        children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                            href: "/checklist",
                            children: "Checklist"
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("span", {
                        className: `py-3 ${(styles_module_default()).options}`,
                        children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                            href: "/photos",
                            children: "Photos"
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("span", {
                        className: `py-3 ${(styles_module_default()).options}`,
                        children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                            href: "/blogs",
                            children: "Blogs"
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("span", {
                        className: `py-3 ${(styles_module_default()).options}`,
                        children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                            href: "/about-me",
                            children: "About Me"
                        })
                    })
                ]
            })
        ]
    });
}

;// CONCATENATED MODULE: ./app/(marketing)/layout.tsx


const metadata = {
    title: "Tennessee",
    description: "Generated by create next app"
};
function ChildLayout({ children  }) {
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx(MainNavigation, {}),
            /*#__PURE__*/ jsx_runtime_.jsx("section", {
                children: children
            })
        ]
    });
}


/***/ })

};
;